import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Paperclip, Image, Smile, Crown } from 'lucide-react';
import { loadSettings } from '../lib/adminStore';
import { getUsageToday, incrementUsage } from '../lib/adminStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function ChatWidget() {
  const settings = loadSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi there! I'm ${settings.siteName || 'Astra'}, your AI assistant. How can I help you today? 🌟`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [usage, setUsage] = useState(getUsageToday());
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limit = settings.dailyFreeLimit || 20;

  useEffect(() => {
    const timer = setTimeout(() => setShowWidget(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  useEffect(() => {
    setLimitReached(usage >= limit);
  }, [usage, limit]);

  const getApiKey = () => {
    // Priority: admin-saved key → env variable → empty
    return settings.apiKey || import.meta.env.VITE_OPENAI_API_KEY || '';
  };

  const callOpenAI = useCallback(async (userMessage: string) => {
    const apiKey = getApiKey();
    if (!apiKey) return "⚠️ No API key configured. Please contact the admin.";

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are ${settings.siteName || 'Astra'}, a friendly and helpful AI assistant. Provide concise, accurate, engaging responses. Keep responses relatively brief.`
            },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      return data.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    } catch {
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }, [settings]);

  const handleSend = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    if (limitReached) {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: settings.upgradeMessage || "You've reached your daily limit! Contact us to unlock more.",
        timestamp: new Date(),
      }]);
      return;
    }

    const userMsg: Message = { id: generateId(), role: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const newCount = incrementUsage();
    setUsage(newCount);

    const response = await callOpenAI(message);
    setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: response, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const names = files.map(f => f.name).join(', ');
      setInputValue(prev => prev + (prev ? ' ' : '') + `[Attached: ${names}]`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const names = files.map(f => f.name).join(', ');
      setInputValue(prev => prev + (prev ? ' ' : '') + `[Attached: ${names}]`);
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const usagePercent = Math.min((usage / limit) * 100, 100);

  const isMobile = window.innerWidth < 768;

  return (
    <>
      {isOpen && (
        <div
          className={`fixed z-[999] flex flex-col overflow-hidden ${
            isMobile ? 'inset-0 rounded-none' : 'bottom-[88px] right-5 w-[390px] h-[560px] rounded-3xl'
          }`}
          style={{
            background: 'linear-gradient(145deg, #0d1117, #11161f)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            animation: 'chatOpen 280ms cubic-bezier(0.16,1,0.3,1) forwards',
          }}
          onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDraggingOver && (
            <div className="absolute inset-0 z-50 bg-amber-400/10 border-2 border-amber-400/50 border-dashed rounded-3xl flex items-center justify-center">
              <p className="text-amber-400 font-semibold text-sm">Drop files here</p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(255,179,64,0.12),rgba(0,200,255,0.12))', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-[#080c18]">A</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{settings.siteName || 'Astra AI'}</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-gray-500">Online · {limit - usage} msgs left today</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-white transition-colors w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center">
              <X size={18} />
            </button>
          </div>

          {/* Usage bar */}
          <div className="px-5 py-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-600">Daily Usage</span>
              <span className="text-[10px] text-gray-600">{usage}/{limit}</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${usagePercent}%`,
                  background: usagePercent >= 80 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#ffb340,#00c8ff)'
                }}
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-amber-400/80 to-amber-500/80 text-[#080c18]'
                      : 'bg-white/8 border border-white/8 text-white'
                  }`}
                  style={msg.role === 'assistant' ? { background: 'rgba(255,255,255,0.06)' } : {}}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-amber-900/60 text-right' : 'text-gray-600'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex gap-1.5">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-white/40"
                        style={{ animation: `typingBounce 1.4s ease-in-out ${d}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {limitReached && (
              <div className="bg-gradient-to-r from-amber-400/10 to-cyan-400/10 border border-amber-400/20 rounded-2xl p-4 text-center">
                <Crown size={20} className="text-amber-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium mb-1">Daily limit reached</p>
                <p className="text-xs text-gray-500 mb-3">Contact us to unlock unlimited access & premium models</p>
                <a
                  href={`mailto:${settings.contactEmail || 'admin@astra.ai'}?subject=Upgrade Request`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Contact to Upgrade ✉️
                </a>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
            <div className="flex items-center gap-2">
              <button onClick={() => fileInputRef.current?.click()} className="text-gray-600 hover:text-gray-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg">
                <Paperclip size={16} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={limitReached ? "Limit reached — contact to upgrade" : "Message Astra..."}
                disabled={isLoading || limitReached}
                className="flex-1 bg-white/5 border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-400/50 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading || limitReached}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br from-amber-400 to-cyan-400 hover:scale-105 active:scale-95"
              >
                <Send size={14} className="text-[#080c18]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-[1000] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
          showWidget ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        } ${isOpen ? 'bg-[#1a1f2e] border border-white/10' : 'bg-gradient-to-br from-amber-400 to-cyan-400 hover:scale-105 active:scale-95'}`}
        style={{ right: isMobile ? 16 : 20, bottom: isMobile ? 16 : 20 }}
      >
        {isOpen ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-[#080c18]" />}
      </button>

      <style>{`
        @keyframes chatOpen { from { opacity:0; transform:scale(0.85) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes typingBounce { 0%,60%,100% { opacity:.3; transform:translateY(0); } 30% { opacity:1; transform:translateY(-4px); } }
      `}</style>
    </>
  );
}
