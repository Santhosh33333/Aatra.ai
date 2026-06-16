import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { Sparkles } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#08060f' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)' }} />
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
        <Link to="/sign-up" className="text-sm text-gray-500 hover:text-white transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl">
          Create account →
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your Aatra AI account</p>
          </div>
          <SignIn signUpUrl="/sign-up" forceRedirectUrl="/dashboard" />
        </div>
      </div>
    </div>
  );
}
