import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Aatra Free',
    price: '₹0',
    period: '/month',
    description: 'Powered by Gemini 2.0 Flash',
    icon: Sparkles,
    iconColor: '#10b981',
    featured: false,
    features: [
      '30 messages per day',
      'Gemini 2.0 Flash model',
      'Full chat history',
      'File attachments',
      'No credit card ever',
    ],
    cta: 'Start Free Now',
    ctaPrimary: false,
    action: 'signup',
  },
  {
    name: 'Aatra Pro',
    price: '₹799',
    period: '/month',
    description: 'Unlimited Gemini 1.5 Pro',
    icon: Zap,
    iconColor: '#7c3aed',
    featured: true,
    features: [
      'Unlimited messages',
      'Gemini 1.5 Pro model',
      'Priority response speed',
      'Advanced reasoning',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    ctaPrimary: true,
    action: 'contact',
  },
  {
    name: 'Aatra Ultra',
    price: '₹1,799',
    period: '/month',
    description: 'Max intelligence, API access',
    icon: Crown,
    iconColor: '#f59e0b',
    featured: false,
    features: [
      'Everything in Pro',
      'Gemini Ultra model',
      'API access',
      'Team collaboration (5 seats)',
      'Dedicated support',
    ],
    cta: 'Go Ultra',
    ctaPrimary: false,
    action: 'contact',
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleClick = (plan: typeof plans[0]) => {
    if (plan.action === 'signup') navigate('/sign-up');
    else navigate(`/checkout?plan=${plan.name.toLowerCase().replace(' ', '-')}`);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current?.children || [], { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 80%' },
      });
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.7, delay: i * 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pricing" className="relative w-full py-32"
      style={{ background: 'linear-gradient(180deg,#080f0a 0%,#0a0612 50%,#080f0a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-12">
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
            Free plan included — no credit card
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Simple, honest pricing</h2>
          <p className="text-lg" style={{ color: '#9ca3af' }}>Start free with Gemini Flash. Upgrade when you're ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} ref={el => { cardsRef.current[i] = el; }}
              className="relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: plan.featured ? 'linear-gradient(145deg,rgba(124,58,237,0.15),rgba(16,185,129,0.08))' : 'rgba(255,255,255,0.04)',
                border: plan.featured ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: plan.featured ? '0 0 40px rgba(124,58,237,0.15)' : 'none',
              }}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-[11px] font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: `${plan.iconColor}20`, border: `1px solid ${plan.iconColor}40` }}>
                  <plan.icon size={18} style={{ color: plan.iconColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{plan.description}</p>
                </div>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                <span className="text-sm ml-1" style={{ color: '#6b7280' }}>{plan.period}</span>
              </div>

              <div className="w-full h-px mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} />

              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <Check size={15} className="flex-shrink-0" style={{ color: plan.iconColor }} />
                    <span className="text-sm text-white">{f}</span>
                  </li>
                ))}
              </ul>

              <button onClick={() => handleClick(plan)}
                className="w-full py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={plan.ctaPrimary
                  ? { background: 'linear-gradient(135deg,#7c3aed,#10b981)', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Free tier callout */}
        <div className="mt-12 text-center">
          <p className="text-sm" style={{ color: '#6b7280' }}>
            🎉 The free plan uses <span className="text-emerald-400 font-medium">Google Gemini 2.0 Flash</span> — the same model powering millions of developers. No catch.
          </p>
        </div>
      </div>
    </section>
  );
}
