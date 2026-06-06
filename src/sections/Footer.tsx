import { Link } from 'react-router';
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

const cols = [
  { title: 'Product', links: [{ l: 'Features', h: '/#features' }, { l: 'Pricing', h: '/#pricing' }, { l: 'Dashboard', h: '/dashboard' }] },
  { title: 'Company', links: [{ l: 'About', h: '/contact' }, { l: 'Blog', h: '/contact' }, { l: 'Careers', h: '/contact' }] },
  { title: 'Support', links: [{ l: 'Contact', h: '/contact' }, { l: 'Help Center', h: '/contact' }, { l: 'Privacy', h: '/contact' }] },
];

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-8" style={{ background: '#06040c', borderTop: '1px solid rgba(124,58,237,0.12)' }}>
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="font-bold text-white">Aatra AI</span>
            </Link>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">Free AI chat powered by Google Gemini. No credit card, no tricks.</p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(({ l, h }) => (
                  <li key={l}>
                    <Link to={h} className="text-sm text-gray-600 hover:text-gray-300 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-gray-700">© 2026 Aatra AI. All rights reserved.</p>
          <p className="text-xs text-gray-700">Powered by <span className="text-emerald-700">Google Gemini</span></p>
        </div>
      </div>
    </footer>
  );
}
