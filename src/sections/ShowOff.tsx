import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const chatMessages = [
  { sender: 'ai', text: "Hello! I'm Astra, your AI companion." },
  { sender: 'user', text: 'Can you help me brainstorm?' },
  { sender: 'ai', text: "Of course! What topic would you like?" },
];

function ShowOff() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        phoneRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
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
      className="relative w-full py-24 md:py-32 bg-gradient-to-b from-navy to-navy-deep overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #00c8ff, transparent)' }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div ref={phoneRef} className="relative opacity-0">
            <div className="w-[260px] h-[480px] bg-navy-dark rounded-[40px] border border-white/10 overflow-hidden shadow-lg">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-6 bg-navy rounded-b-[16px] z-10" />
              <div className="h-[48px] bg-navy-dark border-b border-white/5 flex items-center px-4 gap-2 mt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber to-cyan" />
                <div>
                  <div className="text-xs font-semibold text-white">Astra</div>
                  <div className="text-[9px] text-gray-400">Online</div>
                </div>
              </div>
              <div className="p-3 space-y-2" style={{ height: 'calc(100% - 102px)' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3 py-1.5 text-xs rounded-lg ${msg.sender === 'user' ? 'bg-amber-500/40 text-white' : 'bg-white/10 text-gray-300'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-[48px] bg-navy-dark border-t border-white/5 flex items-center px-3 gap-2">
                <input type="text" placeholder="Type..." className="flex-1 bg-white/5 rounded-full px-3 py-1.5 text-xs placeholder:text-gray-500 border border-white/10" />
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Smart Conversations</h3>
            <p className="text-gray-400 mb-4">AI that understands context and emotions</p>
            <div>
              <div className="text-3xl font-bold text-amber">10M+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ShowOff);
