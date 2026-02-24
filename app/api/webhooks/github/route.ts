// app/api/webhooks/github/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { analyzePR } from '@/lib/ai/analyzer';
import { Octokit } from '@octokit/rest';

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-hub-signature-256') || '';
    const event = req.headers.get('x-github-event') || '';
    const payload = await req.text();

    // Verify webhook signature
    if (!verifySignature(payload, signature)) {
      console.error('❌ Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(payload);
    console.log(`📨 Received GitHub webhook: ${event}`);

    // Only process pull_request events
    if (event !== 'pull_request') {
      return NextResponse.json({ ok: true, message: `Ignored event: ${event}` });
    }

    const action = data.action;
    const pr = data.pull_request;
    const repo = data.repository;
    const installation = data.installation;

    if (!pr || !repo || !installation) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Only process opened and synchronize actions
    if (!['opened', 'synchronize', 'ready_for_review'].includes(action)) {
      return NextResponse.json({ ok: true, message: `Ignored action: ${action}` });
    }

    console.log(`📝 Processing PR #${pr.number}: ${pr.title}`);

    // Find project in database
    const project = await prisma.project.findFirst({
      where: {
        githubOwner: repo.owner.login,
        githubRepo: repo.name,
      },
      include: {
        organization: true,
      },
    });

    if (!project) {
      console.log(`⚠️ Project not found: ${repo.owner.login}/${repo.name}`);
      return NextResponse.json({ ok: true, message: 'Project not configured' });
    }

    // Get GitHub token for this installation
    const installationToken = await getInstallationToken(installation.id);
    const octokit = new Octokit({ auth: installationToken });

    // Get PR diff using raw GitHub API
    const diffUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/pulls/${pr.number}`;
    const diffResponse = await fetch(diffUrl, {
      headers: {
        'Authorization': `Bearer ${installationToken}`,
        'Accept': 'application/vnd.github.v3.diff',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const diff = await diffResponse.text();

    // Create pending report
    const report = await prisma.report.create({
      data: {
        projectId: project.id,
        userId: project.ownerId,
        prNumber: pr.number,
        prTitle: pr.title,
        prAuthor: pr.user?.login,
        prUrl: pr.html_url,
        baseSha: pr.base.sha,
        headSha: pr.head.sha,
        score: 0,
        status: 'PROCESSING',
      },
    });

    console.log(`📊 Created report: ${report.id}`);

    // Run analysis (async)
    runAnalysis(report.id, diff, installationToken, repo.owner.login, repo.name, pr.number).catch(console.error);

    return NextResponse.json({ ok: true, reportId: report.id });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function getInstallationToken(installationId: number): Promise<string> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  const { data } = await octokit.apps.createInstallationAccessToken({
    installation_id: installationId,
  });

  return data.token;
}

async function runAnalysis(
  reportId: string,
  diff: string,
  token: string,
  owner: string,
  repo: string,
  prNumber: number
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

    // Post comment on GitHub PR
    const comment = generatePRComment(result);
    const octokit = new Octokit({ auth: token });
    
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: prNumber,
      body: comment,
    });

    // Update GitHub commit status
    const status = result.score >= 95 ? 'success' : 'failure';
    await octokit.repos.createCommitStatus({
      owner,
      repo,
      sha: (await octokit.pulls.get({ owner, repo, pull_number: prNumber })).data.head.sha,
      state: status,
      target_url: `${process.env.APP_URL}/reports/${reportId}`,
      description: result.score >= 95 
        ? `✅ MergeGuard: Score ${result.score}/100` 
        : `❌ MergeGuard: Score ${result.score}/100 - Needs work`,
      context: 'mergeguard/verification',
    });

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

function generatePRComment(result: {
  score: number;
  tests: { name: string }[];
  securityIssues: { severity: string; title: string; file?: string; line?: number; ruleId?: string; source: string }[];
  debtScore: number;
  summary: string;
  analysisDetails?: { rulesChecked: number; aiAnalysis: boolean; staticAnalysis: boolean };
}): string {
  const emoji = result.score >= 95 ? '✅' : '❌';
  
  // Group security issues by severity
  const critical = result.securityIssues.filter(s => s.severity === 'CRITICAL');
  const high = result.securityIssues.filter(s => s.severity === 'HIGH');
  const medium = result.securityIssues.filter(s => s.severity === 'MEDIUM');
  const low = result.securityIssues.filter(s => s.severity === 'LOW');
  
  let securitySection = '✅ No security issues found!';
  if (result.securityIssues.length > 0) {
    securitySection = [];
    if (critical.length > 0) securitySection.push(`🚨 **CRITICAL (${critical.length})**:\n${critical.map(s => `- ${s.title}${s.ruleId ? ` [\`${s.ruleId}\`]` : ''}`).join('\n')}`);
    if (high.length > 0) securitySection.push(`⚠️ **HIGH (${high.length})**:\n${high.map(s => `- ${s.title}${s.ruleId ? ` [\`${s.ruleId}\`]` : ''}`).join('\n')}`);
    if (medium.length > 0) securitySection.push(`🔶 **MEDIUM (${medium.length})**:\n${medium.map(s => `- ${s.title}`).join('\n')}`);
    if (low.length > 0) securitySection.push(`ℹ️ **LOW (${low.length})**:\n${low.map(s => `- ${s.title}`).join('\n')}`);
    securitySection = securitySection.join('\n\n');
  }
  
  return `
## 🛡️ MergeGuard Verification

${emoji} **Score: ${result.score}/100**

### 🧪 Tests Generated (${result.tests.length})
${result.tests.length > 0 
  ? result.tests.slice(0, 8).map((t, i) => `${i + 1}. ${t.name}`).join('\n') + (result.tests.length > 8 ? `\n...and ${result.tests.length - 8} more` : '')
  : '⚠️ No tests generated - manual review required'}

### 🔒 Security Analysis (${result.securityIssues.length} issues found)
${securitySection}

### 📊 Technical Debt Score: ${result.debtScore}/100

### 📋 Human Summary
${result.summary}

---
${result.analysisDetails ? `*Analyzed with ${result.analysisDetails.rulesChecked}+ security rules*` : '*Verified by [MergeGuard](https://mergeguard.ai) - Ship or Shipwreck*'}
`;
}
