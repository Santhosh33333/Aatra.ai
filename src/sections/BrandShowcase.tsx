export default function BrandShowcase() {
  const stats = [
    { value: '10M+', label: 'Messages Sent' },
    { value: '500K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '< 1s', label: 'Response Time' },
  ];

  const logos = ['Google', 'Gemini', 'Vercel', 'Clerk', 'React', 'TypeScript'];

  return (
    <section className="relative w-full py-16 overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#0a0612,#080f0a)' }}>
      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <div className="text-3xl font-bold text-white mb-1"
                style={{ background: 'linear-gradient(90deg,#a78bfa,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted by */}
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-6">Built with & powered by</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {logos.map((name) => (
            <div key={name}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500 transition-colors hover:text-gray-300"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
