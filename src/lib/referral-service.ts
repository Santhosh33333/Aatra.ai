import { logger } from './logger';

export interface ReferralUser {
  id: string;
  email: string;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  createdAt: string;
}

class ReferralService {
  private referralStore: Map<string, ReferralUser> = new Map();
  private referralCodeMap: Map<string, string> = new Map();
  private STORAGE_KEY = 'astra_referrals';

  constructor() {
    this.load();
  }

  private generateReferralCode(): string {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ASTRA${hash}`;
  }

  private load(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return;
      const data = JSON.parse(stored) as ReferralUser[];
      this.referralStore = new Map(data.map(user => [user.id, user]));
      this.referralCodeMap = new Map(data.map(user => [user.referralCode, user.id]));
    } catch (error) {
      logger.warn('[Referral] Failed to load referral data', error);
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.referralStore.values())));
    } catch (error) {
      logger.warn('[Referral] Failed to persist referral data', error);
    }
  }

  registerUser(
    userId: string,
    email: string,
    referralCode?: string
  ): { success: boolean; message: string; referralCode?: string } {
    try {
      if (this.referralStore.has(userId)) {
        logger.warn(`[Referral] User ${userId} already registered`);
        return {
          success: false,
          message: 'User already registered.',
        };
      }

      const newReferralCode = this.generateReferralCode();

      let referredBy: string | undefined = undefined;
      let referrerUser: ReferralUser | undefined = undefined;

      if (referralCode) {
        const referrerId = this.referralCodeMap.get(referralCode);
        if (referrerId) {
          referrerUser = this.referralStore.get(referrerId);
          if (referrerUser) {
            referredBy = referrerId;
            referrerUser.referralCount++;
            logger.info(`[Referral] User ${userId} referred by ${referrerId}`);
          }
        } else {
          logger.warn(`[Referral] Invalid referral code: ${referralCode}`);
        }
      }

      const newUser: ReferralUser = {
        id: userId,
        email,
        referralCode: newReferralCode,
        referredBy,
        referralCount: 0,
        createdAt: new Date().toISOString(),
      };

      this.referralStore.set(userId, newUser);
      this.referralCodeMap.set(newReferralCode, userId);
      this.persist();

      logger.success(`[Referral] User ${userId} registered`, {
        referralCode: newReferralCode,
        referredBy: referredBy || 'none',
      });

      return {
        success: true,
        message: 'User registered with referral tracking enabled.',
        referralCode: newReferralCode,
      };
    } catch (error) {
      logger.error(`[Referral] Error registering user ${userId}`, error);
      return {
        success: false,
        message: 'Failed to register user.',
      };
    }
  }

  getReferralCode(userId: string): string | null {
    const user = this.referralStore.get(userId);
    return user?.referralCode || null;
  }

  getReferralLink(userId: string, baseURL: string = window.location.origin): string | null {
    const code = this.getReferralCode(userId);
    if (!code) return null;
    return `${baseURL}/sign-up?ref=${code}`;
  }

  getReferralStats(userId: string): {
    referralCode: string | null;
    referralLink: string | null;
    referralCount: number;
    referredBy: string | null;
  } | null {
    const user = this.referralStore.get(userId);
    if (!user) return null;

    return {
      referralCode: user.referralCode,
      referralLink: this.getReferralLink(userId),
      referralCount: user.referralCount,
      referredBy: user.referredBy || null,
    };
  }

  validateReferralCode(code: string): boolean {
    const isValid = this.referralCodeMap.has(code);
    if (!isValid) {
      logger.warn(`[Referral] Invalid referral code attempted: ${code}`);
    }
    return isValid;
  }

  getReferrerByCode(code: string): ReferralUser | null {
    const referrerId = this.referralCodeMap.get(code);
    if (!referrerId) return null;
    return this.referralStore.get(referrerId) || null;
  }

  getUserReferrals(userId: string): ReferralUser[] {
    const referrals: ReferralUser[] = [];
    this.referralStore.forEach((user) => {
      if (user.referredBy === userId) {
        referrals.push(user);
      }
    });
    return referrals;
  }

  getUserByReferralCode(code: string): ReferralUser | null {
    const userId = this.referralCodeMap.get(code);
    if (!userId) return null;
    return this.referralStore.get(userId) || null;
  }

  clearAll(): void {
    this.referralStore.clear();
    this.referralCodeMap.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    logger.info('[Referral] All referral data cleared');
  }
}

export const referralService = new ReferralService();
