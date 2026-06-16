import { useNavigate } from 'react-router';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

const msgs = [
  { r: 'user', t: 'Write me a business plan for a coffee shop' },
  { r: 'ai', t: 'Here\'s a complete business plan outline with financials, marketing strategy, and operational guidelines...' },
  { r: 'user', t: 'Make it more creative' },
  { r: 'ai', t: 'Absolutely! Let\'s infuse your coffee shop with a unique identity that stands out...' },
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#08060f 0%,#0a0f08 100%)' }}>
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8 py-20 lg:py-0 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Google Gemini 2.0 Flash · Free
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] tracking-tight mb-5">
            Your free<br />
            <span style={{ background: 'linear-gradient(90deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI assistant
            </span><br />
            is here.
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Aatra AI gives you 30 free Gemini messages every day — no credit card, no limits on what you can ask.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
            <button onClick={() => navigate('/sign-up')}
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-white text-base transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)', boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}>
              Start Free <ArrowRight size={18} />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-medium text-gray-300 text-base transition-all hover:bg-white/8 hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
              <MessageCircle size={18} /> See Features
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-600">
            {['No credit card', 'Free forever plan', 'Gemini 2.0 Flash'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — chat preview */}
        <div className="flex-shrink-0 w-full max-w-sm lg:max-w-[340px]">
          <div className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: '#0f0a1e', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 32px 80px rgba(124,58,237,0.25)' }}>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: '1px solid rgba(124,58,237,0.15)', background: 'rgba(124,58,237,0.08)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Aatra AI</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini · Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-3 min-h-[260px]">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.r === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs text-white leading-relaxed"
                    style={m.r === 'user'
                      ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }
                      : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(124,58,237,0.18)' }}>
                    {m.t}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3"
              style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
              <input readOnly placeholder="Ask Aatra anything..."
                className="flex-1 bg-transparent text-xs text-gray-400 placeholder:text-gray-600 focus:outline-none" />
              <div className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                <ArrowRight size={13} className="text-white" />
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <span className="text-emerald-400 text-sm">✦</span>
            <span className="text-xs text-emerald-300 font-medium">30 free messages · Resets daily</span>
          </div>
        </div>
      </div>
    </section>
  );
}
