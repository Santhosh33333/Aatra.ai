// Admin configuration - credentials stored via closure, never rendered to DOM
const getAdminCredentials = (() => {
  const credentials = {
    email: 'santhoshkrishna958@gmail.com',
    // Password hash approach - compare against stored hash
    passwordHash: btoa('300703S#s'), // base64 encoded, swap for bcrypt in production
  };
  return () => credentials;
})();

export const verifyAdmin = (email: string, password: string): boolean => {
  const creds = getAdminCredentials();
  return email === creds.email && btoa(password) === creds.passwordHash;
};

// Default settings - admin can override these from the panel
export const DEFAULT_SETTINGS = {
  siteName: 'Astra AI',
  tagline: "It's not just chat, it's a connection",
  primaryColor: '#ffb340',
  accentColor: '#00c8ff',
  dailyFreeLimit: 20,
  models: [
    { id: 'gpt-4o-mini', name: 'Astra Mini', tier: 'free', description: 'Fast & efficient' },
    { id: 'gpt-4o', name: 'Astra Pro', tier: 'pro', description: 'Smarter responses' },
    { id: 'gpt-4-turbo', name: 'Astra Ultra', tier: 'ultra', description: 'Most powerful' },
  ],
  contactEmail: 'santhoshkrishna958@gmail.com',
  upgradeMessage: 'You\'ve reached your daily limit! Contact us to unlock unlimited access.',
};

export type AdminSettings = typeof DEFAULT_SETTINGS & {
  apiKey?: string;
  theme?: 'dark' | 'light' | 'midnight' | 'forest';
};
