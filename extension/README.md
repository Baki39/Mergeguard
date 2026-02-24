# MergeGuard Browser Extension

AI-powered code verification for GitHub PRs, GitLab Merge Requests, and more.

## Features

- 🔍 **One-Click Scanning** - Scan any PR/MR with a single click
- 🔒 **Security Analysis** - 100+ security vulnerability checks
- 🧪 **Test Generation** - Auto-generate unit and integration tests
- 📊 **Debt Scoring** - Know your technical debt at a glance
- ✅ **GitHub & GitLab** - Works with both platforms
- 🔔 **Notifications** - Get notified when scans complete

## Installation

### Chrome & Chromium-based Browsers

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top right corner)
3. Click "Load unpacked"
4. Select the `extension` folder in your MergeGuard project
5. The extension icon will appear in your toolbar

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select `manifest.json` from the extension folder
4. The extension icon will appear in your toolbar

> Note: For Firefox, you may need to use `manifest_version: 2` for permanent installation.

## Setup

1. Click the MergeGuard icon in your toolbar
2. Click "Connect GitHub Account"
3. Sign in with your MergeGuard account
4. Navigate to any GitHub PR or GitLab MR
5. Click "Scan Code" to analyze

## Usage

### On GitHub PRs

1. Open any pull request on GitHub
2. Click the MergeGuard extension icon
3. Click "Scan Code"
4. View results directly in the popup or on the PR page

### On GitLab MRs

1. Open any merge request on GitLab
2. Click the MergeGuard extension icon  
3. Click "Scan Code"
4. View results in the popup

### Keyboard Shortcuts

- `Ctrl+Shift+M` (Cmd+Shift+M on Mac) - Quick scan current PR

## Configuration

Access settings by:
- Clicking the extension icon → Settings link
- Or visiting the MergeGuard dashboard

### Available Settings

- **Auto-scan**: Automatically scan PRs when opened
- **Notifications**: Show desktop notifications for scan results
- **Score Threshold**: Set custom threshold (default: 95)

## Development

```bash
# Build the extension
cd extension

# Load in Chrome
# 1. Go to chrome://extensions
# 2. Enable Developer mode
# 3. Click Load unpacked
# 4. Select this folder
```

## API Integration

The extension communicates with the MergeGuard API:

- **Verify Endpoint**: `/api/verify`
- **Webhook Events**: GitHub/GitLab PR events

## Troubleshooting

### "Not connected" message
- Click "Connect GitHub Account" and sign in

### Scan fails
- Ensure you're on a GitHub PR or GitLab MR page
- Check that you're signed in
- Try refreshing the page

### Extension not appearing
- Check that the extension is enabled in `chrome://extensions`
- Try reloading the extension
- Check for console errors

## License

MIT
