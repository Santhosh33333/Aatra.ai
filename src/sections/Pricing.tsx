import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);


const plans = [
  {
    name: 'Mini',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    featured: false,
    features: [
      '20 messages per day',
      'Basic AI responses',
      '1 custom theme',
      'Text chat only',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'secondary' as const,
    action: 'signup',
    subject: '',
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'Best for daily chatters',
    featured: true,
    features: [
      'Unlimited messages',
      'Advanced AI with memory',
      'All custom themes',
      'Voice messages',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    ctaStyle: 'primary' as const,
    action: 'contact',
    subject: 'Pro Plan - Upgrade Request',
  },
  {
    name: 'Ultra',
    price: '$19',
    period: '/month',
    description: 'For power users',
    featured: false,
    features: [
      'Everything in Pro',
      'Custom AI training',
      'API access',
      'Team collaboration',
      'Dedicated support',
    ],
    cta: 'Go Ultra',
    ctaStyle: 'secondary' as const,
    action: 'contact',
    subject: 'Ultra Plan - Upgrade Request',
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleClick = (plan: typeof plans[0]) => {
    if (plan.action === 'signup') {
      navigate('/sign-up');
    } else if (plan.action === 'contact') {
      navigate(`/checkout?plan=${plan.name.toLowerCase()}`);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
          },
        }
      );

      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: i * 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative w-full py-32 md:py-40 bg-gradient-to-b from-navy to-[#1e2332]"
    >
      <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="text-xs font-medium text-gray-muted uppercase tracking-[3px] mb-4 opacity-0">
            PRICING
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 opacity-0">
            Choose your plan
          </h2>
          <p className="text-lg text-gray-muted opacity-0">
            Start free, upgrade when you're ready
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`relative pricing-card ${
                plan.featured ? 'pricing-card-featured' : ''
              } opacity-0 hover:-translate-y-1 transition-transform duration-300`}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-navy border border-amber text-amber text-[11px] font-semibold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-semibold text-white mt-2">{plan.name}</h3>

              {/* Price */}
              <div className="flex items-baseline mt-4">
                <span className="text-5xl md:text-6xl font-bold text-white">{plan.price}</span>
                <span className="text-sm text-gray-muted ml-1">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-muted mt-2">{plan.description}</p>

              {/* Divider */}
              <div className="w-full h-px bg-white/10 my-6" />

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" />
                    <span className="text-sm text-white">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleClick(plan)}
                className={`w-full mt-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  plan.ctaStyle === 'primary'
                    ? 'bg-amber text-navy hover:bg-amber-light hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/[0.15] hover:border-white/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
