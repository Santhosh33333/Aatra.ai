import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Paperclip, Crown, Sparkles } from 'lucide-react';
import { loadSettings, getUsageToday, incrementUsage } from '../lib/adminStore';

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
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome',
    role: 'assistant',
    content: `Hi! I'm ${settings.siteName || 'Aatra AI'} — powered by Google Gemini, completely free. Ask me anything! ✨`,
    timestamp: new Date(),
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usage, setUsage] = useState(getUsageToday());
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limit = settings.dailyFreeLimit || 30;

  const limitReached = usage >= limit;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const t = setTimeout(() => setShowWidget(true), 1500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGeminiKey = useCallback(() => {
    return settings.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
  }, [settings.geminiApiKey]);

  const callGemini = useCallback(async (userMessage: string, history: Message[]): Promise<string> => {
    const apiKey = getGeminiKey();
    if (!apiKey) return "⚠️ No Gemini API key configured. Add VITE_GEMINI_API_KEY to .env.local — it's free at aistudio.google.com";

    const model = 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contextHistory = history
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: `You are ${settings.siteName || 'Aatra AI'}, a friendly and helpful AI assistant powered by Google Gemini. Be concise, accurate, and engaging.` }],
          },
          contents: [
            ...contextHistory,
            { role: 'user', parts: [{ text: userMessage }] },
          ],
          generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        if (res.status === 400) return "⚠️ Invalid API key. Get a free key at aistudio.google.com";
        if (res.status === 429) return "⚠️ Rate limit reached. Please wait a moment and try again.";
        throw new Error(err?.error?.message || 'Gemini API error');
      }
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    } catch {
      return "I'm having trouble connecting right now. Please try again in a moment.";
    }
  }, [settings.siteName, getGeminiKey]);

  const handleSend = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    if (limitReached) {
      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant',
        content: settings.upgradeMessage || "Daily limit reached! Contact us to unlock unlimited access.",
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

    const response = await callGemini(message, messages);
    setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: response, timestamp: new Date() }]);
    setIsLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) setInputValue(prev => prev + (prev ? ' ' : '') + `[Attached: ${files.map(f => f.name).join(', ')}]`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setInputValue(prev => prev + (prev ? ' ' : '') + `[Attached: ${files.map(f => f.name).join(', ')}]`);
  };

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const usagePercent = Math.min((usage / limit) * 100, 100);

  return (
    <>
      {isOpen && (
        <div
          className={`fixed z-[999] flex flex-col overflow-hidden ${
            isMobile ? 'inset-0 rounded-none' : 'bottom-[88px] right-5 w-[390px] h-[580px] rounded-3xl'
          }`}
          style={{
            background: 'linear-gradient(145deg,#0f0a1e,#0d1a12)',
            border: '1px solid rgba(124,58,237,0.25)',
            boxShadow: '0 24px 80px rgba(124,58,237,0.2)',
            animation: 'chatOpen 280ms cubic-bezier(0.16,1,0.3,1) forwards',
          }}
          onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
        >
          {isDraggingOver && (
            <div className="absolute inset-0 z-50 bg-violet-400/10 border-2 border-violet-400/50 border-dashed rounded-3xl flex items-center justify-center">
              <p className="text-violet-400 font-semibold text-sm">Drop files here</p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(16,185,129,0.12))', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{settings.siteName || 'Aatra AI'}</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] text-gray-400 truncate">Gemini Flash · {limit - usage} msgs left</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-white transition-colors w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center flex-shrink-0">
              <X size={18} />
            </button>
          </div>

          {/* Usage bar */}
          <div className="px-5 py-2 flex-shrink-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-600">Free usage today</span>
              <span className="text-[10px] text-gray-600">{usage}/{limit}</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${usagePercent}%`, background: usagePercent >= 80 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#7c3aed,#10b981)' }} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-violet-700 text-white'
                    : 'text-white'
                }`} style={msg.role === 'assistant' ? { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.2)' } : {}}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-violet-200/60 text-right' : 'text-gray-600'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <div className="flex gap-1.5">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-violet-400/60"
                        style={{ animation: `typingBounce 1.4s ease-in-out ${d}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {limitReached && (
              <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <Crown size={20} className="text-violet-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium mb-1">Daily limit reached</p>
                <p className="text-xs text-gray-400 mb-3">Upgrade for unlimited access</p>
                <a href={`mailto:${settings.contactEmail}?subject=Upgrade Request`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-emerald-500 text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity">
                  Upgrade Now ✉️
                </a>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(124,58,237,0.15)', background: 'rgba(0,0,0,0.2)' }}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
            <div className="flex items-center gap-2 w-full">
              <button onClick={() => fileInputRef.current?.click()} className="text-gray-600 hover:text-gray-400 transition-colors p-1.5 hover:bg-white/5 rounded-lg flex-shrink-0">
                <Paperclip size={16} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={limitReached ? "Limit reached — upgrade" : "Ask Aatra anything..."}
                disabled={isLoading || limitReached}
                className="flex-1 min-w-0 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none transition-colors disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.2)' }}
              />
              <button onClick={handleSend} disabled={!inputValue.trim() || isLoading || limitReached}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 bg-gradient-to-br from-violet-600 to-emerald-500 hover:scale-105 active:scale-95">
                <Send size={14} className="text-white" />
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
        } ${isOpen ? 'border border-violet-500/30' : 'bg-gradient-to-br from-violet-600 to-emerald-500 hover:scale-105 active:scale-95'}`}
        style={{ right: isMobile ? 16 : 20, bottom: isMobile ? 16 : 20, ...(isOpen ? { background: '#0f0a1e' } : {}) }}
      >
        {isOpen ? <X size={22} className="text-white" /> : <Sparkles size={22} className="text-white" />}
      </button>

      <style>{`
        @keyframes chatOpen { from{opacity:0;transform:scale(0.85) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes typingBounce { 0%,60%,100%{opacity:.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-4px)} }
      `}</style>
    </>
  );
}
