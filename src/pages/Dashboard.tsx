import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { useEffect } from 'react';
import { loadSettings, getUsageToday } from '../lib/adminStore';
import { logger } from '../lib/logger';
import ChatWidget from '../sections/ChatWidget';
import {
  MessageCircle, Sparkles, LogOut, Settings, Crown,
  TrendingUp, Zap, User, ChevronRight, Mail, Star, Lock
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const settings = loadSettings();
  const usage = getUsageToday();
  const limit = settings.dailyFreeLimit || 30;
  const usagePercent = Math.min((usage / limit) * 100, 100);
  const firstName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'there';
  const freeModels = settings.models.filter(m => m.tier === 'free');

  useEffect(() => {
    logger.info('[Dashboard] Loaded', { user: user?.fullName, usage: `${usage}/${limit}` });
  }, [user, usage, limit]);

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0612' }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)' }} />
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 flex-col z-20 hidden lg:flex"
        style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(124,58,237,0.15)' }}>
        {/* Logo */}
        <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-sm">Aatra</span>
              <span className="text-[9px] font-semibold" style={{ color: '#7c3aed' }}>AI</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { icon: MessageCircle, label: 'Chat', active: true },
            { icon: TrendingUp, label: 'Usage', active: false },
            { icon: User, label: 'Profile', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map(item => (
            <button key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={item.active
                ? { background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }
                : { color: '#6b7280' }}>
              <item.icon size={16} />
              {item.label}
            </button>
          ))}

          <div className="my-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
          <div className="text-xs px-3 py-2 font-semibold uppercase tracking-wider" style={{ color: '#4b5563' }}>Admin</div>
          {[
            { icon: Lock, label: 'Admin Panel', to: '/admin' },
            { icon: Zap, label: 'Payment Gateways', to: '/admin-gateways' },
          ].map(item => (
            <Link key={item.label} to={item.to}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
              style={{ color: '#6b7280' }}>
              <item.icon size={16} />
              <span>{item.label}</span>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Usage card */}
        <div className="px-3 pb-3">
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: '#6b7280' }}>Daily Usage</span>
              <span className="text-xs font-medium text-white">{usage}/{limit}</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${usagePercent}%`, background: usagePercent >= 80 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#7c3aed,#10b981)' }} />
            </div>
            {usagePercent >= 80 && (
              <a href={`mailto:${settings.contactEmail}?subject=Upgrade Request`}
                className="flex items-center gap-1.5 text-xs mt-2 transition-colors"
                style={{ color: '#a78bfa' }}>
                <Crown size={11} /> Upgrade for unlimited
              </a>
            )}
          </div>
        </div>

        {/* User */}
        <div className="px-3 pb-4 pt-3" style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <img src={user?.imageUrl || ''}
              className="w-8 h-8 rounded-full object-cover ring-2"
              style={{ '--tw-ring-color': 'rgba(124,58,237,0.3)' } as React.CSSProperties}
              onError={e => { (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%237c3aed'/%3E%3C/svg%3E`; }}
              alt="Avatar" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.fullName || firstName}</p>
              <p className="text-[10px] truncate" style={{ color: '#4b5563' }}>{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <button onClick={() => signOut({ redirectUrl: '/' })}
              className="p-1 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: '#4b5563' }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="lg:pl-64 min-h-screen">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(124,58,237,0.15)', background: 'rgba(255,255,255,0.02)' }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-semibold text-sm">Aatra AI</span>
          </Link>
          <button onClick={() => signOut({ redirectUrl: '/' })} style={{ color: '#6b7280' }}>
            <LogOut size={18} />
          </button>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 lg:px-8 py-8">
          {/* Welcome */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>👋 Welcome back</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Hey, {firstName}!</h1>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              Your Aatra AI dashboard — powered by Gemini 2.0 Flash.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Messages Today', value: usage, icon: MessageCircle, color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
              { label: 'Daily Limit', value: limit, icon: Zap, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
              { label: 'Remaining', value: Math.max(0, limit - usage), icon: TrendingUp, color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
              { label: 'Free Models', value: freeModels.length, icon: Star, color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: stat.bg }}>
                  <stat.icon size={15} style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#4b5563' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Models */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b7280' }}>Your Models</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {settings.models.map((model, i) => {
                const isFree = model.tier === 'free';
                return (
                  <div key={i} className={`relative rounded-2xl p-4 transition-all ${!isFree ? 'opacity-60' : ''}`}
                    style={{ background: 'rgba(255,255,255,0.03)', border: isFree ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.05)' }}>
                    {!isFree && <div className="absolute top-3 right-3"><Crown size={14} style={{ color: '#f59e0b' }} /></div>}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: isFree ? '#10b981' : '#374151' }} />
                      <span className="text-sm font-semibold text-white">{model.name}</span>
                    </div>
                    <p className="text-xs mb-3" style={{ color: '#6b7280' }}>{model.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={model.tier === 'free'
                          ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                          : model.tier === 'pro'
                          ? { background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }
                          : { background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                        {model.tier.toUpperCase()}
                      </span>
                      {isFree ? (
                        <span className="text-xs font-medium" style={{ color: '#10b981' }}>Active</span>
                      ) : (
                        <a href={`mailto:${settings.contactEmail}?subject=Upgrade to ${model.name}`}
                          className="text-xs flex items-center gap-1 transition-colors"
                          style={{ color: '#a78bfa' }}>
                          Unlock <ChevronRight size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upgrade CTA */}
          {usagePercent >= 60 && (
            <div className="relative overflow-hidden rounded-2xl p-5 mb-8"
              style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(16,185,129,0.08))', border: '1px solid rgba(124,58,237,0.25)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={16} style={{ color: '#a78bfa' }} />
                    <span className="text-sm font-semibold text-white">
                      {usagePercent >= 100 ? 'Daily limit reached' : 'Nearing your limit'}
                    </span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: '#6b7280' }}>
                    {settings.upgradeMessage}
                  </p>
                  <a href={`mailto:${settings.contactEmail}?subject=Upgrade Request`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                    <Mail size={12} /> Upgrade Now
                  </a>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-3xl font-bold text-white">{Math.round(usagePercent)}%</span>
                  <p className="text-[10px]" style={{ color: '#4b5563' }}>used</p>
                </div>
              </div>
            </div>
          )}

          {/* Start chatting CTA */}
          <div className="rounded-2xl p-6 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
              <MessageCircle size={22} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to chat?</h3>
            <p className="text-sm mb-5" style={{ color: '#6b7280' }}>
              Click the chat button in the corner to start a conversation with Aatra AI.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#4b5563' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Aatra is online — Gemini 2.0 Flash ready
            </div>
          </div>
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
