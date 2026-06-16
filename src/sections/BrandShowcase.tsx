const stats = [
  { value: '500K+', label: 'Active Users' },
  { value: '10M+', label: 'Messages Sent' },
  { value: '99.9%', label: 'Uptime' },
  { value: '< 1s', label: 'Avg Response' },
];

const powered = ['Google Gemini', 'Clerk Auth', 'Vercel', 'React', 'TypeScript'];

export default function BrandShowcase() {
  return (
    <section className="w-full py-14 border-y"
      style={{ background: '#080c15', borderColor: 'rgba(124,58,237,0.12)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="text-center py-4 px-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,58,237,0.12)' }}>
              <div className="text-3xl font-bold mb-0.5"
                style={{ background: 'linear-gradient(90deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Powered by */}
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-widest text-gray-600 mb-4">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {powered.map(name => (
              <span key={name}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
