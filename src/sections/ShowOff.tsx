import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const chatMessages = [
  { sender: 'ai', text: "Hello! I'm Astra, your AI companion. How can I help you today?" },
  { sender: 'user', text: 'Can you help me brainstorm some ideas?' },
  { sender: 'ai', text: "Of course! What topic are you brainstorming about? I'd love to help you come up with creative ideas." },
  { sender: 'user', text: 'I need party theme ideas' },
  { sender: 'ai', text: 'Here are some fun party themes: 1) Neon Glow Party, 2) Retro 80s Arcade, 3) Masquerade Ball, 4) Tropical Luau, 5) Space Odyssey!' },
];

export default function ShowOff() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        phoneRef.current,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-32 md:py-40 bg-gradient-to-b from-navy to-navy-deep overflow-hidden"
    >
      {/* Cyan Glow Orb */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full gradient-orb-cyan pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Phone Mockup */}
          <div
            ref={phoneRef}
            className="relative animate-float-1 opacity-0"
          >
            <div className="w-[260px] md:w-[280px] h-[480px] md:h-[520px] bg-navy-dark rounded-[40px] border border-white/10 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-navy rounded-b-[20px] z-10" />

              {/* Chat Header */}
              <div className="h-[56px] bg-navy-dark border-b border-white/5 flex items-center px-4 gap-3 mt-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber to-cyan flex items-center justify-center">
                  <span className="text-[10px] font-bold text-navy">A</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Astra</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[9px] text-gray-muted">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 flex flex-col gap-2.5" style={{ height: 'calc(100% - 116px)' }}>
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] ${
                      msg.sender === 'user' ? 'self-end' : 'self-start'
                    }`}
                  >
                    <div
                      className={`px-3 py-2 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'chat-bubble-user text-white'
                          : 'chat-bubble-ai text-white'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[52px] bg-navy-dark border-t border-white/5 flex items-center px-3 gap-2">
                <div className="flex-1 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
                  <span className="text-xs text-gray-muted">Type a message...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Info Card */}
          <div
            ref={cardRef}
            className="liquid-glass rounded-2xl p-5 w-[220px] animate-float-2 opacity-0 md:-ml-8"
          >
            <Sparkles size={16} className="text-amber mb-3" />
            <h4 className="text-base font-semibold text-white mb-1">Smart Conversations</h4>
            <p className="text-xs text-gray-muted mb-4">AI that understands context and emotions</p>
            <div>
              <div className="text-xl font-bold text-amber">10M+</div>
              <div className="text-xs text-gray-muted">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
