import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { loadSettings, getUsageToday } from '../lib/adminStore';
import ChatWidget from '../sections/ChatWidget';
import { MessageCircle, Sparkles, LogOut, Crown, TrendingUp, Zap, Star, ChevronRight, Mail, Lock, Settings } from 'lucide-react';

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const settings = loadSettings();
  const usage = getUsageToday();
  const limit = settings.dailyFreeLimit || 30;
  const pct = Math.min((usage / limit) * 100, 100);
  const firstName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen text-white" style={{ background: '#08060f' }}>
      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)' }} />
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-60 hidden lg:flex flex-col z-20"
        style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(124,58,237,0.12)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(124,58,237,0.12)' }}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">Aatra AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { icon: MessageCircle, label: 'Chat', active: true },
            { icon: TrendingUp, label: 'Usage', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map(item => (
            <button key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={item.active
                ? { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.22)' }
                : { color: '#6b7280' }}>
              <item.icon size={16} /> {item.label}
            </button>
          ))}

          <div className="pt-4 pb-1">
            <p className="text-[10px] uppercase tracking-widest px-3 pb-1" style={{ color: '#374151' }}>Admin</p>
          </div>
          {[
            { icon: Lock, label: 'Admin Panel', to: '/admin' },
            { icon: Zap, label: 'Gateways', to: '/admin-gateways' },
          ].map(item => (
            <Link key={item.label} to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group"
              style={{ color: '#6b7280' }}>
              <item.icon size={16} />
              <span>{item.label}</span>
              <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Usage */}
        <div className="px-3 pb-3">
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}>
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px] text-gray-600">Daily usage</span>
              <span className="text-[11px] text-white font-medium">{usage}/{limit}</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pct >= 80 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#7c3aed,#10b981)' }} />
            </div>
            {pct >= 80 && (
              <a href={`mailto:${settings.contactEmail}?subject=Upgrade`}
                className="flex items-center gap-1 text-[11px] mt-2" style={{ color: '#a78bfa' }}>
                <Crown size={10} /> Upgrade for unlimited
              </a>
            )}
          </div>
        </div>

        {/* User */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(124,58,237,0.12)' }}>
          <div className="flex items-center gap-3 px-2">
            <img src={user?.imageUrl || ''} alt=""
              className="w-8 h-8 rounded-full object-cover ring-1 ring-violet-500/30"
              onError={e => { (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%237c3aed'/%3E%3C/svg%3E`; }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.fullName || firstName}</p>
              <p className="text-[10px] text-gray-600 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <button onClick={() => signOut({ redirectUrl: '/' })} className="p-1 text-gray-600 hover:text-white transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="lg:pl-60 min-h-screen">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(255,255,255,0.02)' }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm">Aatra AI</span>
          </Link>
          <button onClick={() => signOut({ redirectUrl: '/' })} className="text-gray-500">
            <LogOut size={18} />
          </button>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 lg:px-8 py-10">
          {/* Welcome */}
          <div className="mb-8">
            <p className="text-xs text-violet-400 mb-1">👋 Welcome back</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Hey, {firstName}!</h1>
            <p className="text-sm text-gray-500 mt-1">Your Aatra AI dashboard — powered by Gemini 2.0 Flash.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Today', value: usage, icon: MessageCircle, color: '#7c3aed' },
              { label: 'Limit', value: limit, icon: Zap, color: '#10b981' },
              { label: 'Left', value: Math.max(0, limit - usage), icon: TrendingUp, color: '#34d399' },
              { label: 'Models', value: settings.models.filter(m => m.tier === 'free').length, icon: Star, color: '#a78bfa' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-xl mb-2 flex items-center justify-center"
                  style={{ background: `${s.color}18` }}>
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Models */}
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-widest text-gray-600 mb-3">Available Models</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {settings.models.map((model, i) => (
                <div key={i} className={`rounded-2xl p-4 ${model.tier !== 'free' ? 'opacity-55' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.03)', border: model.tier === 'free' ? '1px solid rgba(16,185,129,0.22)' : '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: model.tier === 'free' ? '#10b981' : '#374151' }} />
                    <span className="text-sm font-semibold text-white">{model.name}</span>
                    {model.tier !== 'free' && <Crown size={12} className="ml-auto text-amber-500" />}
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{model.description}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={model.tier === 'free'
                      ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                      : { background: 'rgba(255,255,255,0.08)', color: '#6b7280' }}>
                    {model.tier.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA if near limit */}
          {pct >= 60 && (
            <div className="rounded-2xl p-5 mb-8 flex items-start justify-between gap-4"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.22)' }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={15} style={{ color: '#a78bfa' }} />
                  <span className="text-sm font-semibold text-white">{pct >= 100 ? 'Limit reached' : 'Nearing your limit'}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{settings.upgradeMessage}</p>
                <a href={`mailto:${settings.contactEmail}?subject=Upgrade Request`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                  <Mail size={12} /> Upgrade Now
                </a>
              </div>
              <span className="text-3xl font-extrabold text-white flex-shrink-0">{Math.round(pct)}%</span>
            </div>
          )}

          {/* Start chat CTA */}
          <div className="rounded-2xl p-8 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,58,237,0.12)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
              <MessageCircle size={22} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to chat?</h3>
            <p className="text-sm text-gray-500 mb-4">Click the ✦ button in the bottom-right corner.</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Aatra AI online — Gemini 2.0 Flash ready
            </div>
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
