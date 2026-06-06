import { useEffect, useRef, lazy, Suspense } from 'react';
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
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(subheadlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2)
        .fromTo(buttonsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, 0.4);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-navy pt-24"
    >
      {/* Simplified Background - removed animated orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #ffb340, transparent)' }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #00c8ff, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">
        {/* Headline Section */}
        <div className="mb-12">
          <div className="text-xs font-medium text-amber-400 uppercase tracking-[3px] mb-4">
            AI CHAT
          </div>
          <h1
            ref={headlineRef}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4 leading-tight"
          >
            It&apos;s not just chat, it&apos;s a{' '}
            <span className="bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
              connection
            </span>
          </h1>
          <p
            ref={subheadlineRef}
            className="text-lg md:text-xl text-gray-400 max-w-2xl"
          >
            Experience conversations that understand you
          </p>
        </div>

        {/* CTA Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 mb-16">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 text-navy font-semibold hover:opacity-90 transition-opacity">
            Start Chatting
          </button>
          <button className="px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors font-semibold">
            Learn More
          </button>
        </div>

        {/* Chat Preview - Lazy loaded */}
        <Suspense fallback={<div className="h-80 bg-white/5 rounded-2xl" />}>
          <ChatPreview />
        </Suspense>
      </div>
    </section>
  );
}

function ChatPreview() {
  const chatMessages = [
    { sender: 'user', text: 'Hey, how are you feeling today?' },
    { sender: 'ai', text: "I'm doing great! Ready to chat whenever you are." },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-lg">
      <div className="space-y-4">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-amber-500/30 text-white' : 'bg-white/10 text-gray-300'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
        <input type="text" placeholder="Type a message..." className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 border border-white/10" />
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <Send size={20} className="text-amber-400" />
        </button>
      </div>
    </div>
  );
}

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
