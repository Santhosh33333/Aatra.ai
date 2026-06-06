import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Link } from 'react-router';
import { Sparkles, ArrowLeft } from 'lucide-react';
import OTPVerification from '../components/OTPVerification';
import { logger } from '../lib/logger';

export default function OTPVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const [verificationLogs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [OTPVerification] Page loaded`,
  ]);

  const handleVerified = (code: string) => {
    logger.success(`[OTPVerification] Email verified with code: ${code}`);
    setLogs(prev => [
      ...prev.slice(-9),
      `[${new Date().toLocaleTimeString()}] [OTPVerification] Email verified successfully`
    ]);
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleError = (error: string) => {
    logger.warn(`[OTPVerification] Verification error: ${error}`);
    setLogs(prev => [
      ...prev.slice(-9),
      `[${new Date().toLocaleTimeString()}] [OTPVerification] Error: ${error}`
    ]);
  };

  return (
    <div className="min-h-screen bg-[#080c18] flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,179,64,0.07) 0%, transparent 70%)' }} />
      </div>

      {/* Top nav */}
      <div className="relative z-10 flex items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles size={15} className="text-[#080c18]" />
          </div>
          <span className="text-white font-semibold text-base">Astra AI</span>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

          {/* Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <OTPVerification 
              email={email}
              onVerified={handleVerified}
              onError={handleError}
            />
          </div>

          {/* Activity Logs */}
          <div className="mt-8 p-4 bg-black/40 border border-amber-500/20 rounded-lg">
            <div className="text-amber-400 font-semibold mb-3 flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Activity Logs ({verificationLogs.length})
            </div>
            <div className="space-y-0.5 max-h-32 overflow-y-auto font-mono text-[10px]">
              {verificationLogs.map((log, idx) => (
                <div key={idx} className="text-gray-500 hover:text-amber-300 transition-colors pl-2 border-l border-amber-500/20">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
