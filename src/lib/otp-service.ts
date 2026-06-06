/**
 * OTP Service for Astra AI Signup
 * Handles OTP generation, validation, expiration, and auto-fill
 */

import { logger } from './logger';

export interface OTPData {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
}

class OTPService {
  private otpStore: Map<string, OTPData> = new Map();
  private OTP_EXPIRY_MS: number = 10 * 60 * 1000; // 10 minutes
  private MAX_ATTEMPTS: number = 3;

  /**
   * Generate a random OTP code
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to email (mock implementation)
   * In production, integrate with email service like SendGrid, Mailgun, or AWS SES
   */
  private async sendOTPToEmail(email: string, code: string): Promise<boolean> {
    try {
      logger.info(`[OTP] Sending OTP ${code} to ${email}`);
      
      // Mock email sending - in production use actual email service
      // const response = await fetch('/api/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, code })
      // });
      
      // For demo, store in localStorage for testing
      if (import.meta.env.DEV) {
        localStorage.setItem(`otp_${email}`, code);
      }
      
      logger.success(`[OTP] OTP sent successfully to ${email}`);
      return true;
    } catch (error) {
      logger.error(`[OTP] Failed to send OTP to ${email}`, error);
      return false;
    }
  }

  /**
   * Create and send OTP for new user
   */
  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Check if OTP already exists and is still valid
      const existingOTP = this.otpStore.get(email);
      if (existingOTP && existingOTP.expiresAt > Date.now()) {
        logger.warn(`[OTP] OTP already sent to ${email}. Reusing existing OTP.`);
        return {
          success: true,
          message: 'OTP resent. Check your email.',
        };
      }

      const code = this.generateCode();
      const expiresAt = Date.now() + this.OTP_EXPIRY_MS;

      const otpData: OTPData = {
        code,
        email,
        expiresAt,
        attempts: 0,
        maxAttempts: this.MAX_ATTEMPTS,
      };

      this.otpStore.set(email, otpData);

      const sent = await this.sendOTPToEmail(email, code);
      if (!sent) {
        this.otpStore.delete(email);
        return {
          success: false,
          message: 'Failed to send OTP. Please try again.',
        };
      }

      logger.info(`[OTP] OTP created for ${email}`);
      return {
        success: true,
        message: 'OTP sent to your email. Valid for 10 minutes.',
      };
    } catch (error) {
      logger.error(`[OTP] Error sending OTP to ${email}`, error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    }
  }

  /**
   * Verify OTP code
   */
  verifyOTP(email: string, code: string): { success: boolean; message: string } {
    try {
      const otpData = this.otpStore.get(email);

      if (!otpData) {
        logger.warn(`[OTP] No OTP found for ${email}`);
        return {
          success: false,
          message: 'No OTP found. Please request a new one.',
        };
      }

      // Check if OTP expired
      if (otpData.expiresAt < Date.now()) {
        this.otpStore.delete(email);
        logger.warn(`[OTP] OTP expired for ${email}`);
        return {
          success: false,
          message: 'OTP expired. Please request a new one.',
        };
      }

      // Check attempts
      if (otpData.attempts >= otpData.maxAttempts) {
        this.otpStore.delete(email);
        logger.warn(`[OTP] Max attempts exceeded for ${email}`);
        return {
          success: false,
          message: 'Too many attempts. Please request a new OTP.',
        };
      }

      // Verify code
      if (otpData.code !== code) {
        otpData.attempts++;
        logger.warn(`[OTP] Invalid OTP attempt for ${email}. Attempts: ${otpData.attempts}`);
        return {
          success: false,
          message: `Invalid OTP. ${otpData.maxAttempts - otpData.attempts} attempts remaining.`,
        };
      }

      // OTP verified successfully
      this.otpStore.delete(email);
      logger.success(`[OTP] OTP verified for ${email}`);
      return {
        success: true,
        message: 'Email verified successfully!',
      };
    } catch (error) {
      logger.error(`[OTP] Error verifying OTP for ${email}`, error);
      return {
        success: false,
        message: 'An error occurred during verification.',
      };
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    this.otpStore.delete(email);
    return this.sendOTP(email);
  }

  /**
   * Get OTP status for email
   */
  getOTPStatus(email: string): { exists: boolean; expiresIn: number } {
    const otpData = this.otpStore.get(email);
    if (!otpData) {
      return { exists: false, expiresIn: 0 };
    }

    const expiresIn = Math.max(0, Math.ceil((otpData.expiresAt - Date.now()) / 1000));
    return { exists: true, expiresIn };
  }

  /**
   * Clear all OTPs (for testing/cleanup)
   */
  clearAll(): void {
    this.otpStore.clear();
    logger.info('[OTP] All OTPs cleared');
  }
}

export const otpService = new OTPService();
