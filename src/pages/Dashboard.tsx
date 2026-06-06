import { useUser, useClerk } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { loadSettings, getUsageToday } from '../lib/adminStore';
import {
  MessageCircle, Sparkles, LogOut, Settings, Crown,
  TrendingUp, Zap, User, ChevronRight, Mail, Star
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const settings = loadSettings();
  const usage = getUsageToday();
  const limit = settings.dailyFreeLimit || 20;
  const usagePercent = Math.min((usage / limit) * 100, 100);

  const firstName = user?.firstName || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'there';

  const freeModels = settings.models.filter(m => m.tier === 'free');

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,179,64,0.05) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 70%)' }} />
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white/[0.03] border-r border-white/8 flex flex-col z-20 hidden lg:flex">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center shadow-lg">
              <Sparkles size={14} className="text-[#080c18]" />
            </div>
            <span className="font-semibold text-white">Astra AI</span>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-amber-400/12 text-amber-400 border border-amber-400/15'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}>
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Usage card in sidebar */}
        <div className="px-3 pb-3">
          <div className="bg-white/5 border border-white/8 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Daily Usage</span>
              <span className="text-xs font-medium text-white">{usage}/{limit}</span>
            </div>
            <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden mb-2">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${usagePercent}%`,
                  background: usagePercent >= 80
                    ? 'linear-gradient(90deg,#f87171,#ef4444)'
                    : 'linear-gradient(90deg,#ffb340,#00c8ff)'
                }} />
            </div>
            {usagePercent >= 80 && (
              <a href={`mailto:${settings.contactEmail}?subject=Upgrade Request`}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                <Crown size={11} /> Upgrade for unlimited
              </a>
            )}
          </div>
        </div>

        {/* User + Signout */}
        <div className="px-3 pb-4 border-t border-white/8 pt-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            <img src={user?.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.fullName || firstName}</p>
              <p className="text-[10px] text-gray-600 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
            <button onClick={() => signOut({ redirectUrl: '/' })}
              className="text-gray-600 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 min-h-screen">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/8 bg-white/[0.02]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center">
              <Sparkles size={12} className="text-[#080c18]" />
            </div>
            <span className="font-semibold text-sm">Astra AI</span>
          </Link>
          <button onClick={() => signOut({ redirectUrl: '/' })}
            className="text-gray-500 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 lg:px-8 py-8">
          {/* Welcome header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-amber-400 font-medium">👋 Welcome back</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Hey, {firstName}!</h1>
            <p className="text-gray-500 text-sm mt-1">Here's what you can do with Astra today.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Messages Today', value: usage, icon: MessageCircle, color: 'amber' },
              { label: 'Daily Limit', value: limit, icon: Zap, color: 'cyan' },
              { label: 'Remaining', value: Math.max(0, limit - usage), icon: TrendingUp, color: 'green' },
              { label: 'Free Models', value: freeModels.length, icon: Star, color: 'purple' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
                <div className={`w-8 h-8 rounded-xl mb-3 flex items-center justify-center ${
                  stat.color === 'amber' ? 'bg-amber-400/15' :
                  stat.color === 'cyan' ? 'bg-cyan-400/15' :
                  stat.color === 'green' ? 'bg-emerald-400/15' : 'bg-purple-400/15'
                }`}>
                  <stat.icon size={15} className={
                    stat.color === 'amber' ? 'text-amber-400' :
                    stat.color === 'cyan' ? 'text-cyan-400' :
                    stat.color === 'green' ? 'text-emerald-400' : 'text-purple-400'
                  } />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Available models */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Models</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {settings.models.map((model, i) => {
                const isFree = model.tier === 'free';
                return (
                  <div key={i} className={`relative bg-white/[0.04] border rounded-2xl p-4 transition-all ${
                    isFree ? 'border-white/8 hover:border-white/15' : 'border-white/5 opacity-60'
                  }`}>
                    {!isFree && (
                      <div className="absolute top-3 right-3">
                        <Crown size={14} className="text-amber-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${isFree ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                      <span className="text-sm font-semibold text-white">{model.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{model.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        model.tier === 'free' ? 'bg-emerald-500/15 text-emerald-400' :
                        model.tier === 'pro' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-purple-500/15 text-purple-400'
                      }`}>{model.tier.toUpperCase()}</span>
                      {isFree ? (
                        <span className="text-xs text-emerald-400 font-medium">Active</span>
                      ) : (
                        <a href={`mailto:${settings.contactEmail}?subject=Upgrade to ${model.name}`}
                          className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                          Unlock <ChevronRight size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upgrade CTA if nearing limit */}
          {usagePercent >= 60 && (
            <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-400/8 to-cyan-400/8 p-5 mb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={16} className="text-amber-400" />
                    <span className="text-sm font-semibold text-white">
                      {usagePercent >= 100 ? 'Daily limit reached' : 'Nearing your limit'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {settings.upgradeMessage || 'Contact us to unlock unlimited messages and premium models.'}
                  </p>
                  <a
                    href={`mailto:${settings.contactEmail}?subject=Upgrade Request - ${user?.emailAddresses[0]?.emailAddress}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Mail size={12} /> Contact to Upgrade
                  </a>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-3xl font-bold text-white">{Math.round(usagePercent)}%</span>
                  <p className="text-[10px] text-gray-600">used</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick start chat button */}
          <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={22} className="text-[#080c18]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to chat?</h3>
            <p className="text-sm text-gray-500 mb-5">Click the chat button in the bottom-right corner to start a conversation with Astra AI.</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Astra is online and ready
            </div>
          </div>
        </div>
      </div>

      {/* Chat widget available on dashboard too */}
      {/* Import and render ChatWidget here if needed */}
    </div>
  );
}
