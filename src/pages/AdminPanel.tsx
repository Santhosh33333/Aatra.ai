import { useState } from 'react';
import { adminConfigured, verifyAdmin } from '../lib/adminConfig';
import { loadSettings, saveSettings } from '../lib/adminStore';
import type { AdminSettings } from '../lib/adminConfig';
import { Eye, EyeOff, Plus, Trash2, Save, LogOut, Settings, Key, Cpu, Mail, Sparkles, Palette, Upload } from 'lucide-react';

type Tab = 'general' | 'api' | 'models' | 'theme' | 'contact';
type Tier = 'free' | 'pro' | 'ultra';

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [settings, setSettings] = useState<AdminSettings>(loadSettings());
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<Tab>('general');
  const [newModel, setNewModel] = useState({ id: '', name: '', tier: 'pro' as Tier, description: '' });

  const login = async () => {
    if (!adminConfigured) {
      setLoginError('Admin credentials are not configured. Add VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD_HASH.');
      return;
    }
    if (await verifyAdmin(email, password)) { setAuthed(true); setLoginError(''); }
    else setLoginError('Invalid credentials.');
  };

  const save = () => { saveSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const addModel = () => {
    if (!newModel.id || !newModel.name) return;
    setSettings(p => ({ ...p, models: [...p.models, { ...newModel }] }));
    setNewModel({ id: '', name: '', tier: 'pro', description: '' });
  };

  const inp = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-400 transition-colors";

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#08060f' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
            <Sparkles size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-1">Aatra Control Panel</p>
        </div>
        <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com" className={inp} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="••••••••" className={inp + ' pr-12'} />
              <button onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {loginError && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{loginError}</p>}
          <button onClick={login}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
            Access Panel
          </button>
        </div>
      </div>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: typeof Settings }[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'models', label: 'Models', icon: Cpu },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: '#08060f' }}>
      {/* Header */}
      <div className="border-b px-6 h-16 flex items-center justify-between max-w-5xl mx-auto"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-semibold">Aatra Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={save}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saved ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-violet-400 border-violet-400/30 bg-violet-400/10 hover:bg-violet-400/20'} border`}>
            <Save size={14} />{saved ? 'Saved!' : 'Save'}
          </button>
          <button onClick={() => setAuthed(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-white border border-white/10 hover:border-white/20 transition-all">
            <LogOut size={14} />Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-6">
        {/* Sidebar */}
        <div className="w-44 flex-shrink-0 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-violet-400/12 text-violet-400 border border-violet-400/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {tab === 'general' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">General Settings</h2>
              {[
                { label: 'Site Name', key: 'siteName' as const },
                { label: 'Hero Tagline', key: 'tagline' as const },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-500 mb-1.5 block">{f.label}</label>
                  <input value={settings[f.key] as string}
                    onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
                    className={inp} />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Daily Free Message Limit</label>
                <input type="number" min={1} max={1000} value={settings.dailyFreeLimit}
                  onChange={e => setSettings(p => ({ ...p, dailyFreeLimit: Number(e.target.value) }))}
                  className={inp} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Upgrade Prompt Message</label>
                <textarea value={settings.upgradeMessage}
                  onChange={e => setSettings(p => ({ ...p, upgradeMessage: e.target.value }))}
                  rows={3} className={inp + ' resize-none'} />
              </div>
            </div>
          )}

          {tab === 'api' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">API Configuration</h2>
              <div className="p-4 rounded-xl text-xs text-amber-400 bg-amber-400/8 border border-amber-400/20">
                ⚠️ Keys stored in browser only. For production, use <code className="bg-white/10 px-1 rounded">.env.local</code> variables.
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Gemini API Key</label>
                <input type="password" value={settings.geminiApiKey || ''}
                  onChange={e => setSettings(p => ({ ...p, geminiApiKey: e.target.value }))}
                  placeholder="AIza..." className={inp + ' font-mono'} />
                <p className="text-xs text-gray-600 mt-1">Get a free key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-violet-400 hover:underline">aistudio.google.com</a>. Leave blank to use <code className="bg-white/10 px-1 rounded">VITE_GEMINI_API_KEY</code>.</p>
              </div>
            </div>
          )}

          {tab === 'models' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Model Management</h2>
              <div className="space-y-2">
                {settings.models.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{m.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${m.tier === 'free' ? 'bg-emerald-500/15 text-emerald-400' : m.tier === 'pro' ? 'bg-violet-500/15 text-violet-400' : 'bg-amber-500/15 text-amber-400'}`}>
                          {m.tier.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{m.id} · {m.description}</p>
                    </div>
                    <button onClick={() => setSettings(p => ({ ...p, models: p.models.filter((_, j) => j !== i) }))}
                      className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/8 pt-5">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Add Model</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {(['id', 'name', 'description'] as const).map(k => (
                    <input key={k} value={newModel[k]}
                      onChange={e => setNewModel(p => ({ ...p, [k]: e.target.value }))}
                      placeholder={k === 'id' ? 'Model ID (e.g. gemini-2.0-flash)' : k === 'name' ? 'Display name' : 'Short description'}
                      className={inp + (k === 'description' ? ' col-span-2' : '')} />
                  ))}
                  <select value={newModel.tier} onChange={e => setNewModel(p => ({ ...p, tier: e.target.value as Tier }))}
                    className={inp}>
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
                <button onClick={addModel}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-violet-400 border border-violet-400/25 bg-violet-400/8 hover:bg-violet-400/15 transition-colors">
                  <Plus size={14} />Add Model
                </button>
              </div>
            </div>
          )}

          {tab === 'theme' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Theme Settings</h2>
              <div className="space-y-4">
                <LogoUploadSection settings={settings} setSettings={setSettings} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Primary Color</label>
                  <input type="color" value={settings.primaryColor || '#7c3aed'}
                    onChange={e => setSettings(p => ({ ...p, primaryColor: e.target.value }))}
                    className="w-full h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Accent Color</label>
                  <input type="color" value={settings.accentColor || '#10b981'}
                    onChange={e => setSettings(p => ({ ...p, accentColor: e.target.value }))}
                    className="w-full h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Theme Mode</label>
                <select value={settings.theme || 'dark'} onChange={e => setSettings(p => ({ ...p, theme: e.target.value as 'dark' | 'light' | 'midnight' | 'forest' }))}
                  className={inp}>
                  <option value="dark">Dark</option>
                  <option value="midnight">Midnight</option>
                  <option value="forest">Forest</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Contact Settings</h2>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Contact Email (shown on upgrade prompts)</label>
                <input value={settings.contactEmail}
                  onChange={e => setSettings(p => ({ ...p, contactEmail: e.target.value }))}
                  className={inp} />
                <p className="text-xs text-gray-600 mt-1">Users who hit their limit see a button to email you for upgrade.</p>
              </div>
</div>
          )}
         </div>
       </div>
     </div>
   );
}

function LogoUploadSection({ settings, setSettings }: { settings: AdminSettings; setSettings: (s: AdminSettings) => void }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logoUrl || null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      setErrorMessage('File too large. Max 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      setErrorMessage('Invalid file type. Use PNG or JPG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result as string;
      setLogoPreview(preview);
      setSettings({ ...settings, logoUrl: preview });
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setSettings({ ...settings, logoUrl: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {logoPreview ? (
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10">
            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(124,58,237,0.3)' }}>
            <Upload size={24} className="text-gray-600" />
          </div>
        )}
        <div>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
          <label htmlFor="logo-upload"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
            <Upload size={14} />Select File
          </label>
          {logoPreview && (
            <button onClick={removeLogo} className="ml-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white border border-white/10">
              Remove
            </button>
          )}
        </div>
      </div>
      {uploadStatus === 'success' && <p className="text-emerald-400 text-xs">✓ Logo uploaded successfully</p>}
      {uploadStatus === 'error' && <p className="text-red-400 text-xs">✗ {errorMessage}</p>}
    </div>
  );
}
