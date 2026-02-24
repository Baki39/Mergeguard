# 🛡️ MergeGuard

> **Ship or Shipwreck** - AI Code Verification Platform

Guard every AI-generated PR. Auto-tests, zero security holes, debt score – merge safe or blocked in 30 seconds.

## 🚀 Features

- 🧪 **Auto-Test Generation** - Generates unit + integration tests in seconds
- 🔒 **Security Scanning** - 50+ vulnerability checks (SQL injection, XSS, secrets, AI threats)
- 📊 **Debt Score** - Know your technical debt at a glance (0-100)
- 🚫 **Merge Blocking** - Set threshold, block PRs below 95%
- ✅ **Verified Badge** - Show off "Verified by MergeGuard" on every PR
- 🔒 **Privacy First** - Your code never leaves your infrastructure

## 🔗 Integrations

### GitHub
Already configured! MergeGuard runs on all pull requests automatically.

### GitLab CI/CD
Add to your `.gitlab-ci.yml`:

```yaml
include: '/mergeguard.gitlab-ci.yml'

mergeguard_security:
  extends: .mergeguard_base
```

Or use our Webhook integration:
1. Go to GitLab → Settings → Webhooks
2. Add URL: `https://your-mergeguard-url.com/api/webhooks/gitlab`
3. Select "Merge request events"

[See full GitLab setup →](./GITLAB_CI_INTEGRATION.md)

### More Coming Soon
- Jenkins
- Bitbucket
- Azure DevOps

## 📦 Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | $0/mo | 10 PRs/month |
| Pro | $19/dev/mo | 300 PRs, 100k AI tokens |
| Team | $99/team/mo | Unlimited, dashboard, API |
| Enterprise | Custom | Self-hosting, SSO, SLA |

## 🛠️ Quick Start

```bash
# Install
npm install

# Setup
cp .env.example .env
npx prisma generate
npx prisma db push

# Run
npm run dev
```

## 📄 License

MIT
