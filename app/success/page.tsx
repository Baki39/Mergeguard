// app/success/page.tsx
export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-blue-400">MergeGuard</span>! 🎉
        </h1>
        
        <p className="text-gray-400 text-lg mb-8">
          Thank you for your purchase! Your account has been upgraded successfully.
        </p>
        
        <div className="glass rounded-xl p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">1.</span>
              <span>Install the GitHub App on your repositories</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">2.</span>
              <span>Create a pull request to see MergeGuard in action</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">3.</span>
              <span>Get your verification score in 30 seconds!</span>
            </li>
          </ol>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://github.com/apps/mergeguard/installations/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all"
          >
            🚀 Install GitHub App
          </a>
          <a 
            href="/"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all"
          >
            ← Back to Home
          </a>
        </div>
        
        <p className="text-gray-500 text-sm mt-8">
          Need help? Contact us at <a href="mailto:hello@mergeguard.ai" className="text-blue-400 hover:underline">hello@mergeguard.ai</a>
        </p>
      </div>
    </main>
  )
}
