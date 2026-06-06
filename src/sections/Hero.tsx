import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Paperclip, Mic, Send } from 'lucide-react';

const chatMessages = [
  { sender: 'user', text: 'Hey, how are you feeling today?' },
  { sender: 'ai', text: "I'm doing great! Ready to chat whenever you are. What's on your mind?" },
  { sender: 'user', text: 'Tell me something interesting' },
  { sender: 'ai', text: "Did you know that octopuses have three hearts? Two pump blood to the gills, while one pumps it to the rest of the body!" },
];

const brandLogos = ['TechCrunch', 'Wired', 'The Verge', 'Forbes', 'Bloomberg', 'CNN'];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(overlineRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
        .fromTo(subheadlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.4)
        .fromTo(buttonsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6)
        .fromTo(chatRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.8)
        .fromTo(logosRef.current?.children || [], { opacity: 0 }, { opacity: 0.5, duration: 0.6, stagger: 0.1 }, 1.2);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-navy"
    >
      {/* Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full gradient-orb-amber animate-float-1"
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full gradient-orb-cyan animate-float-1"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 pt-40 pb-20 flex flex-col items-center">
        {/* Overline */}
        <div
          ref={overlineRef}
          className="text-xs font-medium text-gray-muted uppercase tracking-[3px] mb-6 opacity-0"
        >
          AI CHAT
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-[80px] font-bold text-white text-center leading-[1] tracking-tight max-w-[800px] opacity-0"
        >
          It's not just chat, it's a{' '}
          <span className="gradient-text">connection</span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mt-6 text-lg text-gray-muted text-center max-w-[480px] leading-relaxed opacity-0"
        >
          Experience conversations that understand you
        </p>

        {/* CTA Buttons */}
        <div ref={buttonsRef} className="mt-10 flex flex-row gap-4 opacity-0">
          <a href="#pricing" className="btn-primary">Start Chatting</a>
          <a href="#features" className="btn-secondary">Learn More</a>
        </div>

        {/* Chat Mockup */}
        <div
          ref={chatRef}
          className="mt-16 animate-float-1 opacity-0"
        >
          <div className="w-[320px] md:w-[360px] h-[500px] md:h-[520px] bg-navy-dark rounded-[40px] border border-white/10 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)] relative">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-navy rounded-b-[20px] z-10" />

            {/* Chat Header */}
            <div className="h-[60px] bg-navy-dark border-b border-white/5 flex items-center px-5 gap-3 mt-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber to-cyan flex items-center justify-center">
                <span className="text-xs font-bold text-navy">A</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Astra</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[10px] text-gray-muted">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 flex flex-col gap-3 overflow-hidden" style={{ height: 'calc(100% - 132px)' }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] ${
                    msg.sender === 'user' ? 'self-end' : 'self-start'
                  }`}
                >
                  <div
                    className={`px-4 py-3 text-sm ${
                      msg.sender === 'user'
                        ? 'chat-bubble-user text-white'
                        : 'chat-bubble-ai text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* Typing Indicator */}
              <div className="self-start chat-bubble-ai px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-typing-dot" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-typing-dot" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-navy-dark border-t border-white/5 flex items-center px-4 gap-3">
              <Paperclip size={18} className="text-gray-muted flex-shrink-0" />
              <div className="flex-1 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                <span className="text-sm text-gray-muted">Type a message...</span>
              </div>
              <Mic size={18} className="text-gray-muted flex-shrink-0" />
              <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center flex-shrink-0">
                <Send size={14} className="text-navy" />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logos */}
        <div
          ref={logosRef}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {brandLogos.map((logo) => (
            <span
              key={logo}
              className="text-sm font-semibold text-gray-muted opacity-0"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
