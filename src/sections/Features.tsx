import { Brain, Zap, Shield, Globe, Sparkles, Clock } from 'lucide-react';

const features = [
  { icon: Brain, title: 'Context-Aware AI', desc: 'Gemini remembers your conversation and gives smarter answers the longer you chat.', color: '#7c3aed' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Responses in under a second. Gemini 2.0 Flash is built for speed without sacrificing quality.', color: '#10b981' },
  { icon: Shield, title: 'Private & Secure', desc: 'Your conversations are never stored or used for training. What you say stays with you.', color: '#3b82f6' },
  { icon: Globe, title: '50+ Languages', desc: 'Chat in any language — Aatra AI understands and responds fluently across the globe.', color: '#f59e0b' },
  { icon: Sparkles, title: 'Always Improving', desc: 'Powered by the latest Gemini models — benefits from Google\'s continuous AI research.', color: '#ec4899' },
  { icon: Clock, title: '30 Free Daily', desc: 'Generous free tier — 30 messages every single day, no credit card ever required.', color: '#34d399' },
];

export default function Features() {
  return (
    <section id="features" className="w-full py-24"
      style={{ background: 'linear-gradient(180deg,#0a0f08,#08060f)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
            Why Aatra AI
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Everything you need,<br />nothing you don't
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            A clean, fast AI chat experience — no bloat, no subscriptions, no tricks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i}
              className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-opacity-40"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
