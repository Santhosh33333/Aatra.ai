import { useState } from 'react';
import { verifyAdmin } from '../lib/adminConfig';
import { loadSettings, saveSettings } from '../lib/adminStore';
import type { AdminSettings } from '../lib/adminConfig';
import { logger } from '../lib/logger';
import { Eye, EyeOff, Plus, Trash2, Save, LogOut, Settings, Palette, Key, Cpu, Mail, Image, X } from 'lucide-react';

type ModelTier = 'free' | 'pro' | 'ultra';

type NewModelState = {
  id: string;
  name: string;
  tier: ModelTier;
  description: string;
};

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [settings, setSettings] = useState<AdminSettings>(loadSettings());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'models' | 'theme' | 'contact'>('general');
  const [newModel, setNewModel] = useState<NewModelState>({ id: '', name: '', tier: 'pro', description: '' });
  const [logoPreview, setLogoPreview] = useState<string>(localStorage.getItem('admin_logo') || '');
  const [dragActive, setDragActive] = useState(false);

  const handleLogin = async () => {
    if (await verifyAdmin(email, password)) {
      setAuthed(true);
      setLoginError('');
      logger.success('[AdminPanel] Admin logged in successfully');
    } else {
      setLoginError('Invalid credentials. Access denied.');
      logger.warn('[AdminPanel] Failed login attempt');
    }
  };

  const handleLogoUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      logger.error('[AdminPanel] Logo file too large', { size: file.size });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setLogoPreview(preview);
      localStorage.setItem('admin_logo', preview);
      logger.info('[AdminPanel] Logo uploaded successfully', { filename: file.name, size: file.size });
    };
    reader.onerror = () => {
      logger.error('[AdminPanel] Failed to read logo file');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
      logger.debug('[AdminPanel] Logo drag enter');
    } else if (e.type === 'dragleave') {
      setDragActive(false);
      logger.debug('[AdminPanel] Logo drag leave');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      logger.info('[AdminPanel] Logo dropped');
      handleLogoUpload(files[0]);
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview('');
    localStorage.removeItem('admin_logo');
    logger.info('[AdminPanel] Logo removed');
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addModel = () => {
    if (!newModel.id || !newModel.name) return;
    setSettings(prev => ({
      ...prev,
      models: [...prev.models, { ...newModel }]
    }));
    setNewModel({ id: '', name: '', tier: 'pro', description: '' });
  };

  const removeModel = (idx: number) => {
    setSettings(prev => ({
      ...prev,
      models: prev.models.filter((_, i) => i !== idx)
    }));
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#080c18] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Settings size={28} className="text-[#080c18]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">Aatra Control Panel</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors pr-12"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {loginError && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{loginError}</p>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Access Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'api', label: 'API & Keys', icon: Key },
    { id: 'models', label: 'Models', icon: Cpu },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'contact', label: 'Contact', icon: Mail },
  ] as const;

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center">
              <Settings size={16} className="text-[#080c18]" />
            </div>
            <span className="font-semibold">Aatra Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                saved
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-amber-400/20 text-amber-400 border border-amber-400/30 hover:bg-amber-400/30'
              }`}
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
            <button
              onClick={() => setAuthed(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-400/15 text-amber-400 border border-amber-400/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">General Settings</h2>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Site Name</label>
                <input
                  value={settings.siteName}
                  onChange={e => setSettings(p => ({ ...p, siteName: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Hero Tagline</label>
                <input
                  value={settings.tagline}
                  onChange={e => setSettings(p => ({ ...p, tagline: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Daily Free Message Limit</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={settings.dailyFreeLimit}
                  onChange={e => setSettings(p => ({ ...p, dailyFreeLimit: Number(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Users get this many free messages per day before seeing upgrade prompt.</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Upgrade Prompt Message</label>
                <textarea
                  value={settings.upgradeMessage}
                  onChange={e => setSettings(p => ({ ...p, upgradeMessage: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">API Configuration</h2>
              <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-4">
                <p className="text-xs text-amber-400">⚠️ API key is stored in your browser only. For production, use environment variables in <code className="bg-white/10 px-1 rounded">.env</code> file.</p>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Gemini API Key</label>
                <input
                  type="password"
                  value={settings.geminiApiKey || ''}
                  onChange={e => setSettings(p => ({ ...p, geminiApiKey: e.target.value }))}
                  placeholder="AIza..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Get a free key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">aistudio.google.com</a>. Leave blank to use <code className="bg-white/10 px-1 rounded">VITE_GEMINI_API_KEY</code> from <code className="bg-white/10 px-1 rounded">.env</code> (recommended).</p>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Model Management</h2>
              <div className="space-y-3">
                {settings.models.map((model, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{model.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          model.tier === 'free' ? 'bg-green-500/20 text-green-400' :
                          model.tier === 'pro' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>{model.tier.toUpperCase()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{model.id} · {model.description}</p>
                    </div>
                    <button onClick={() => removeModel(i)} className="text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-5">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Add New Model</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={newModel.id}
                    onChange={e => setNewModel(p => ({ ...p, id: e.target.value }))}
                    placeholder="Model ID (e.g. gpt-4o)"
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <input
                    value={newModel.name}
                    onChange={e => setNewModel(p => ({ ...p, name: e.target.value }))}
                    placeholder="Display Name"
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <input
                    value={newModel.description}
                    onChange={e => setNewModel(p => ({ ...p, description: e.target.value }))}
                    placeholder="Short description"
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  <select
                    value={newModel.tier}
                    onChange={e => setNewModel(p => ({ ...p, tier: e.target.value as ModelTier }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="free">Free Tier</option>
                    <option value="pro">Pro Tier</option>
                    <option value="ultra">Ultra Tier</option>
                  </select>
                </div>
                <button
                  onClick={addModel}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-amber-400/15 text-amber-400 border border-amber-400/30 rounded-xl text-sm hover:bg-amber-400/25 transition-colors"
                >
                  <Plus size={14} /> Add Model
                </button>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Theme & Branding</h2>

              {/* Logo Upload Section */}
              <div className="p-5 bg-gradient-to-br from-amber-400/10 to-cyan-400/10 border border-amber-400/30 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Image size={18} className="text-amber-400" />
                  <label className="text-sm font-semibold text-white">Logo Upload</label>
                </div>
                <p className="text-xs text-gray-400 mb-4">Upload a custom logo for your brand (Max 5MB, PNG/JPG)</p>
                
                {logoPreview ? (
                  <div className="mb-4">
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border-2 border-amber-400/50 bg-white/5 flex items-center justify-center">
                      <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                      <button
                        onClick={handleLogoRemove}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                    <p className="text-xs text-amber-400 mt-2">Logo preview above</p>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-amber-400 bg-amber-400/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="mb-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center mx-auto">
                        <Image size={20} className="text-[#080c18]" />
                      </div>
                    </div>
                    <p className="text-sm text-white font-medium mb-1">Drag & drop your logo</p>
                    <p className="text-xs text-gray-400 mb-4">or click to browse</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          logger.info('[AdminPanel] Logo file selected');
                          handleLogoUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-block px-4 py-2 bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] font-semibold rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Select File
                    </label>
                  </div>
                )}
              </div>

              {/* Color Theme Section */}
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Color Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['dark', 'midnight', 'forest', 'light'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setSettings(p => ({ ...p, theme: t }))}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        settings.theme === t
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg mb-2 ${
                        t === 'dark' ? 'bg-[#0d1117]' :
                        t === 'midnight' ? 'bg-[#0a0014]' :
                        t === 'forest' ? 'bg-[#0a1a0a]' :
                        'bg-[#f8f9fa]'
                      }`} />
                      <span className="text-sm font-medium capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Primary Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={e => setSettings(p => ({ ...p, primaryColor: e.target.value }))}
                    className="w-12 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    value={settings.primaryColor}
                    onChange={e => setSettings(p => ({ ...p, primaryColor: e.target.value }))}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Secondary Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={e => setSettings(p => ({ ...p, accentColor: e.target.value }))}
                    className="w-12 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                  />
                  <input
                    value={settings.accentColor}
                    onChange={e => setSettings(p => ({ ...p, accentColor: e.target.value }))}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Contact & Upgrade Settings</h2>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Contact Email (shown to users wanting upgrades)</label>
                <input
                  value={settings.contactEmail}
                  onChange={e => setSettings(p => ({ ...p, contactEmail: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">Users who hit the limit will see a "Contact to upgrade" button with this email.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
