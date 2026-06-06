import { useEffect, useRef, memo, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { logger } from '../lib/logger';

gsap.registerPlugin(ScrollTrigger);

const chatMessages = [
  { sender: 'ai', text: "Hello! I'm Astra, your AI companion." },
  { sender: 'user', text: 'Can you help me brainstorm?' },
  { sender: 'ai', text: "Of course! What topic would you like?" },
];

function ShowOff() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [showLogs, setShowLogs] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Log when ShowOff section loads
    logger.info('[ShowOff] Component mounted - Astra showcase loading');
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [ShowOff] Component mounted`]);
    
    const ctx = gsap.context(() => {
      logger.debug('[ShowOff] Animating phone element');
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
            onEnter: () => {
              logger.info('[ShowOff] Phone animation triggered');
              setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [ShowOff] Animation triggered`]);
            }
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const fullLog = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-9), fullLog]); // Keep last 10 logs
  };

  useEffect(() => {
    logger.success('[ShowOff] Chat messages loaded');
    addLog('[ShowOff] Chat interface rendered');
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-gradient-to-b from-navy to-navy-deep overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #00c8ff, transparent)' }} />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Phone Mock */}
          <div ref={phoneRef} className="relative opacity-0 flex justify-center">
            <div className="w-[260px] h-[480px] bg-navy-dark rounded-[40px] border border-white/10 overflow-hidden shadow-lg">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-6 bg-navy rounded-b-[16px] z-10" />
              <div className="h-[48px] bg-navy-dark border-b border-white/5 flex items-center px-4 gap-2 mt-1">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber to-cyan" />
                <div>
                  <div className="text-xs font-semibold text-white">Astra</div>
                  <div className="text-[9px] text-green-400">Online</div>
                </div>
              </div>
              <div className="p-3 space-y-2 overflow-y-auto" style={{ height: 'calc(100% - 102px)' }}>
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

          {/* Right: Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Smart Conversations</h3>
              <p className="text-gray-400 mb-4">AI that understands context and emotions in real-time</p>
              <div className="space-y-3">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">10M+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Response Time</div>
                <div className="text-xl font-bold text-green-400">45ms</div>
                <div className="text-xs text-gray-500">Optimal</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                <div className="text-xl font-bold text-cyan-400">99.8%</div>
                <div className="text-xs text-gray-500">Excellent</div>
              </div>
            </div>

            {/* Log Viewer Toggle */}
            <button
              onClick={() => {
                setShowLogs(!showLogs);
                logger.info(`[ShowOff] Log viewer ${!showLogs ? 'opened' : 'closed'}`);
                addLog(`[ShowOff] Log viewer toggled`);
              }}
              className="w-full px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg border border-amber-500/30 text-sm font-medium transition-colors"
            >
              {showLogs ? '▼ Hide Logs' : '▶ Show Logs'} ({logs.length})
            </button>

            {/* Log Viewer */}
            {showLogs && (
              <div className="p-4 bg-black/40 border border-white/10 rounded-lg max-h-48 overflow-y-auto font-mono text-xs space-y-1">
                <div className="text-gray-500 mb-2">Activity Logs:</div>
                {logs.length === 0 ? (
                  <div className="text-gray-600">Waiting for activity...</div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="text-gray-400 hover:text-green-400 transition-colors">
                      {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(ShowOff);
