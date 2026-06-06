import { useEffect, useRef, memo } from 'react';
import gsap from 'gsap';

const chatMessages = [
  { sender: 'user', text: 'Hey, how are you feeling today?' },
  { sender: 'ai', text: "I'm doing great! Ready to chat." },
  { sender: 'user', text: 'Tell me something interesting' },
  { sender: 'ai', text: "Did you know octopuses have three hearts?" },
];

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(subheadlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo(buttonsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.4)
        .fromTo(chatRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6 }, 0.6);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-navy pt-24"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #ffb340, transparent)' }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #00c8ff, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-12 flex flex-col justify-center h-full">
        <div className="mb-8">
          <div className="text-xs font-medium text-amber-400 uppercase tracking-[3px] mb-4">AI CHAT</div>
          <h1 ref={headlineRef} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4 leading-tight">
            It&apos;s not just chat, it&apos;s a <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">connection</span>
          </h1>
          <p ref={subheadlineRef} className="text-lg md:text-xl text-gray-400 max-w-2xl">Experience conversations that understand you</p>
        </div>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mb-16">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 text-navy font-semibold hover:opacity-90">Start Chatting</button>
          <button className="px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/5 font-semibold">Learn More</button>
        </div>

        <div ref={chatRef} className="relative w-[280px] md:w-[340px] h-[480px] md:h-[520px] bg-navy-dark rounded-[40px] border border-white/10 overflow-hidden shadow-lg">
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
    </section>
  );
}

export default memo(Hero);
