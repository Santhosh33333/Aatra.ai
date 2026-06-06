import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { logger } from '../lib/logger';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    logger.debug('[Navigation] Mounted');
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      style={{
        height: 72,
        ...(scrolled ? {
          background: 'rgba(10,6,18,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(124,58,237,0.15)',
        } : {}),
      }}>
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6 lg:px-12">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex-shrink-0">
            <div className="absolute inset-0 rounded-xl opacity-20 blur-sm group-hover:opacity-40 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }} />
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
              <Sparkles size={17} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>Aatra</span>
            <span className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ background: 'linear-gradient(90deg,#7c3aed,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <a key={l.label} href={l.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <Link to="/dashboard"
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {user?.imageUrl && (
                <img src={user.imageUrl} alt="Profile" className="w-5 h-5 rounded-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='10' cy='10' r='10' fill='%237c3aed'/%3E%3C/svg%3E`; }} />
              )}
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/sign-in"
                className="text-sm font-medium text-gray-400 hover:text-white px-4 py-2 rounded-xl transition-colors">
                Sign In
              </Link>
              <Link to="/sign-up"
                className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90 hover:scale-105"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-3"
          style={{ background: 'rgba(10,6,18,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(124,58,237,0.15)' }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href}
              className="text-sm font-medium text-gray-400 hover:text-white py-2 transition-colors"
              onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {isSignedIn ? (
              <Link to="/dashboard" className="text-center py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/sign-in" className="text-center py-2.5 rounded-xl text-sm text-gray-300"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}>Sign In</Link>
                <Link to="/sign-up" className="text-center py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
