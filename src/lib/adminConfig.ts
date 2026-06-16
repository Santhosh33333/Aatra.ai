const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD_HASH = import.meta.env.VITE_ADMIN_PASSWORD_HASH || '';

export const adminConfigured = Boolean(ADMIN_EMAIL && ADMIN_PASSWORD_HASH);

async function sha256hex(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const verifyAdmin = async (email: string, password: string): Promise<boolean> => {
  if (!adminConfigured) return false;
  if (email !== ADMIN_EMAIL) return false;
  return (await sha256hex(password)) === ADMIN_PASSWORD_HASH;
};

export const DEFAULT_SETTINGS = {
  siteName: 'Aatra AI',
  tagline: 'Think Smarter. Chat Faster. For Free.',
  primaryColor: '#7c3aed',
  accentColor: '#10b981',
  dailyFreeLimit: 30,
  models: [
    { id: 'gemini-2.0-flash', name: 'Aatra Flash', tier: 'free', description: 'Gemini 2.0 Flash — completely free' },
    { id: 'gemini-1.5-pro', name: 'Aatra Pro', tier: 'pro', description: 'Gemini 1.5 Pro — advanced reasoning' },
    { id: 'gemini-1.5-ultra', name: 'Aatra Ultra', tier: 'ultra', description: 'Gemini Ultra — maximum intelligence' },
  ],
  contactEmail: ADMIN_EMAIL || 'admin@aatra.ai',
  upgradeMessage: "You've used your 30 free messages today! Upgrade for unlimited access.",
};

export type AdminSettings = typeof DEFAULT_SETTINGS & {
  apiKey?: string;
  geminiApiKey?: string;
  theme?: 'dark' | 'light' | 'midnight' | 'forest';
  logoUrl?: string;
};
