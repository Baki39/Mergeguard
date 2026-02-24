// app/auth/signin/page.tsx
import { signIn } from "next-auth/react";
import { Shield, Github } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MergeGuard</h1>
          <p className="text-gray-500 mt-2">AI-Powered Code Verification</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Sign in to your account
          </h2>

          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w justify-center gap--full flex items-center3 px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-emerald-600 hover:underline">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">100+</p>
            <p className="text-sm text-gray-500">Security Rules</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">AI</p>
            <p className="text-sm text-gray-500">Test Generation</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">Free</p>
            <p className="text-sm text-gray-500">To Start</p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button 
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="text-emerald-600 hover:underline font-medium"
          >
            Sign up with GitHub
          </button>
        </p>
      </div>
    </div>
  );
}
