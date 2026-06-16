import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Sparkles, Crown } from 'lucide-react';
import { loadSettings, getUsageToday, incrementUsage } from '../lib/adminStore';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; }
const uid = () => Math.random().toString(36).slice(2, 9);

export default function ChatWidget() {
  const settings = loadSettings();
  const limit = settings.dailyFreeLimit || 30;

  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(getUsageToday());
  const [messages, setMessages] = useState<Message[]>([{
    id: 'welcome', role: 'assistant', timestamp: new Date(),
    content: `Hi! I'm ${settings.siteName || 'Aatra AI'} — powered by Google Gemini, completely free. Ask me anything! ✨`,
  }]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const limitReached = usage >= limit;

  useEffect(() => { setTimeout(() => setVisible(true), 1200); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 250); }, [isOpen]);

  const callGemini = useCallback(async (msg: string, hist: Message[]): Promise<string> => {
    const key = settings.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!key) return '⚠️ No Gemini API key. Add VITE_GEMINI_API_KEY to .env.local — free at aistudio.google.com';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const history = hist.filter(m => m.id !== 'welcome').map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: `You are ${settings.siteName || 'Aatra AI'}, a helpful AI assistant powered by Google Gemini. Be concise, accurate, and friendly.` }] },
          contents: [...history, { role: 'user', parts: [{ text: msg }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
        }),
      });
      if (!res.ok) {
        if (res.status === 400) return '⚠️ Invalid API key. Get a free one at aistudio.google.com';
        if (res.status === 429) return '⚠️ Rate limit reached. Please wait a moment.';
        return '⚠️ Something went wrong. Please try again.';
      }
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    } catch {
      return "I'm having trouble connecting. Please try again in a moment.";
    }
  }, [settings.geminiApiKey, settings.siteName]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    if (limitReached) {
      setMessages(p => [...p, { id: uid(), role: 'assistant', timestamp: new Date(), content: settings.upgradeMessage || 'Daily limit reached! Contact us to upgrade.' }]);
      return;
    }

    const userMsg: Message = { id: uid(), role: 'user', content: msg, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setLoading(true);
    const newCount = incrementUsage();
    setUsage(newCount);

    const reply = await callGemini(msg, [...messages, userMsg]);
    setMessages(p => [...p, { id: uid(), role: 'assistant', content: reply, timestamp: new Date() }]);
    setLoading(false);
  };

  const pct = Math.min((usage / limit) * 100, 100);
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {isOpen && (
        <div className="fixed z-[999] flex flex-col overflow-hidden"
          style={{
            bottom: 80, right: 20, width: 380, height: 580,
            borderRadius: 24, background: 'linear-gradient(145deg,#0f0a1e,#0d1a12)',
            border: '1px solid rgba(124,58,237,0.25)',
            boxShadow: '0 24px 80px rgba(124,58,237,0.22)',
            animation: 'chatOpen 260ms cubic-bezier(0.16,1,0.3,1) forwards',
          }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(124,58,237,0.15)', background: 'rgba(124,58,237,0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                <Sparkles size={15} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{settings.siteName || 'Aatra AI'}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini Flash · {limit - usage} left
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Usage bar */}
          <div className="px-4 pt-2 pb-1 flex-shrink-0">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-gray-600">Free usage today</span>
              <span className="text-[10px] text-gray-600">{usage}/{limit}</span>
            </div>
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pct >= 80 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#7c3aed,#10b981)' }} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm text-white leading-relaxed`}
                  style={m.role === 'user'
                    ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }
                    : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.18)' }}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <p className={`text-[10px] mt-1 ${m.role === 'user' ? 'text-violet-200/50 text-right' : 'text-gray-600'}`}>{fmt(m.timestamp)}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl flex gap-1.5"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.18)' }}>
                  {[0, 0.15, 0.3].map((d, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-violet-400/60"
                      style={{ animation: `bounce 1.4s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            {limitReached && !loading && (
              <div className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
                <Crown size={18} className="text-violet-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white mb-1">Daily limit reached</p>
                <a href={`mailto:${settings.contactEmail}?subject=Upgrade`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white mt-1"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                  Upgrade Now ✉️
                </a>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(124,58,237,0.15)', background: 'rgba(0,0,0,0.15)' }}>
            <div className="flex items-center gap-2">
              <input ref={inputRef} type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                placeholder={limitReached ? 'Limit reached — upgrade' : 'Ask Aatra anything...'}
                disabled={loading || limitReached}
                className="flex-1 min-w-0 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.18)' }} />
              <button onClick={send} disabled={!input.trim() || loading || limitReached}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-[1000] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
        style={{
          right: 20, bottom: 20,
          background: isOpen ? '#0f0a1e' : 'linear-gradient(135deg,#7c3aed,#10b981)',
          border: isOpen ? '1px solid rgba(124,58,237,0.3)' : 'none',
          boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
        }}>
        {isOpen ? <X size={22} className="text-white" /> : <Sparkles size={22} className="text-white" />}
      </button>

      <style>{`
        @keyframes chatOpen { from{opacity:0;transform:scale(0.88) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes bounce { 0%,60%,100%{opacity:.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-4px)} }
      `}</style>
    </>
  );
}
