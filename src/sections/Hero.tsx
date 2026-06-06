import { useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';

const chatMessages = [
  { sender: 'user', text: 'Explain quantum computing simply' },
  { sender: 'ai', text: "Like a coin spinning — heads and tails at once until observed." },
  { sender: 'user', text: 'Write a poem about the sea' },
  { sender: 'ai', text: "Waves whisper secrets to the shore, each tide a story, ever more." },
];

function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, 0.1)
        .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.3)
        .fromTo(buttonsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.45)
        .fromTo(chatRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.7 }, 0.5);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden pt-24"
      style={{ background: 'linear-gradient(135deg,#0a0612 0%,#080f0a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 min-h-screen py-24">
        {/* Left: Copy */}
        <div className="flex-1">
          <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Powered by Google Gemini · 100% Free
          </div>

          <h1 ref={headlineRef} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08] mb-6">
            Think smarter.<br />
            <span style={{ background: 'linear-gradient(90deg,#7c3aed,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Chat faster.
            </span><br />
            For free.
          </h1>

          <p ref={subRef} className="text-lg md:text-xl mb-8 max-w-lg leading-relaxed" style={{ color: '#9ca3af' }}>
            Aatra AI gives you Google Gemini Flash — no credit card, no tricks. 30 free messages every single day.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mb-10">
            <button onClick={() => navigate('/sign-up')}
              className="px-8 py-4 rounded-2xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}>
              Start Free — No Card Needed
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-2xl font-medium text-white transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              See How It Works
            </button>
          </div>

          <div className="flex items-center gap-6 text-xs" style={{ color: '#6b7280' }}>
            {['Free forever plan', 'No credit card', 'Gemini 2.0 Flash'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Phone mock */}
        <div ref={chatRef} className="flex-shrink-0">
          <div className="w-[280px] md:w-[320px]"
            style={{ background: 'rgba(15,10,30,0.9)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 32, overflow: 'hidden', boxShadow: '0 32px 80px rgba(124,58,237,0.25)' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-5 rounded-b-2xl z-10"
              style={{ background: '#0a0612' }} />
            <div className="h-12 flex items-center px-4 gap-2 mt-1"
              style={{ borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Aatra AI</div>
                <div className="text-[9px] text-emerald-400">Gemini Flash · Online</div>
              </div>
            </div>
            <div className="p-3 space-y-2.5" style={{ minHeight: 260 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[80%] px-3 py-2 text-xs rounded-2xl leading-relaxed text-white"
                    style={msg.sender === 'user'
                      ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }
                      : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-12 flex items-center px-3 gap-2"
              style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
              <input type="text" placeholder="Ask anything..."
                className="flex-1 text-xs text-white placeholder:text-gray-600 bg-transparent focus:outline-none" />
              <div className="w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                <span className="text-white text-xs">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
