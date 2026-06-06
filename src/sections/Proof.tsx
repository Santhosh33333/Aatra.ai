import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lock, Users, Globe, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const circularText = 'CONNECT WITH THE WORLD \u00B7 ';

const floatingCards = [
  {
    icon: Lock,
    title: 'End-to-End Encrypted',
    description: 'Your conversations are private and secure',
    position: 'top-left',
    offset: { x: -120, y: -60 },
  },
  {
    icon: Users,
    title: '10M+ Users',
    description: 'Join a global community',
    position: 'top-right',
    offset: { x: 80, y: -40 },
  },
  {
    icon: Globe,
    title: '50+ Languages',
    description: 'Chat in your native tongue',
    position: 'bottom-right',
    offset: { x: 100, y: 60 },
  },
];

export default function Proof() {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Circle entrance
      gsap.fromTo(
        circleRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Screenshot entrance
      gsap.fromTo(
        screenshotRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Floating cards entrance
      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, x: floatingCards[i].offset.x > 0 ? 30 : -30, y: 20 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              delay: 0.5 + i * 0.2,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 70%',
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
      className="relative w-full py-32 md:py-40 bg-navy-deep dot-pattern overflow-hidden"
    >
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 flex flex-col items-center">
        {/* Circular Text */}
        <div
          ref={circleRef}
          className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] opacity-0"
        >
          {/* Rotating Text */}
          <div className="absolute inset-0 animate-spin-slow">
            <svg viewBox="0 0 500 500" className="w-full h-full">
              <defs>
                <path
                  id="circlePath"
                  d="M 250, 250 m -200, 0 a 200,200 0 1,1 400,0 a 200,200 0 1,1 -400,0"
                  fill="none"
                />
              </defs>
              <text
                fill="white"
                fontSize="28"
                fontWeight="700"
                letterSpacing="8"
                textLength="1256"
              >
                <textPath href="#circlePath" startOffset="0%">
                  {circularText.repeat(2)}
                </textPath>
              </text>
            </svg>
          </div>

          {/* Center Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-amber to-cyan flex items-center justify-center shadow-glow-strong hover:scale-110 transition-transform duration-300">
              <Sparkles size={40} className="text-[#080c18] md:w-14 md:h-14" strokeWidth={1.5} />
            </div>
          </div>

          {/* Floating Cards */}
          {floatingCards.map((card, i) => (
            <div
              key={i}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`absolute hidden md:block liquid-glass rounded-2xl p-4 w-[180px] opacity-0 ${
                i === 0 ? 'animate-float-1' : i === 1 ? 'animate-float-2' : 'animate-float-1'
              }`}
              style={{
                ...(card.position === 'top-left' && { top: '15%', left: '-5%' }),
                ...(card.position === 'top-right' && { top: '10%', right: '-5%' }),
                ...(card.position === 'bottom-right' && { bottom: '15%', right: '-8%' }),
                animationDelay: `${i * 1.5}s`,
              }}
            >
              <card.icon size={16} className={i === 1 ? 'text-amber mb-2' : 'text-cyan mb-2'} />
              <h4 className="text-sm font-semibold text-white mb-1">{card.title}</h4>
              <p className="text-xs text-gray-muted">{card.description}</p>
            </div>
          ))}
        </div>

        {/* App Screenshot */}
        <div
          ref={screenshotRef}
          className="mt-16 md:mt-20 w-full max-w-[800px] opacity-0 rounded-3xl overflow-hidden border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        >
          <svg 
            viewBox="0 0 800 400" 
            className="w-full h-auto bg-gradient-to-b from-navy-dark to-[#1e2332]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Header bar */}
            <rect width="800" height="50" fill="#0f1420" opacity="0.8"/>
            <circle cx="30" cy="25" r="8" fill="#88a5d8" opacity="0.6"/>
            <circle cx="55" cy="25" r="8" fill="#88a5d8" opacity="0.4"/>
            <circle cx="80" cy="25" r="8" fill="#88a5d8" opacity="0.2"/>
            
            {/* Chat bubbles */}
            <g>
              {/* AI message 1 */}
              <rect x="50" y="80" width="300" height="40" rx="8" fill="#1e3a5f" opacity="0.6"/>
              <text x="70" y="105" fontSize="14" fill="#88a5d8" fontFamily="Arial">How can I help you today?</text>
              
              {/* User message 1 */}
              <rect x="450" y="130" width="300" height="40" rx="8" fill="#ffa340" opacity="0.2"/>
              <text x="470" y="155" fontSize="14" fill="#ffa340" fontFamily="Arial">Help me write an email</text>
              
              {/* AI message 2 */}
              <rect x="50" y="180" width="320" height="50" rx="8" fill="#1e3a5f" opacity="0.6"/>
              <text x="70" y="205" fontSize="14" fill="#88a5d8" fontFamily="Arial">I'll help you draft a professional</text>
              <text x="70" y="225" fontSize="14" fill="#88a5d8" fontFamily="Arial">email with perfect tone.</text>
              
              {/* User message 2 */}
              <rect x="480" y="240" width="270" height="40" rx="8" fill="#ffa340" opacity="0.2"/>
              <text x="500" y="265" fontSize="14" fill="#ffa340" fontFamily="Arial">Make it formal please</text>
            </g>
            
            {/* Astra branding */}
            <circle cx="400" cy="340" r="20" fill="none" stroke="#00c8ff" strokeWidth="2" opacity="0.4"/>
            <text x="400" y="350" fontSize="16" fill="#88a5d8" fontFamily="Arial" textAnchor="middle" fontWeight="bold">Astra AI</text>
          </svg>
        </div>

        {/* Mobile floating cards */}
        <div className="flex flex-col md:hidden gap-4 mt-12 w-full max-w-[300px]">
          {floatingCards.map((card, i) => (
            <div
              key={i}
              className="liquid-glass rounded-2xl p-4"
            >
              <card.icon size={16} className={i === 1 ? 'text-amber mb-2' : 'text-cyan mb-2'} />
              <h4 className="text-sm font-semibold text-white mb-1">{card.title}</h4>
              <p className="text-xs text-gray-muted">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
