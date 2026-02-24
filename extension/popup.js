// MergeGuard Extension - Popup Script

const API_URL = 'https://mergeguard-temp.vercel.app/api';

// State
let state = {
  connected: false,
  user: null,
  currentPR: null,
  scanResult: null
};

// DOM Elements
const elements = {
  notConnected: document.getElementById('notConnected'),
  connected: document.getElementById('connected'),
  statusBadge: document.getElementById('statusBadge'),
  connectBtn: document.getElementById('connectBtn'),
  scanBtn: document.getElementById('scanBtn'),
  viewReportBtn: document.getElementById('viewReportBtn'),
  prInfo: document.getElementById('prInfo'),
  prNumber: document.getElementById('prNumber'),
  prTitle: document.getElementById('prTitle'),
  prRepo: document.getElementById('prRepo'),
  prAuthor: document.getElementById('prAuthor'),
  scoreSection: document.getElementById('scoreSection'),
  scoreCircle: document.getElementById('scoreCircle'),
  scoreValue: document.getElementById('scoreValue'),
  scoreStatus: document.getElementById('scoreStatus'),
  results: document.getElementById('results'),
  testsCount: document.getElementById('testsCount'),
  securityCount: document.getElementById('securityCount'),
  debtScore: document.getElementById('debtScore'),
  processing: document.getElementById('processing'),
  step1: document.getElementById('step1'),
  step2: document.getElementById('step2'),
  step3: document.getElementById('step3'),
  dashboardLink: document.getElementById('dashboardLink'),
  settingsLink: document.getElementById('settingsLink'),
  logoutLink: document.getElementById('logoutLink')
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadState();
  await detectCurrentPR();
  setupEventListeners();
});

async function loadState() {
  try {
    const stored = await chrome.storage.local.get(['mergeguard_user', 'mergeguard_token']);
    
    if (stored.mergeguard_user && stored.mergeguard_token) {
      state.connected = true;
      state.user = stored.mergeguard_user;
      showConnected();
    } else {
      showNotConnected();
    }
  } catch (error) {
    console.error('Error loading state:', error);
    showNotConnected();
  }
}

async function detectCurrentPR() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) return;
    
    // GitHub PR
    const githubMatch = tab.url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
    if (githubMatch) {
      const [, owner, repo, prNumber] = githubMatch;
      state.currentPR = {
        provider: 'github',
        owner,
        repo,
        number: parseInt(prNumber),
        url: tab.url
      };
      showPRInfo();
      return;
    }
    
    // GitLab MR
    const gitlabMatch = tab.url.match(/gitlab\.com\/([^\/]+)\/([^\/]+)\/-\/merge_requests\/(\d+)/);
    if (gitlabMatch) {
      const [, owner, repo, mrNumber] = gitlabMatch;
      state.currentPR = {
        provider: 'gitlab',
        owner,
        repo,
        number: parseInt(mrNumber),
        url: tab.url
      };
      showPRInfo();
    }
  } catch (error) {
    console.error('Error detecting PR:', error);
  }
}

function showPRInfo() {
  if (!state.currentPR) return;
  
  elements.prInfo.classList.remove('hidden');
  elements.prNumber.textContent = `#${state.currentPR.number}`;
  elements.prRepo.textContent = `${state.currentPR.owner}/${state.currentPR.repo}`;
  
  // Enable scan button
  elements.scanBtn.disabled = false;
}

function showConnected() {
  elements.notConnected.classList.add('hidden');
  elements.connected.classList.remove('hidden');
  elements.statusBadge.classList.add('connected');
  elements.statusBadge.querySelector('.status-text').textContent = 'Connected';
}

function showNotConnected() {
  elements.notConnected.classList.remove('hidden');
  elements.connected.classList.add('hidden');
  elements.statusBadge.classList.remove('connected');
  elements.statusBadge.querySelector('.status-text').textContent = 'Ready';
}

function showProcessing() {
  elements.statusBadge.classList.add('processing');
  elements.statusBadge.querySelector('.status-text').textContent = 'Scanning...';
  
  elements.prInfo.classList.add('hidden');
  elements.scoreSection.classList.add('hidden');
  elements.results.classList.add('hidden');
  elements.processing.classList.remove('hidden');
  
  // Animate steps
  animateStep(elements.step1, 0);
  animateStep(elements.step2, 1500);
  animateStep(elements.step3, 3000);
}

function animateStep(element, delay) {
  setTimeout(() => {
    element.classList.add('active');
    element.classList.remove('completed');
  }, delay);
  
  setTimeout(() => {
    element.classList.remove('active');
    element.classList.add('completed');
  }, delay + 1000);
}

function showResults(result) {
  elements.statusBadge.classList.remove('processing');
  elements.statusBadge.classList.add('connected');
  elements.statusBadge.querySelector('.status-text').textContent = 'Complete';
  
  elements.processing.classList.add('hidden');
  elements.scoreSection.classList.remove('hidden');
  elements.results.classList.remove('hidden');
  
  // Update score
  const score = result.score || 0;
  elements.scoreValue.textContent = score;
  elements.scoreCircle.style.setProperty('--progress', `${score}%`);
  
  // Score status
  if (score >= 95) {
    elements.scoreStatus.textContent = '✅ Passing';
    elements.scoreStatus.className = 'score-status passing';
  } else if (score >= 70) {
    elements.scoreStatus.textContent = '⚠️ Needs Work';
    elements.scoreStatus.className = 'score-status warning';
  } else {
    elements.scoreStatus.textContent = '❌ Failing';
    elements.scoreStatus.className = 'score-status failing';
  }
  
  // Results
  elements.testsCount.textContent = result.testsGenerated || 0;
  
  const securityCount = result.securityIssues || 0;
  elements.securityCount.textContent = securityCount;
  elements.securityCount.className = 'result-value' + (securityCount > 0 ? ' danger' : '');
  
  elements.debtScore.textContent = result.debtScore || 0;
  elements.debtScore.className = 'result-value' + (result.debtScore > 50 ? ' warning' : '');
}

function setupEventListeners() {
  // Connect button
  elements.connectBtn?.addEventListener('click', async () => {
    // Open OAuth flow in new tab
    const authUrl = `${API_URL}/auth/github?callback=extension`;
    await chrome.tabs.create({ url: authUrl });
  });
  
  // Scan button
  elements.scanBtn?.addEventListener('click', async () => {
    if (!state.currentPR) return;
    
    showProcessing();
    
    try {
      const result = await scanCode(state.currentPR);
      showResults(result);
      state.scanResult = result;
    } catch (error) {
      console.error('Scan error:', error);
      alert('Failed to scan code. Please try again.');
      
      elements.statusBadge.classList.remove('processing');
      elements.statusBadge.querySelector('.status-text').textContent = 'Error';
    }
  });
  
  // View Report button
  elements.viewReportBtn?.addEventListener('click', () => {
    if (state.scanResult?.reportId) {
      chrome.tabs.create({ 
        url: `${API_URL}/reports/${state.scanResult.reportId}` 
      });
    }
  });
  
  // Footer links
  elements.dashboardLink?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: `${API_URL}/dashboard` });
  });
  
  elements.settingsLink?.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: `${API_URL}/dashboard/settings` });
  });
  
  elements.logoutLink?.addEventListener('click', async (e) => {
    e.preventDefault();
    await chrome.storage.local.remove(['mergeguard_user', 'mergeguard_token']);
    state.connected = false;
    state.user = null;
    showNotConnected();
  });
}

async function scanCode(prInfo) {
  const stored = await chrome.storage.local.get(['mergeguard_token']);
  const token = stored.mergeguard_token;
  
  const response = await fetch(`${API_URL}/api/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      provider: prInfo.provider,
      owner: prInfo.owner,
      repo: prInfo.repo,
      number: prInfo.number
    })
  });
  
  if (!response.ok) {
    throw new Error('Scan failed');
  }
  
  return await response.json();
}

// Listen for messages from background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCAN_COMPLETE') {
    showResults(message.result);
  }
});
