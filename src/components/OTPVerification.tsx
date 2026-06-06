import { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from './ui/input-otp';
import { otpService } from '../lib/otp-service';
import { logger } from '../lib/logger';

interface OTPVerificationProps {
  email: string;
  onVerified?: (code: string) => void;
  onError?: (error: string) => void;
}

export default function OTPVerification({ email, onVerified, onError }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [autoFilled, setAutoFilled] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Set up auto-fill listener
  useEffect(() => {
    logger.info(`[OTPVerification] Setting up auto-fill for ${email}`);
    
    unsubscribeRef.current = otpService.onOTPReceived((receivedEmail, code) => {
      if (receivedEmail === email) {
        logger.success(`[OTPVerification] OTP auto-filled for ${email}`);
        setOtp(code);
        setAutoFilled(true);
        
        // Auto-verify after auto-fill
        setTimeout(() => {
          handleVerify(code);
        }, 500);
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [email]);

  // Timer countdown
  useEffect(() => {
    if (success) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [success]);

  // Check if OTP is available for auto-fill (dev mode)
  useEffect(() => {
    const lastOTP = otpService.getLastOTP(email);
    if (lastOTP && !otp && !autoFilled) {
      logger.debug(`[OTPVerification] Found last OTP: ${lastOTP}`);
      setOtp(lastOTP);
      setAutoFilled(true);
    }
  }, [email, otp, autoFilled]);

  const handleVerify = (code: string) => {
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = otpService.verifyOTP(email, code);
      
      if (result.success) {
        logger.success(`[OTPVerification] OTP verified for ${email}`);
        setSuccess(true);
        if (onVerified) onVerified(code);
      } else {
        logger.warn(`[OTPVerification] Verification failed: ${result.message}`);
        setError(result.message);
        if (onError) onError(result.message);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Verification failed';
      logger.error(`[OTPVerification] Error`, err);
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-gap-3">
          <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
          <div>
            <div className="text-green-400 font-medium">Email verified successfully!</div>
            <div className="text-green-300 text-sm mt-1">Your account is now active.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-2">Verify your email</h3>
        <p className="text-gray-400 text-sm">Enter the 6-digit code sent to {email}</p>
      </div>

      {/* OTP Input */}
      <div className="space-y-4">
        <InputOTP value={otp} onChange={setOtp} maxLength={6} disabled={isLoading}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="bg-white/5 border-white/10 text-white" />
            <InputOTPSlot index={1} className="bg-white/5 border-white/10 text-white" />
            <InputOTPSlot index={2} className="bg-white/5 border-white/10 text-white" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="bg-white/5 border-white/10 text-white" />
            <InputOTPSlot index={4} className="bg-white/5 border-white/10 text-white" />
            <InputOTPSlot index={5} className="bg-white/5 border-white/10 text-white" />
          </InputOTPGroup>
        </InputOTP>

        {autoFilled && (
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded flex items-center gap-2 text-xs text-amber-400">
            <Clock size={14} />
            OTP auto-filled - verifying...
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded flex items-gap-2">
          <AlertCircle className="text-red-400 flex-shrink-0" size={18} />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock size={16} />
          <span>Code expires in {formatTime(timeLeft)}</span>
        </div>
        {timeLeft <= 60 && (
          <span className="text-xs text-red-400 font-medium">Expiring soon</span>
        )}
      </div>

      {/* Verify button */}
      <button
        onClick={() => handleVerify(otp)}
        disabled={isLoading || !otp || otp.length !== 6}
        className="w-full bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </button>

      {/* Resend link */}
      <div className="text-center">
        <button className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
          Didn&apos;t receive the code? Resend
        </button>
      </div>
    </div>
  );
}
