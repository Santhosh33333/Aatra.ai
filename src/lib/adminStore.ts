export interface AdminSettings {
  apiKey: string;
  model: string;
  dailyLimit: number;
  temperature: number;
}

export interface UserUsage {
  [userId: string]: {
    count: number;
    date: string;
  };
}

class AdminStore {
  private settings: AdminSettings = {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4o-mini',
    dailyLimit: parseInt(import.meta.env.VITE_DAILY_LIMIT || '20'),
    temperature: 0.7,
  };

  private userUsage: UserUsage = {};

  getSettings() {
    return this.settings;
  }

  updateSettings(newSettings: Partial<AdminSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  getUserUsage(userId: string) {
    return this.userUsage[userId] || { count: 0, date: new Date().toISOString().split('T')[0] };
  }

  incrementUserUsage(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    if (!this.userUsage[userId] || this.userUsage[userId].date !== today) {
      this.userUsage[userId] = { count: 1, date: today };
    } else {
      this.userUsage[userId].count++;
    }
  }
}

export const adminStore = new AdminStore();
