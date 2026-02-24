# GitLab CI/CD Integration

Add MergeGuard security scanning to your GitLab CI/CD pipeline.

## Quick Setup

Add this to your `.gitlab-ci.yml`:

```yaml
mergeguard:
  image: node:20-alpine
  stage: test
  only:
    - merge_requests
  variables:
    MERGEGUARD_API_URL: "https://your-deployment-url.com/api/verify"
    MERGEGUARD_API_KEY: "$MERGEGUARD_API_KEY"
  script:
    - npm install -g mergeguard-cli
    - mergeguard scan --pr $CI_MERGE_REQUEST_IID --repo $CI_PROJECT_PATH --token $GITLAB_TOKEN
  allow_failure: false
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MERGEGUARD_API_URL` | Yes | Your MergeGuard API endpoint |
| `MERGEGUARD_API_KEY` | Yes | Your API key |
| `GITLAB_TOKEN` | Yes | GitLab token with `api` scope |

## Setup GitLab Token

1. Go to GitLab → Settings → Access Tokens
2. Create new token with:
   - **Name:** MergeGuard
   - **Scopes:** `api`
   - **Expiration:** 1 year
3. Add token as CI/CD variable:
   - Go to Settings → CI/CD → Variables
   - Add `MERGEGUARD_API_KEY` and `GITLAB_TOKEN`

## Example Complete Config

```yaml
stages:
  - test
  - security

mergeguard:
  image: node:20-alpine
  stage: security
  only:
    - merge_requests
  variables:
    MERGEGUARD_API_URL: "https://mergeguard-temp.vercel.app/api/verify"
  script:
    - npm install -g @mergeguard/cli
    - mergeguard scan --pr $CI_MERGE_REQUEST_IID --repo $CI_PROJECT_PATH --token $GITLAB_TOKEN
  allow_failure: false
  tags:
    - docker
```

## Features

✅ Security scanning (50+ checks)  
✅ Test generation  
✅ Debt scoring  
✅ Block bad merges  
✅ Detailed reports  

## Support

- Docs: https://mergeguard-temp.vercel.app
- Issues: https://github.com/Baki39/Mergeguard/issues
