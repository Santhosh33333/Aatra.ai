import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Brain, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const chatMessages = [
  { sender: 'ai', text: "Hello! I'm Aatra AI, powered by Gemini." },
  { sender: 'user', text: 'Can you help me brainstorm ideas?' },
  { sender: 'ai', text: "Of course! What topic would you like to explore?" },
  { sender: 'user', text: 'Marketing for my startup' },
  { sender: 'ai', text: "Great! Here are 5 proven strategies..." },
];

const highlights = [
  { icon: Zap, label: '45ms', sub: 'Avg response', color: '#10b981' },
  { icon: Brain, label: '99.8%', sub: 'Accuracy', color: '#7c3aed' },
  { icon: Globe, label: '50+', sub: 'Languages', color: '#3b82f6' },
];

function ShowOff() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(phoneRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );
      gsap.fromTo(contentRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-24"
      style={{ background: 'linear-gradient(180deg,#080f0a,#0a0612)' }}>
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle,#10b981,transparent)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Phone mock */}
          <div ref={phoneRef} className="flex justify-center lg:justify-start opacity-0">
            <div className="w-[260px] rounded-[36px] overflow-hidden shadow-2xl flex-shrink-0"
              style={{ background: '#0f0a1e', border: '1px solid rgba(124,58,237,0.3)', boxShadow: '0 32px 80px rgba(124,58,237,0.2)' }}>
              {/* Phone header */}
              <div className="h-12 flex items-center px-4 gap-2"
                style={{ borderBottom: '1px solid rgba(124,58,237,0.15)', background: 'rgba(124,58,237,0.08)' }}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Aatra AI</div>
                  <div className="text-[9px] text-emerald-400">Gemini · Online</div>
                </div>
              </div>
              {/* Messages */}
              <div className="p-3 space-y-2.5" style={{ minHeight: 280 }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[80%] px-3 py-2 text-xs rounded-2xl text-white leading-relaxed"
                      style={msg.sender === 'user'
                        ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }
                        : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(124,58,237,0.2)' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              {/* Input bar */}
              <div className="h-12 flex items-center px-3 gap-2"
                style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
                <input type="text" placeholder="Ask anything..." readOnly
                  className="flex-1 text-xs text-white placeholder:text-gray-600 bg-transparent focus:outline-none" />
                <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div ref={contentRef} className="space-y-6 opacity-0">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#10b981' }}>
                Real conversations
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Smart AI that actually<br />
                <span style={{ background: 'linear-gradient(90deg,#7c3aed,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  understands you
                </span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Powered by Google Gemini 2.0 Flash — the same technology powering millions of developers worldwide. Context-aware, fast, and completely free.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {highlights.map((h) => (
                <div key={h.label} className="p-4 rounded-2xl text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <h.icon size={18} className="mx-auto mb-2" style={{ color: h.color }} />
                  <div className="text-lg font-bold text-white">{h.label}</div>
                  <div className="text-[10px] text-gray-500">{h.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ShowOff);
