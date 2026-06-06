import { Check } from 'lucide-react';

const capabilities = [
  'Write emails, reports, essays',
  'Debug and explain code',
  'Brainstorm ideas',
  'Summarise long documents',
  'Answer any question',
  'Translate to 50+ languages',
];

const preview = [
  { r: 'user', t: 'Summarise the key points of quantum computing' },
  { r: 'ai', t: 'Quantum computing uses quantum bits (qubits) that can be in multiple states at once, enabling exponentially faster computation for specific problems like cryptography and drug discovery.' },
  { r: 'user', t: 'Give me a real-world example' },
  { r: 'ai', t: "Google's Sycamore processor solved in 200 seconds what would take the world's fastest supercomputer 10,000 years — demonstrating quantum supremacy." },
];

export default function ShowOff() {
  return (
    <section className="w-full py-24" style={{ background: 'linear-gradient(180deg,#08060f,#0a0f08)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — chat preview */}
          <div className="rounded-3xl overflow-hidden"
            style={{ background: '#0f0a1e', border: '1px solid rgba(124,58,237,0.25)', boxShadow: '0 24px 64px rgba(124,58,237,0.18)' }}>
            <div className="px-5 py-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(124,58,237,0.15)', background: 'rgba(124,58,237,0.07)' }}>
              <div className="flex gap-1.5">
                {['#ef4444','#f59e0b','#10b981'].map(c => (
                  <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">Aatra AI — conversation</span>
            </div>
            <div className="p-5 space-y-3 min-h-[260px]">
              {preview.map((m, i) => (
                <div key={i} className={`flex ${m.r === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm text-white leading-relaxed"
                    style={m.r === 'user'
                      ? { background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }
                      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,58,237,0.18)' }}>
                    {m.t}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 flex items-center gap-2"
              style={{ borderTop: '1px solid rgba(124,58,237,0.15)', background: 'rgba(0,0,0,0.2)' }}>
              <input readOnly placeholder="Ask anything..." className="flex-1 bg-transparent text-sm text-gray-500 focus:outline-none" />
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                <span className="text-white text-xs font-bold">→</span>
              </div>
            </div>
          </div>

          {/* Right — capabilities */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">What can Aatra do?</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ask anything.<br />
              <span style={{ background: 'linear-gradient(90deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Get instant answers.
              </span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              From writing and coding to research and translation — Aatra AI handles it all, powered by Google Gemini 2.0 Flash.
            </p>
            <ul className="space-y-3">
              {capabilities.map((c, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                    <Check size={11} className="text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-300">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
