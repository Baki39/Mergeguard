// MergeGuard Extension - Content Script
// Runs on GitHub, GitLab, and Bitbucket pages

(function() {
  'use strict';
  
  // Only run on PR/MR pages
  if (!isPRPage()) return;
  
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    console.log('MergeGuard: Initializing...');
    
    // Detect current PR/MR
    const prInfo = detectPR();
    if (!prInfo) {
      console.log('MergeGuard: No PR detected');
      return;
    }
    
    console.log('MergeGuard: PR detected:', prInfo);
    
    // Inject UI elements
    injectMergeGuardUI(prInfo);
    
    // Listen for PR changes (for single page apps)
    observeURLChanges(prInfo);
  }
  
  function isPRPage() {
    const url = window.location.href;
    return url.includes('/pull/') || 
           url.includes('/merge_requests/') || 
           url.includes('/pulls/');
  }
  
  function detectPR() {
    const url = window.location.href;
    
    // GitHub
    const githubMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
    if (githubMatch) {
      return {
        provider: 'github',
        owner: githubMatch[1],
        repo: githubMatch[2],
        number: parseInt(githubMatch[3])
      };
    }
    
    // GitLab
    const gitlabMatch = url.match(/gitlab\.com\/([^\/]+)\/([^\/]+)\/-\/merge_requests\/(\d+)/);
    if (gitlabMatch) {
      return {
        provider: 'gitlab',
        owner: gitlabMatch[1],
        repo: gitlabMatch[2],
        number: parseInt(gitlabMatch[3])
      };
    }
    
    // Bitbucket
    const bitbucketMatch = url.match(/bitbucket\.org\/([^\/]+)\/([^\/]+)\/pull-requests\/(\d+)/);
    if (bitbucketMatch) {
      return {
        provider: 'bitbucket',
        owner: bitbucketMatch[1],
        repo: bitbucketMatch[2],
        number: parseInt(bitbucketMatch[3])
      };
    }
    
    return null;
  }
  
  function injectMergeGuardUI(prInfo) {
    // GitHub PR page
    if (prInfo.provider === 'github') {
      injectGitHubUI(prInfo);
    }
    // GitLab MR page
    else if (prInfo.provider === 'gitlab') {
      injectGitLabUI(prInfo);
    }
  }
  
  function injectGitHubUI(prInfo) {
    // Find the PR header timeline
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    // Check if already injected
    if (document.getElementById('mergeguard-widget')) return;
    
    // Create widget
    const widget = document.createElement('div');
    widget.id = 'mergeguard-widget';
    widget.className = 'mergeguard-widget';
    widget.innerHTML = `
      <div class="mergeguard-header">
        <div class="mergeguard-logo">🛡️ MergeGuard</div>
        <button class="mergeguard-scan-btn" id="mg-scan-btn">
          <span class="btn-icon">🔍</span> Scan Code
        </button>
      </div>
      <div class="mergeguard-results" id="mg-results" style="display: none;">
        <div class="mergeguard-score">
          <span class="score" id="mg-score">--</span>
          <span class="label">/100</span>
        </div>
        <div class="mergeguard-details">
          <div class="detail-item">
            <span class="icon">🧪</span>
            <span class="text">Tests: <strong id="mg-tests">0</strong></span>
          </div>
          <div class="detail-item">
            <span class="icon">🔒</span>
            <span class="text">Issues: <strong id="mg-issues">0</strong></span>
          </div>
          <div class="detail-item">
            <span class="icon">📊</span>
            <span class="text">Debt: <strong id="mg-debt">0</strong></span>
          </div>
        </div>
      </div>
    `;
    
    // Insert after the conversation header
    const conversationHeader = document.querySelector('.conversation-header');
    if (conversationHeader) {
      conversationHeader.insertAdjacentElement('afterend', widget);
    } else {
      timeline.insertBefore(widget, timeline.firstChild);
    }
    
    // Add styles
    addWidgetStyles();
    
    // Add click handler
    document.getElementById('mg-scan-btn').addEventListener('click', () => {
      scanPR(prInfo);
    });
  }
  
  function injectGitLabUI(prInfo) {
    // Find MR header
    const mrHeader = document.querySelector('.merge-request-details');
    if (!mrHeader) return;
    
    if (document.getElementById('mergeguard-widget')) return;
    
    const widget = document.createElement('div');
    widget.id = 'mergeguard-widget';
    widget.className = 'mergeguard-widget gl-p-4 gl-mb-4 gl-rounded-base gl-border gl-border-gray-200';
    widget.innerHTML = `
      <div class="gl-display-flex gl-align-items-center gl-justify-content-space-between">
        <div class="gl-display-flex gl-align-items-center gl-gap-2">
          <span class="gl-font-size-lg">🛡️</span>
          <span class="gl-font-weight-bold">MergeGuard</span>
        </div>
        <button class="gl-button btn btn-primary" id="mg-scan-btn">
          Scan Code
        </button>
      </div>
      <div class="mergeguard-results" id="mg-results" style="display: none;">
        <div class="gl-display-flex gl-gap-4 gl-mt-3">
          <div>Score: <strong id="mg-score">--</strong>/100</div>
          <div>Tests: <strong id="mg-tests">0</strong></div>
          <div>Issues: <strong id="mg-issues">0</strong></div>
        </div>
      </div>
    `;
    
    mrHeader.insertAdjacentElement('afterend', widget);
    
    document.getElementById('mg-scan-btn').addEventListener('click', () => {
      scanPR(prInfo);
    });
  }
  
  function addWidgetStyles() {
    if (document.getElementById('mergeguard-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'mergeguard-styles';
    styles.textContent = `
      .mergeguard-widget {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
      }
      
      .mergeguard-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .mergeguard-logo {
        font-weight: 600;
        font-size: 16px;
      }
      
      .mergeguard-scan-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .mergeguard-scan-btn:hover {
        background: #059669;
      }
      
      .mergeguard-scan-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
      
      .mergeguard-results {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e5e7eb;
      }
      
      .mergeguard-score {
        text-align: center;
        margin-bottom: 12px;
      }
      
      .mergeguard-score .score {
        font-size: 36px;
        font-weight: 700;
      }
      
      .mergeguard-score .label {
        color: #6b7280;
      }
      
      .mergeguard-details {
        display: flex;
        gap: 16px;
        justify-content: center;
      }
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: #6b7280;
      }
      
      .detail-item strong {
        color: #111827;
      }
    `;
    
    document.head.appendChild(styles);
  }
  
  async function scanPR(prInfo) {
    const btn = document.getElementById('mg-scan-btn');
    const results = document.getElementById('mg-results');
    
    // Show loading
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Scanning...';
    results.style.display = 'none';
    
    try {
      // Get auth token
      const { mergeguard_token } = await chrome.storage.local.get('mergeguard_token');
      
      const response = await fetch('https://mergeguard-temp.vercel.app/api/verify', {
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
      
      // Update UI
      document.getElementById('mg-score').textContent = result.score || '--';
      document.getElementById('mg-tests').textContent = result.testsGenerated || 0;
      document.getElementById('mg-issues').textContent = result.securityIssues || 0;
      document.getElementById('mg-debt').textContent = result.debtScore || 0;
      
      results.style.display = 'block';
      
      // Update button
      btn.innerHTML = result.score >= 95 ? '✅ Passing' : '⚠️ Needs Work';
      
    } catch (error) {
      console.error('MergeGuard scan error:', error);
      btn.innerHTML = '❌ Error';
      alert('Failed to scan. Please try again.');
    } finally {
      btn.disabled = false;
    }
  }
  
  function observeURLChanges(prInfo) {
    let lastUrl = window.location.href;
    
    const observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        
        // Re-check if still on PR page
        if (isPRPage()) {
          const newPrInfo = detectPR();
          if (newPrInfo && newPrInfo.number !== prInfo.number) {
            // New PR - reinitialize
            const widget = document.getElementById('mergeguard-widget');
            if (widget) widget.remove();
            init();
          }
        }
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();
