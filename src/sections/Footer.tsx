import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Twitter, Github, Linkedin, MessageCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const linkColumns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'API', 'Integrations'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Press'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Help Center', 'Community', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security', 'Cookies'],
  },
];

const socialIcons = [
  { icon: Twitter, href: '#' },
  { icon: Github, href: '#' },
  { icon: MessageCircle, href: '#' },
  { icon: Linkedin, href: '#' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-navy-deep border-t border-white/5 opacity-0"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16 md:py-20">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-16">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-3 mb-3">
              <img 
                src="/app-logo.png" 
                alt="Astra" 
                className="w-6 h-6" 
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
                loading="lazy"
              />
              <span className="text-white font-semibold text-base">Astra</span>
            </a>
            <p className="text-sm text-gray-muted">
              AI-powered conversations that matter
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-sm font-medium text-white mb-3">Stay updated</p>
            {subscribed ? (
              <p className="text-sm text-green-400">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-48 md:w-60 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-gray-muted focus:outline-none focus:border-amber transition-colors"
                />
                <button
                  type="submit"
                  className="bg-amber text-navy px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-amber-light transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {linkColumns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-muted hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5">
          <p className="text-xs text-gray-muted">
            2026 Astra. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialIcons.map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="text-gray-muted hover:text-white hover:scale-110 transition-all duration-200"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
