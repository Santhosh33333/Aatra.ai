import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Priya S.', role: 'Product Manager', avatar: 'P', text: 'I use Aatra every day for meeting summaries and emails. The free plan is genuinely useful — not crippled like other tools.', stars: 5 },
  { name: 'Rahul M.', role: 'Software Engineer', avatar: 'R', text: 'The Gemini Flash integration is blazing fast. I debug code snippets here faster than opening docs. Highly recommend.', stars: 5 },
  { name: 'Ananya K.', role: 'Content Creator', avatar: 'A', text: 'No sign-up friction, no paywalls hitting you every 5 messages. Just works. I love how clean and simple it is.', stars: 5 },
  { name: 'Dev T.', role: 'Startup Founder', avatar: 'D', text: 'Using Aatra for brainstorming product ideas. The context memory is excellent — feels like talking to a smart colleague.', stars: 5 },
  { name: 'Sneha R.', role: 'Student', avatar: 'S', text: 'As a student with no budget, 30 free messages per day is perfect. It helps me understand complex topics instantly.', stars: 5 },
  { name: 'Karthik B.', role: 'Freelance Designer', avatar: 'K', text: 'I draft client proposals and creative briefs with Aatra. The quality of writing assistance is on par with premium tools.', stars: 5 },
];

export default function Proof() {
  return (
    <section className="w-full py-24" style={{ background: 'linear-gradient(180deg,#0a0f08,#08060f)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
            What users say
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Loved by thousands
          </h2>
          <p className="text-gray-400 text-lg">Real feedback from real users across India and beyond.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="p-5 rounded-2xl flex flex-col gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex gap-0.5">
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-600">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 p-6 rounded-2xl text-center"
          style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)' }}>
          <p className="text-2xl font-bold text-white mb-1">500,000+ users trust Aatra AI</p>
          <p className="text-sm text-gray-500">Join the community — it's completely free to start.</p>
        </div>
      </div>
    </section>
  );
}
