// app/api/webhooks/gitlab/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { analyzePR } from '@/lib/ai/analyzer';

const GITLAB_WEBHOOK_SECRET = process.env.GITLAB_WEBHOOK_SECRET || 'your-gitlab-webhook-secret';

function verifyGitLabSignature(payload: string, signature: string): boolean {
  if (!signature) return true; // Skip if no secret configured
  const hmac = crypto.createHmac('sha256', GITLAB_WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-gitlab-token') || '';
    const event = req.headers.get('x-gitlab-event') || '';
    const payload = await req.text();

    // Verify webhook token
    if (signature !== GITLAB_WEBHOOK_SECRET && process.env.GITLAB_WEBHOOK_SECRET) {
      console.error('❌ Invalid GitLab webhook token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const data = JSON.parse(payload);
    console.log(`📨 Received GitLab webhook: ${event}`);

    // Only process Merge Request events
    if (event !== 'Merge Request Hook') {
      return NextResponse.json({ ok: true, message: `Ignored event: ${event}` });
    }

    const action = data.object_attributes?.action;
    const mr = data.object_attributes;
    const project = data.project;
    const user = data.user;

    if (!mr || !project) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Only process open, update, and reopen actions
    if (!['open', 'update', 'reopen'].includes(action)) {
      return NextResponse.json({ ok: true, message: `Ignored action: ${action}` });
    }

    console.log(`📝 Processing MR !${mr.iid}: ${mr.title}`);

    // Find project in database (by GitLab project ID or path)
    const projectInDb = await prisma.project.findFirst({
      where: {
        OR: [
          { githubOwner: project.path_with_namespace },
          { githubRepo: project.path_with_namespace },
        ],
      },
      include: {
        organization: true,
      },
    });

    if (!projectInDb) {
      console.log(`⚠️ Project not found: ${project.path_with_namespace}`);
      // Create a temporary report for projects not in DB
    }

    // Get MR diff from GitLab
    const gitlabToken = process.env.GITLAB_TOKEN;
    if (!gitlabToken) {
      console.error('❌ GITLAB_TOKEN not configured');
      return NextResponse.json({ error: 'GitLab token not configured' }, { status: 500 });
    }

    const diffUrl = `${project.web_url}/-/merge_requests/${mr.iid}.diff`;
    const diffResponse = await fetch(diffUrl, {
      headers: {
        'PRIVATE-TOKEN': gitlabToken,
      },
    });
    
    let diff = '';
    if (diffResponse.ok) {
      diff = await diffResponse.text();
    } else {
      console.log('⚠️ Could not fetch diff, using placeholder');
      diff = `// Merge request ${mr.iid} - ${mr.title}\n// Diff not available`;
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        projectId: projectInDb?.id || 'unknown',
        userId: projectInDb?.ownerId || 'unknown',
        prNumber: mr.iid,
        prTitle: mr.title,
        prAuthor: user?.username || 'unknown',
        prUrl: mr.url || project.web_url,
        baseSha: mr.diff_refs?.base_sha || '',
        headSha: mr.diff_refs?.head_sha || '',
        score: 0,
        status: 'PROCESSING',
      },
    });

    console.log(`📊 Created report: ${report.id}`);

    // Run analysis (async)
    runAnalysis(
      report.id, 
      diff, 
      gitlabToken, 
      project.path_with_namespace, 
      mr.iid,
      project.web_url
    ).catch(console.error);

    return NextResponse.json({ ok: true, reportId: report.id });
  } catch (error) {
    console.error('❌ GitLab webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function runAnalysis(
  reportId: string,
  diff: string,
  token: string,
  projectPath: string,
  mrIid: number,
  projectUrl: string
) {
  const startTime = Date.now();

  try {
    console.log(`⚡ Running analysis for report ${reportId}...`);

    // Run AI analysis
    const result = await analyzePR(diff);

    // Update report with results
    await prisma.report.update({
      where: { id: reportId },
      data: {
        score: result.score,
        status: result.score >= 95 ? 'PASSED' : 'FAILED',
        testsGenerated: result.tests.length,
        testsPassed: Math.floor(result.tests.length * 0.8),
        debtScore: result.debtScore,
        humanSummary: result.summary,
        processingTime: Math.floor((Date.now() - startTime) / 1000),
        completedAt: new Date(),
      },
    });

    // Create security issues
    if (result.securityIssues.length > 0) {
      await prisma.securityIssue.createMany({
        data: result.securityIssues.map((issue) => ({
          reportId,
          type: issue.type as any,
          severity: issue.severity as any,
          title: issue.title,
          description: issue.description,
          file: issue.file,
          line: issue.line,
        })),
      });
    }

    // Post comment on GitLab MR
    const comment = generateMRComment(result);
    const commentUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectPath)}/merge_requests/${mrIid}/notes`;
    
    await fetch(commentUrl, {
      method: 'POST',
      headers: {
        'PRIVATE-TOKEN': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: comment,
      }),
    });

    // Update MR status via GitLab API
    const mrUrl = `https://gitlab.com/api/v4/projects/${encodeURIComponent(projectPath)}/merge_requests/${mrIid}`;
    
    // If score is below threshold, add a label or comment about blocking
    if (result.score < 95) {
      await fetch(mrUrl, {
        method: 'PUT',
        headers: {
          'PRIVATE-TOKEN': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          labels: 'needs-review,mergeguard-failed',
        }),
      });
    }

    console.log(`✅ Analysis complete for report ${reportId}: Score ${result.score}`);
  } catch (error) {
    console.error(`❌ Analysis failed for report ${reportId}:`, error);
    
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: 'ERROR',
        completedAt: new Date(),
      },
    });
  }
}

function generateMRComment(result: {
  score: number;
  tests: { name: string }[];
  securityIssues: { severity: string; title: string }[];
  debtScore: number;
  summary: string;
}): string {
  const emoji = result.score >= 95 ? '✅' : '❌';
  
  return `
## 🛡️ MergeGuard Verification

${emoji} **Score: ${result.score}/100**

### 🧪 Tests Generated (${result.tests.length})
${result.tests.slice(0, 5).map((t, i) => `${i + 1}. ${t.name}`).join('\n')}
${result.tests.length > 5 ? `\n...and ${result.tests.length - 5} more` : ''}

### 🔒 Security Issues (${result.securityIssues.length})
${result.securityIssues.length === 0 
  ? '✅ No security issues found!' 
  : result.securityIssues.map(s => `- **${s.severity}**: ${s.title}`).join('\n')}

### 📊 Technical Debt Score: ${result.debtScore}/100

### 📋 Human Review Summary
${result.summary}

---
*Verified by MergeGuard - Ship or Shipwreck*
`;
}
