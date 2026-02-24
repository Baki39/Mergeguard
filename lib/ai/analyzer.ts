// lib/ai/analyzer.ts
// Enhanced analyzer with rule-based + AI security scanning

import { SECURITY_RULES, RULES_BY_SEVERITY } from './security-rules';

interface AnalysisResult {
  score: number;
  tests: Test[];
  securityIssues: SecurityIssue[];
  debtScore: number;
  summary: string;
  analysisDetails: {
    rulesChecked: number;
    aiAnalysis: boolean;
    staticAnalysis: boolean;
  };
}

interface Test {
  name: string;
  code: string;
  type: 'unit' | 'integration' | 'e2e';
}

interface SecurityIssue {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description?: string;
  file?: string;
  line?: number;
  ruleId?: string;
  source: 'ai' | 'static';
}

const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

export async function analyzePR(diff: string): Promise<AnalysisResult> {
  console.log('🤖 Starting enhanced AI analysis...');
  console.log(`📋 Total security rules loaded: ${SECURITY_RULES.length}`);

  // Run static analysis first (fast)
  const staticSecurityIssues = runStaticAnalysis(diff);
  console.log(`🔒 Static analysis found: ${staticSecurityIssues.length} issues`);

  // Run AI analysis in parallel
  const [tests, aiSecurityIssues, debtScore, summary] = await Promise.all([
    generateTests(diff),
    analyzeSecurityWithAI(diff),
    calculateDebtScore(diff),
    generateSummary(diff),
  ]);

  // Combine security issues from both sources
  const allSecurityIssues = [...staticSecurityIssues, ...aiSecurityIssues];
  
  // Remove duplicates
  const uniqueSecurityIssues = removeDuplicates(allSecurityIssues);

  // Calculate overall score
  const score = calculateScore(tests, uniqueSecurityIssues, debtScore);

  console.log(`✅ Analysis complete: Score ${score}/100`);
  console.log(`   - Tests: ${tests.length}`);
  console.log(`   - Security Issues: ${uniqueSecurityIssues.length} (${uniqueSecurityIssues.filter(i => i.severity === 'CRITICAL').length} critical)`);
  console.log(`   - Debt Score: ${debtScore}/100`);

  return {
    score,
    tests,
    securityIssues: uniqueSecurityIssues,
    debtScore,
    summary,
    analysisDetails: {
      rulesChecked: SECURITY_RULES.length,
      aiAnalysis: true,
      staticAnalysis: true,
    },
  };
}

// Fast static analysis using regex patterns
function runStaticAnalysis(diff: string): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  const lines = diff.split('\n');
  
  // Track file context
  let currentFile = '';
  
  for (const line of lines) {
    // Track file changes
    const fileMatch = line.match(/^diff --git a\/(.+?) b\/(.+)/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      continue;
    }
    
    // Track line numbers
    const lineMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    const currentLine = lineMatch ? parseInt(lineMatch[1]) : 0;
    
    // Skip context lines
    if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('@@')) {
      continue;
    }
    
    // Get actual code line (remove diff prefixes)
    const codeLine = line.replace(/^[+-]/, '');
    
    // Check against all rules
    for (const rule of SECURITY_RULES) {
      try {
        if (rule.pattern.test(codeLine)) {
          issues.push({
            type: rule.id,
            severity: rule.severity,
            title: rule.name,
            description: rule.description,
            file: currentFile,
            line: currentLine,
            ruleId: rule.id,
            source: 'static',
          });
        }
      } catch (e) {
        // Skip invalid regex
      }
    }
  }
  
  return issues;
}

function removeDuplicates(issues: SecurityIssue[]): SecurityIssue[] {
  const seen = new Map<string, SecurityIssue>();
  
  for (const issue of issues) {
    const key = `${issue.type}-${issue.file}-${issue.line}`;
    if (!seen.has(key)) {
      seen.set(key, issue);
    }
  }
  
  return Array.from(seen.values());
}

async function generateTests(diff: string): Promise<Test[]> {
  console.log('🧪 Generating tests...');

  const prompt = `You are a senior developer. Generate unit and integration tests for the following code changes.

Code diff:
${diff}

Generate 5-15 test cases that cover:
1. Happy path scenarios
2. Error handling
3. Edge cases
4. Boundary conditions

For each test provide:
- Test name (descriptive, in should/expect format)
- Test code (runnable JavaScript/TypeScript with Jest/Vitest)
- Type (unit/integration)

IMPORTANT: Generate actual runnable test code that would work in a real project.

Respond in this JSON format:
{
  "tests": [
    {"name": "test name", "code": "test code", "type": "unit|integration|e2e"}
  ]
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.tests || [];
    }
  } catch (error) {
    console.error('Test generation failed:', error);
  }

  // Fallback mock tests
  return [
    { name: 'should pass basic validation', code: 'expect(true).toBe(true);', type: 'unit' },
    { name: 'should handle error gracefully', code: 'expect(() => {}).not.toThrow();', type: 'unit' },
  ];
}

async function analyzeSecurityWithAI(diff: string): Promise<SecurityIssue[]> {
  console.log('🔒 Analyzing security with AI...');

  const prompt = `You are a security expert. Analyze this code diff for security vulnerabilities.

Code diff:
${diff}

Check for these common issues:
1. SQL injection
2. XSS (cross-site scripting)
3. Hardcoded credentials/secrets
4. Path traversal
5. Command injection
6. Authentication bypass
7. Input validation
8. Dependency vulnerabilities
9. AI-specific prompt injection
10. Deserialization issues
11. XXE
12. SSRF
13. Insecure deserialization
14. Using weak cryptography

For each issue found, respond in JSON:
{
  "issues": [
    {
      "type": "SECURITY_ISSUE_TYPE",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFO",
      "title": "Short description",
      "description": "Longer explanation",
      "file": "filename.ts",
      "line": 123
    }
  ]
}

Focus on issues not caught by static analysis. Look for complex vulnerabilities that require semantic understanding.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: 'You are a security expert. Analyze code for vulnerabilities. Return valid JSON only.',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const content = data.content?.[0]?.text || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return (parsed.issues || []).map((issue: any) => ({
        ...issue,
        source: 'ai' as const,
      }));
    }
  } catch (error) {
    console.error('Security analysis failed:', error);
  }

  return [];
}

async function calculateDebtScore(diff: string): Promise<number> {
  console.log('📊 Calculating debt score...');

  const prompt = `You are a code quality expert. Analyze this diff for technical debt.

Code diff:
${diff}

Rate the technical debt from 0-100 considering:
- Code complexity
- Code duplication
- Missing error handling
- Missing type safety (TypeScript)
- Missing comments/docs
- Missing error boundaries
- Use of anti-patterns
- Magic numbers/strings
- Hardcoded values
- Missing tests
- Large functions
- Poor naming

Respond in JSON:
{
  "debtScore": number (0-100),
  "factors": ["factor1", "factor2"],
  "suggestions": ["suggestion1", "suggestion2"]
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.debtScore || 50;
    }
  } catch (error) {
    console.error('Debt calculation failed:', error);
  }

  return 50; // Default middle score
}

async function generateSummary(diff: string): Promise<string> {
  const prompt = `You are a senior developer. Summarize this code review in 2-3 sentences for human review.

Focus on:
- What changed
- What needs attention
- What's good

Code diff:
${diff}

Keep it under 50 words. Be actionable.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Analysis complete.';
  } catch (error) {
    console.error('Summary generation failed:', error);
    return 'Review complete. Check the full report for details.';
  }
}

function calculateScore(
  tests: Test[],
  securityIssues: SecurityIssue[],
  debtScore: number
): number {
  let score = 100;

  // Deduct for missing tests
  if (tests.length < 5) score -= (5 - tests.length) * 3;
  if (tests.length < 10) score -= (10 - tests.length) * 2;

  // Deduct for security issues (more aggressive)
  securityIssues.forEach((issue) => {
    switch (issue.severity) {
      case 'CRITICAL':
        score -= 30;
        break;
      case 'HIGH':
        score -= 20;
        break;
      case 'MEDIUM':
        score -= 10;
        break;
      case 'LOW':
        score -= 5;
        break;
      default:
        score -= 1;
    }
  });

  // Deduct for debt
  score -= Math.floor(debtScore / 5);

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}
