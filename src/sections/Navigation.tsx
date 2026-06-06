import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-[#080c18]/90 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
      style={{ height: 72 }}
    >
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6 lg:px-12">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          {/* Icon mark */}
          <div className="relative w-9 h-9 flex-shrink-0">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-400 opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300" />
            {/* Main icon bg */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={17} className="text-[#080c18]" strokeWidth={2.5} />
            </div>
          </div>

          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'Sora, Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Astra
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ background: 'linear-gradient(90deg, #ffb340, #00c8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.12em' }}>
              AI
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className="text-gray-400 text-sm font-medium hover:text-white transition-colors duration-200">
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <Link to="/dashboard"
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-all text-sm font-medium text-white">
              {user?.imageUrl && (
                <img src={user.imageUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
              )}
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/sign-in"
                className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                Sign In
              </Link>
              <Link to="/sign-up"
                className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] hover:opacity-90 transition-opacity">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080c18]/98 backdrop-blur-xl border-t border-white/10">
          <div className="px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="text-gray-400 text-sm font-medium hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
              {isSignedIn ? (
                <Link to="/dashboard" className="text-center py-2.5 rounded-xl bg-white/8 border border-white/10 text-sm font-medium text-white">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/sign-in" className="text-center py-2.5 rounded-xl border border-white/10 text-sm text-gray-300">
                    Sign In
                  </Link>
                  <Link to="/sign-up" className="text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] text-sm font-semibold">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
