import { useNavigate } from 'react-router';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const plans = [
  {
    id: 'mini',
    name: 'Free', price: '₹0', period: '/month',
    desc: 'Perfect to start — no card needed',
    icon: Sparkles, color: '#10b981',
    features: ['30 messages per day', 'Gemini 2.0 Flash', 'Full chat history', 'File attachments', 'No credit card ever'],
    cta: 'Start Free Now', primary: false, action: 'signup',
  },
  {
    id: 'pro',
    name: 'Pro', price: '₹799', period: '/month',
    desc: 'Unlimited power for serious users',
    icon: Zap, color: '#7c3aed',
    features: ['Unlimited messages', 'Gemini 1.5 Pro', 'Priority speed', 'Advanced reasoning', 'Priority support'],
    cta: 'Upgrade to Pro', primary: true, action: 'checkout',
  },
  {
    id: 'ultra',
    name: 'Ultra', price: '₹1,799', period: '/month',
    desc: 'Maximum intelligence + API access',
    icon: Crown, color: '#f59e0b',
    features: ['Everything in Pro', 'Gemini Ultra model', 'API access', '5 team seats', 'Dedicated support'],
    cta: 'Go Ultra', primary: false, action: 'checkout',
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  const handleClick = (action: string, planId: string) => {
    if (action === 'signup') navigate('/sign-up');
    else navigate(`/checkout?plan=${planId}`);
  };

  return (
    <section id="pricing" className="w-full py-24" style={{ background: '#08060f' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
            Free plan included — always
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Simple, honest pricing</h2>
          <p className="text-gray-400 text-lg">Start free with Gemini Flash. Upgrade when you're ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <div key={i}
              className="relative rounded-3xl p-7 flex flex-col transition-all hover:-translate-y-1"
              style={{
                background: p.primary ? 'linear-gradient(145deg,rgba(124,58,237,0.14),rgba(16,185,129,0.07))' : 'rgba(255,255,255,0.03)',
                border: p.primary ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: p.primary ? '0 0 40px rgba(124,58,237,0.12)' : 'none',
              }}>
              {p.primary && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full text-[11px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: `${p.color}18`, border: `1px solid ${p.color}35` }}>
                  <p.icon size={18} style={{ color: p.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Aatra {p.name}</h3>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-extrabold text-white">{p.price}</span>
                <span className="text-sm text-gray-500">{p.period}</span>
              </div>

              <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.07)' }} />

              <ul className="space-y-2.5 mb-7 flex-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check size={14} style={{ color: p.color }} className="flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => handleClick(p.action, p.id)}
                className="w-full py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={p.primary
                  ? { background: 'linear-gradient(135deg,#7c3aed,#10b981)', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-600 mt-10">
          🎉 The free plan uses <span className="text-emerald-400 font-medium">Google Gemini 2.0 Flash</span> — the same model powering millions of developers. No catch.
        </p>
      </div>
    </section>
  );
}
