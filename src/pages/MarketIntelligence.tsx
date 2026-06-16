import { Link } from 'react-router';
import {
  Activity,
  ArrowUpRight,
  BadgeDollarSign,
  Bell,
  Brain,
  CandlestickChart,
  ChartNoAxesCombined,
  CircleAlert,
  Shield,
  Sparkles,
  Waves,
} from 'lucide-react';

const overviewCards = [
  { label: 'NSE/BSE Momentum', value: '+1.82%', tone: 'text-emerald-300' },
  { label: 'AI Buy Signals', value: '18', tone: 'text-cyan-300' },
  { label: 'F&O Opportunities', value: '7', tone: 'text-violet-300' },
  { label: 'Risk Score', value: 'Moderate', tone: 'text-amber-300' },
];

const signals = [
  { name: 'Reliance', horizon: 'Swing', bias: 'Bullish', entry: '₹2,780', target: '₹2,940', stop: '₹2,700', score: '91/100' },
  { name: 'HDFC Bank', horizon: 'Short-term', bias: 'Neutral', entry: '₹1,690', target: '₹1,735', stop: '₹1,660', score: '84/100' },
  { name: 'Tata Motors', horizon: 'Growth', bias: 'Bullish', entry: '₹730', target: '₹790', stop: '₹700', score: '88/100' },
];

const opportunityGroups = [
  {
    title: 'Penny Stock Radar',
    accent: 'from-emerald-500/15 to-cyan-500/5',
    items: ['Surge in volume', 'Breakout confirmation', 'Risk-adjusted growth probability'],
  },
  {
    title: 'ShAI Signals',
    accent: 'from-violet-500/15 to-fuchsia-500/5',
    items: ['AI sentiment score', 'Institutional flow pulse', 'Auto-exit triggers'],
  },
  {
    title: 'Growth & Unlisted Watchlist',
    accent: 'from-amber-500/15 to-rose-500/5',
    items: ['High-growth potential', 'Unlisted opportunities', 'Early-stage portfolio scouts'],
  },
];

const fnoCards = [
  { label: 'PCR', value: '0.84', note: 'Slightly bullish bias' },
  { label: 'OI Build-up', value: 'Strong', note: 'Calls adding on breakouts' },
  { label: 'Max Pain', value: '19,450', note: 'Key expiry support zone' },
  { label: 'IV Rank', value: '58%', note: 'Volatility healthy for spreads' },
];

export default function MarketIntelligence() {
  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(180deg,#08060f 0%,#0b1220 45%,#08060f 100%)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-0 h-72 w-72 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle,#7c3aed,transparent 60%)' }} />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle,#10b981,transparent 60%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 py-8 lg:py-10">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300">Aatra AI • Market Intelligence</p>
            <h1 className="mt-2 text-3xl lg:text-5xl font-black tracking-tight text-white">AI-powered Stock, F&O & Growth Analytics</h1>
            <p className="mt-3 max-w-3xl text-sm lg:text-base text-gray-300">
              Real-time market intelligence, AI signals, penny stock scans, growth and unlisted opportunities, plus F&O workflows for traders and investors.
            </p>
          </div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white border border-white/10 bg-white/5 hover:bg-white/10">
            <Sparkles size={14} /> Back to dashboard
          </Link>
        </header>

        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {overviewCards.map((card) => (
            <article key={card.label} className="rounded-3xl border border-white/8 bg-white/5 p-4 shadow-2xl shadow-black/25">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">{card.label}</p>
              <p className={`mt-3 text-2xl lg:text-3xl font-black ${card.tone}`}>{card.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] mb-8">
          <article className="rounded-3xl border border-violet-500/15 bg-gradient-to-br from-violet-500/12 via-white/4 to-emerald-500/8 p-6 shadow-2xl shadow-violet-950/20">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-violet-200">Live market overview</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Institutional flows, trend strength, and AI sentiment</h2>
              </div>
              <Activity className="text-emerald-300" size={18} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Market Bias', 'Bullish with healthy consolidation'],
                ['Sector Watch', 'Banking, Energy, Auto leading momentum'],
                ['News Impact', 'FII inflows + policy sentiment'],
                ['AI Confidence', 'High on quality large caps'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">{label}</p>
                  <p className="mt-2 text-sm text-gray-100">{value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/8 bg-white/5 p-6 shadow-2xl shadow-black/25">
            <div className="flex items-center gap-2 text-emerald-300 mb-2">
              <Brain size={16} />
              <p className="text-xs uppercase tracking-[0.25em]">Recommendation engine</p>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">AI-generated entry, target, stop-loss & risk-reward</h2>
            <div className="space-y-3">
              {signals.map((item) => (
                <article key={item.name} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] text-gray-400">{item.horizon} • {item.bias}</p>
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-200">{item.score}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-200">
                    <p>Entry: <span className="text-white font-semibold">{item.entry}</span></p>
                    <p>Target: <span className="text-emerald-300 font-semibold">{item.target}</span></p>
                    <p>Stop-loss: <span className="text-rose-300 font-semibold">{item.stop}</span></p>
                    <p>RR: <span className="text-cyan-300 font-semibold">1:2.4</span></p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr] mb-8">
          <article className="rounded-3xl border border-white/8 bg-white/5 p-6 shadow-2xl shadow-black/25">
            <div className="flex items-center gap-2 text-cyan-300 mb-2">
              <CandlestickChart size={16} />
              <p className="text-xs uppercase tracking-[0.25em]">Opportunity scan</p>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">Penny, ShAI, Growth & Unlisted watchlist</h2>
            <div className="grid gap-4">
              {opportunityGroups.map((group) => (
                <article key={group.title} className={`rounded-2xl border border-white/8 bg-gradient-to-r ${group.accent} p-4`}>
                  <p className="text-sm font-semibold text-white">{group.title}</p>
                  <ul className="mt-2 space-y-1 text-xs text-gray-200">
                    {group.items.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/8 bg-white/5 p-6 shadow-2xl shadow-black/25">
            <div className="flex items-center gap-2 text-amber-300 mb-2">
              <BadgeDollarSign size={16} />
              <p className="text-xs uppercase tracking-[0.25em]">F&O analytics</p>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">OI, PCR, IV and expiry intelligence</h2>
            <div className="grid grid-cols-2 gap-3">
              {fnoCards.map((item) => (
                <article key={item.label} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">{item.label}</p>
                  <p className="mt-2 text-xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-xs text-gray-300">{item.note}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-white/8 bg-white/5 p-6 shadow-2xl shadow-black/25">
            <div className="flex items-center gap-2 text-violet-300 mb-2">
              <Waves size={16} />
              <p className="text-xs uppercase tracking-[0.25em]">Automated workflow</p>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">Screen → detect → signal → risk manage → execute</h2>
            <ul className="space-y-3 text-sm text-gray-200">
              {['Live screening across NSE/BSE and F&O symbols', 'Smart exit automation for target, stop-loss, and AI triggers', 'Position sizing and risk scoring for every opportunity'].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 p-3"><CircleAlert size={14} className="mt-0.5 text-amber-300" />{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-white/8 bg-white/5 p-6 shadow-2xl shadow-black/25">
            <div className="flex items-center gap-2 text-emerald-300 mb-2">
              <Shield size={16} />
              <p className="text-xs uppercase tracking-[0.25em]">Portfolio & alerts</p>
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">Risk scoring, alerts, and portfolio optimization</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Portfolio P/L', '+12.4% YTD'],
                ['Diversification', 'Balanced across large caps, growth, F&O'],
                ['Alerts', 'Breakout, news, OI, and IV updates'],
                ['Execution', 'Broker-ready automation and watchlists'],
              ].map(([label, value]) => (
                <article key={label} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">{label}</p>
                  <p className="mt-2 text-sm text-gray-100">{value}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white"> <Bell size={14} /> Enable alerts</button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white"> <ArrowUpRight size={14} /> Export signal summary</button>
            </div>
          </article>
        </section>

        <footer className="mt-8 rounded-3xl border border-white/8 bg-black/20 p-5 text-sm text-gray-300 shadow-2xl shadow-black/25">
          <div className="flex flex-wrap items-center gap-2 text-emerald-300"><ChartNoAxesCombined size={16} /> Professional trading dashboard with real-time analytics, F&O workflows, and AI-driven recommendations.</div>
          <p className="mt-2 text-xs text-gray-400">Includes NSE/BSE, growth, penny, ShAI, and unlisted stock intelligence modules for end-to-end market analysis.</p>
        </footer>
      </div>
    </div>
  );
}
