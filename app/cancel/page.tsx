// app/cancel/page.tsx
export default function CancelPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⏸️</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Payment <span className="text-yellow-400">Cancelled</span>
        </h1>
        
        <p className="text-gray-400 text-lg mb-8">
          No worries! Your payment was cancelled and you haven't been charged.
        </p>
        
        <div className="glass rounded-xl p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">No problem! You can still:</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>Use the Free plan - 3 verifications/month</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>Install GitHub App for free</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400">•</span>
              <span>Upgrade anytime when ready</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://github.com/apps/mergeguard/installations/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all"
          >
            🚀 Install Free Version
          </a>
          <a 
            href="/#pricing"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
          >
            View Pricing
          </a>
        </div>
        
        <p className="text-gray-500 text-sm mt-8">
          Questions? <a href="mailto:hello@mergeguard.ai" className="text-blue-400 hover:underline">Contact us</a>
        </p>
      </div>
    </main>
  )
}
