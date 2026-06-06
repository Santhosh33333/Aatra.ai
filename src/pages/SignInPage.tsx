import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { Sparkles } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#080c18] flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold text-base">Aatra AI</span>
        </Link>
        <Link to="/sign-up"
          className="text-sm text-gray-400 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl">
          Create account →
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your Aatra AI account</p>
          </div>

          <SignIn
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
            appearance={{
              layout: { socialButtonsPlacement: 'top', showOptionalFields: false },
            }}
          />

          <p className="text-center text-xs text-gray-600 mt-6">
            By signing in, you agree to our{' '}
            <span className="text-gray-500 hover:text-gray-400 cursor-pointer">Terms</span>
            {' '}and{' '}
            <span className="text-gray-500 hover:text-gray-400 cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
