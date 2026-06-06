import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { Sparkles, Check } from 'lucide-react';

const perks = [
  '30 free messages every day',
  'Access to Aatra AI — powered by Gemini',
  'File & image drag and drop',
  'Upgrade anytime for more',
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#080c18] flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold text-base">Aatra AI</span>
        </Link>
        <Link to="/sign-in"
          className="text-sm text-gray-400 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl">
          Sign in →
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl flex gap-12 items-center">

          {/* Left — perks (desktop only) */}
          <div className="hidden lg:flex flex-col flex-1">
            <span className="text-xs font-medium text-emerald-400 uppercase tracking-widest mb-2">Free forever</span>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Start chatting<br />
              <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                in 30 seconds
              </span>
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Join thousands of users already using Aatra AI. No credit card needed.
            </p>
            <ul className="space-y-3">
              {perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-400/20 to-emerald-400/20 border border-violet-400/30 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-violet-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{perk}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 p-4 bg-white/5 border border-white/8 rounded-2xl">
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                "Aatra AI is the assistant I actually use every day. Fast, smart, and the chat feels natural."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">R</div>
                <div>
                  <p className="text-xs font-medium text-white">Rahul M.</p>
                  <p className="text-[10px] text-gray-600">Product Designer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — SignUp form */}
          <div className="flex-1 max-w-md w-full mx-auto lg:mx-0">
            <div className="text-center lg:text-left mb-7">
              <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
              <p className="text-gray-500 text-sm">Free · No credit card required</p>
            </div>

            <SignUp
              signInUrl="/sign-in"
              forceRedirectUrl="/dashboard"
              appearance={{
                layout: { socialButtonsPlacement: 'top', showOptionalFields: false },
              }}
            />

            <p className="text-center text-xs text-gray-600 mt-5">
              By signing up, you agree to our{' '}
              <span className="text-gray-500 hover:text-gray-400 cursor-pointer">Terms</span>
              {' '}and{' '}
              <span className="text-gray-500 hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
