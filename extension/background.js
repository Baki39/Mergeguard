// MergeGuard Extension - Background Service Worker

const API_URL = 'https://mergeguard-temp.vercel.app';

// Install event
chrome.runtime.onInstalled.addListener(() => {
  console.log('MergeGuard extension installed');
  
  // Set default settings
  chrome.storage.local.set({
    mergeguard_settings: {
      autoScan: true,
      showNotifications: true,
      scoreThreshold: 95
    }
  });
});

// Listen for tab updates to detect PRs
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  if (!tab.url) return;
  
  // Check if it's a PR/MR page
  const isPR = tab.url.includes('/pull/') || tab.url.includes('/merge_requests/');
  
  if (isPR) {
    // Update badge
    chrome.action.setBadgeText({ text: '1', tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId });
    
    // Check auto-scan setting
    const settings = await chrome.storage.local.get('mergeguard_settings');
    if (settings.mergeguard_settings?.autoScan) {
      // Could trigger auto-scan here
    }
  }
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'SCAN_PR':
      handleScanPR(message.data).then(sendResponse);
      return true;
      
    case 'GET_STATUS':
      getExtensionStatus().then(sendResponse);
      return true;
      
    case 'AUTH_CALLBACK':
      handleAuthCallback(message.data).then(sendResponse);
      return true;
  }
});

async function handleScanPR(prInfo) {
  try {
    const { mergeguard_token } = await chrome.storage.local.get('mergeguard_token');
    
    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(mergeguard_token ? { 'Authorization': `Bearer ${mergeguard_token}` } : {})
      },
      body: JSON.stringify(prInfo)
    });
    
    if (!response.ok) {
      throw new Error('Scan failed');
    }
    
    const result = await response.json();
    
    // Show notification if enabled
    const settings = await chrome.storage.local.get('mergeguard_settings');
    if (settings.mergeguard_settings?.showNotifications) {
      showScanNotification(result);
    }
    
    return result;
  } catch (error) {
    console.error('Scan error:', error);
    throw error;
  }
}

async function getExtensionStatus() {
  const { mergeguard_user, mergeguard_token } = await chrome.storage.local.get(
    ['mergeguard_user', 'mergeguard_token']
  );
  
  return {
    connected: !!(mergeguard_user && mergeguard_token),
    user: mergeguard_user
  };
}

async function handleAuthCallback(data) {
  const { token, user } = data;
  
  await chrome.storage.local.set({
    mergeguard_token: token,
    mergeguard_user: user
  });
  
  return { success: true };
}

function showScanNotification(result) {
  const title = result.score >= 95 
    ? '✅ MergeGuard: PR Passing' 
    : '⚠️ MergeGuard: PR Needs Work';
  
  const message = `Score: ${result.score}/100\n${result.securityIssues || 0} security issues found`;
  
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title,
    message
  });
}

// Handle OAuth redirect
chrome.runtime.onAuthRequired.addListener(async (details) => {
  // This would handle the OAuth callback
  console.log('Auth required:', details);
});
