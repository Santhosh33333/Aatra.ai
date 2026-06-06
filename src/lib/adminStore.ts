import { DEFAULT_SETTINGS, type AdminSettings } from './adminConfig';

const STORAGE_KEY = 'astra_admin_settings';

export const loadSettings = (): AdminSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return { ...DEFAULT_SETTINGS };
};

export const saveSettings = (settings: AdminSettings): void => {
  try {
    // Never store password in settings
    const { ...safe } = settings;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {}
};

// Usage tracker
const USAGE_KEY = 'astra_daily_usage';

interface UsageRecord {
  date: string;
  count: number;
}

export const getUsageToday = (): number => {
  try {
    const stored = localStorage.getItem(USAGE_KEY);
    if (stored) {
      const record: UsageRecord = JSON.parse(stored);
      const today = new Date().toDateString();
      if (record.date === today) return record.count;
    }
  } catch {}
  return 0;
};

export const incrementUsage = (): number => {
  const today = new Date().toDateString();
  const current = getUsageToday();
  const newCount = current + 1;
  localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: newCount }));
  return newCount;
};
