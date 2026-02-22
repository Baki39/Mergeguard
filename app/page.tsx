// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
        
        <div className="relative max-w-6xl mx-auto px-4 py-24">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-300">Now in Public Beta</span>
            </div>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
            Ship or <span className="gradient-text">Shipwreck</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            Guard every AI-generated PR. Auto-tests, zero security holes, debt score – 
            merge safe or blocked in 30 seconds.
          </p>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href="https://github.com/apps/mergeguard-ai/installations/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all hover:scale-105 glow text-center"
            >
              🚀 Install GitHub App
            </a>
            <a 
              href="#pricing" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold text-lg transition-all text-center"
            >
              See Pricing
            </a>
          </div>
          
          {/* Dashboard Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="bg-white/10 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400">MergeGuard Dashboard</span>
              </div>
              <div className="p-6 grid md:grid-cols-3 gap-4">
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Verification Score</div>
                  <div className="text-4xl font-bold text-green-400">97/100</div>
                  <div className="text-sm text-green-400 mt-1">✅ PASS</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Tests Generated</div>
                  <div className="text-4xl font-bold">23</div>
                  <div className="text-sm text-gray-400 mt-1">17 passing</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Security Issues</div>
                  <div className="text-4xl font-bold text-green-400">0</div>
                  <div className="text-sm text-green-400 mt-1">✅ Secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4" id="features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Everything you need to ship <span className="gradient-text">verified code</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            No more guessing. No more bugs. Just ship with confidence.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl mb-4">🧪</div>
              <h3 className="text-xl font-semibold mb-2">Auto-Test Generation</h3>
              <p className="text-gray-400">
                Generates unit + integration tests in seconds. Never ship untested code again.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 hover:border-red-500/50 transition-all">
              <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Security Scanning</h3>
              <p className="text-gray-400">
                50+ vulnerability checks. SQL injection, XSS, hardcoded secrets, and AI-specific threats.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 hover:border-yellow-500/50 transition-all">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center text-2xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Debt Score</h3>
              <p className="text-gray-400">
                Know your technical debt at a glance. 0-100 score with actionable suggestions.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 hover:border-purple-500/50 transition-all">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl mb-4">🚫</div>
              <h3 className="text-xl font-semibold mb-2">Merge Blocking</h3>
              <p className="text-gray-400">
                Set your threshold. Block PRs below 95% score. Never merge bad code again.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 hover:border-green-500/50 transition-all">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center text-2xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Verified Badge</h3>
              <p className="text-gray-400">
                Show off with "Verified by MergeGuard" on every PR. Viral social proof.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-6 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 bg-cyan-600/20 rounded-xl flex items-center justify-center text-2xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-400">
                Your code never leaves your infrastructure. Optional local AI with Ollama.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-black" id="pricing">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Start free. Upgrade when you're ready. No hidden fees.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Free */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal text-gray-400">/mo</span></div>
              <p className="text-gray-400 text-sm mb-4">Perfect for trying out</p>
              <ul className="space-y-3 text-gray-400 mb-8 text-sm">
                <li>✅ 10 verifications/month</li>
                <li>✅ Basic test generation</li>
                <li>✅ Security scan</li>
                <li>✅ Debt score</li>
                <li>❌ No API access</li>
              </ul>
              <a 
                href="https://github.com/apps/mergeguard-ai/installations/new"
                target="_blank"
                className="block w-full py-3 text-center border border-white/20 rounded-xl hover:bg-white/10 transition-all"
              >
                Get Started
              </a>
            </div>
            
            {/* Pro */}
            <div className="glass rounded-2xl p-6 relative" style={{ borderColor: 'rgba(37, 99, 235, 0.5)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$19<span className="text-lg font-normal text-gray-400">/dev/mo</span></div>
              <p className="text-gray-400 text-sm mb-4">For professional developers</p>
              <ul className="space-y-3 text-gray-400 mb-8 text-sm">
                <li>✅ 300 verifications/month</li>
                <li>✅ 100k AI tokens</li>
                <li>✅ Full verification suite</li>
                <li>✅ Shareable reports</li>
                <li>✅ Priority support</li>
                <li>✅ Verified badge</li>
              </ul>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Stripe checkout coming soon! Contact us at hello@mergeguard.ai');
                }}
                className="block w-full py-3 text-center bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all"
              >
                Start Pro
              </a>
            </div>
            
            {/* Team */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Team</h3>
              <div className="text-4xl font-bold mb-4">$99<span className="text-lg font-normal text-gray-400">/team/mo</span></div>
              <p className="text-gray-400 text-sm mb-4">For small teams</p>
              <ul className="space-y-3 text-gray-400 mb-8 text-sm">
                <li>✅ Up to 5 devs</li>
                <li>✅ Unlimited verifications</li>
                <li>✅ Unlimited AI tokens</li>
                <li>✅ Team dashboard</li>
                <li>✅ API access</li>
              </ul>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Stripe checkout coming soon! Contact us at hello@mergeguard.ai');
                }}
                className="block w-full py-3 text-center border border-white/20 rounded-xl hover:bg-white/10 transition-all"
              >
                Start Team
              </a>
            </div>
            
            {/* Enterprise */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-4">Custom</div>
              <p className="text-gray-400 text-sm mb-4">For large organizations</p>
              <ul className="space-y-3 text-gray-400 mb-8 text-sm">
                <li>✅ Self-hosting</li>
                <li>✅ Private AI models</li>
                <li>✅ SSO / SAML</li>
                <li>✅ 99.9% SLA</li>
                <li>✅ Custom rules</li>
              </ul>
              <a 
                href="mailto:hello@mergeguard.ai?subject=Enterprise%20Inquiry"
                className="block w-full py-3 text-center border border-white/20 rounded-xl hover:bg-white/10 transition-all"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            From installation to verified PR in 30 seconds
          </p>
          
          <div className="space-y-4">
            <div className="glass rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Install GitHub App</h3>
                <p className="text-gray-400">
                  <a 
                    href="https://github.com/apps/mergeguard-ai/installations/new"
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    Click here to install
                  </a> from GitHub Marketplace. Select your repositories.
                </p>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Create a PR</h3>
                <p className="text-gray-400">Push code to GitHub. MergeGuard automatically detects new PRs.</p>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Get Verified</h3>
                <p className="text-gray-400">In 30 seconds: tests generated, security scanned, debt scored.</p>
              </div>
            </div>
            
            <div className="glass rounded-xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Merge or Block</h3>
                <p className="text-gray-400">Score ≥ 95%? Green light to merge. Otherwise, fix and try again.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to ship verified code?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join 247+ developers already using MergeGuard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://github.com/apps/mergeguard-ai/installations/new"
              target="_blank"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition-all"
            >
              🚀 Install GitHub App - Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">🛡️ MergeGuard</span>
          </div>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition-all">Terms</a>
            <a href="#" className="hover:text-white transition-all">Privacy</a>
            <a href="mailto:hello@mergeguard.ai" className="hover:text-white transition-all">Contact</a>
            <a href="https://twitter.com" className="hover:text-white transition-all">Twitter</a>
            <a href="https://github.com/Baki39/Mergeguard" className="hover:text-white transition-all">GitHub</a>
          </div>
          <div className="text-gray-500">
            © 2026 MergeGuard. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
