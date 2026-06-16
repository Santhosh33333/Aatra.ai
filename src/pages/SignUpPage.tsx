import { SignUp, useAuth } from '@clerk/clerk-react';
import { Link, Navigate, useSearchParams } from 'react-router';
import { Sparkles, Check } from 'lucide-react';

const perks = ['30 free messages every day', 'Gemini 2.0 Flash — for free', 'No credit card ever', 'Upgrade anytime'];

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || undefined;

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#08060f' }}><div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#08060f' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-12"
          style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
      </div>

      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-bold text-white">Aatra AI</span>
        </Link>
        <Link to="/sign-in" className="text-sm text-gray-500 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl">
          Sign in →
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl flex gap-12 items-center">
          {/* Left perks — desktop only */}
          <div className="hidden lg:flex flex-col flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">Free forever</span>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Start chatting<br />
              <span style={{ background: 'linear-gradient(90deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                in 30 seconds
              </span>
            </h2>
            <p className="text-gray-500 text-sm mb-7 leading-relaxed">Join 500,000+ users already using Aatra AI. No credit card needed.</p>
            <ul className="space-y-3 mb-10">
              {perks.map((p, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                    <Check size={11} className="text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-300">{p}</span>
                </li>
              ))}
            </ul>
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">"Aatra AI is the assistant I actually use every day. Fast, smart, completely free."</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>R</div>
                <div>
                  <p className="text-xs font-medium text-white">Rahul M.</p>
                  <p className="text-[10px] text-gray-600">Product Designer, Bangalore</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="flex-1 max-w-md w-full mx-auto lg:mx-0">
            <div className="text-center lg:text-left mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
              <p className="text-gray-500 text-sm">Free · No credit card required</p>
              {referralCode && <p className="text-emerald-400 text-xs mt-2">Referral code applied: {referralCode}</p>}
            </div>
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
              unsafeMetadata={{ referralCode }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
