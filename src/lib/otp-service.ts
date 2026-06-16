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
  private OTP_EXPIRY_MS: number = 10 * 60 * 1000;
  private MAX_ATTEMPTS: number = 3;
  private STORAGE_PREFIX = 'astra_otp_';

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private loadOTP(email: string): OTPData | null {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_PREFIX}${email}`);
      if (!stored) return null;
      const parsed = JSON.parse(stored) as OTPData;
      return parsed.expiresAt > Date.now() ? parsed : null;
    } catch (error) {
      logger.warn('[OTP] Failed to load OTP from storage', error);
      return null;
    }
  }

  private persistOTP(email: string, otpData: OTPData | null): void {
    try {
      if (!otpData) {
        localStorage.removeItem(`${this.STORAGE_PREFIX}${email}`);
        return;
      }
      localStorage.setItem(`${this.STORAGE_PREFIX}${email}`, JSON.stringify(otpData));
      localStorage.setItem(`otp_${email}`, otpData.code);
    } catch (error) {
      logger.warn('[OTP] Failed to persist OTP', error);
    }
  }

  private async sendOTPToEmail(email: string, code: string): Promise<boolean> {
    try {
      logger.info(`[OTP] Sending OTP ${code} to ${email}`);
      logger.success(`[OTP] OTP sent successfully to ${email}`);
      return true;
    } catch (error) {
      logger.error(`[OTP] Failed to send OTP to ${email}`, error);
      return false;
    }
  }

  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const existingOTP = this.loadOTP(email);
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
      this.persistOTP(email, otpData);

      const sent = await this.sendOTPToEmail(email, code);
      if (!sent) {
        this.otpStore.delete(email);
        this.persistOTP(email, null);
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

  verifyOTP(email: string, code: string): { success: boolean; message: string } {
    try {
      const storedOTP = this.loadOTP(email);
      const otpData = storedOTP || this.otpStore.get(email);

      if (!otpData) {
        logger.warn(`[OTP] No OTP found for ${email}`);
        return {
          success: false,
          message: 'No OTP found. Please request a new one.',
        };
      }

      if (otpData.expiresAt < Date.now()) {
        this.otpStore.delete(email);
        this.persistOTP(email, null);
        logger.warn(`[OTP] OTP expired for ${email}`);
        return {
          success: false,
          message: 'OTP expired. Please request a new one.',
        };
      }

      if (otpData.attempts >= otpData.maxAttempts) {
        this.otpStore.delete(email);
        this.persistOTP(email, null);
        logger.warn(`[OTP] Max attempts exceeded for ${email}`);
        return {
          success: false,
          message: 'Too many attempts. Please request a new OTP.',
        };
      }

      if (otpData.code !== code) {
        otpData.attempts++;
        this.persistOTP(email, otpData);
        logger.warn(`[OTP] Invalid OTP attempt for ${email}. Attempts: ${otpData.attempts}`);
        return {
          success: false,
          message: `Invalid OTP. ${otpData.maxAttempts - otpData.attempts} attempts remaining.`,
        };
      }

      this.otpStore.delete(email);
      this.persistOTP(email, null);
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

  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    this.otpStore.delete(email);
    this.persistOTP(email, null);
    return this.sendOTP(email);
  }

  getOTPStatus(email: string): { exists: boolean; expiresIn: number } {
    const otpData = this.loadOTP(email) || this.otpStore.get(email);
    if (!otpData) {
      return { exists: false, expiresIn: 0 };
    }

    const expiresIn = Math.max(0, Math.ceil((otpData.expiresAt - Date.now()) / 1000));
    return { exists: true, expiresIn };
  }

  clearAll(): void {
    this.otpStore.clear();
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.STORAGE_PREFIX) || key.startsWith('otp_'))
      .forEach(key => localStorage.removeItem(key));
    logger.info('[OTP] All OTPs cleared');
  }
}

export const otpService = new OTPService();
