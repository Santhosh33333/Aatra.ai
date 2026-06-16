import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(8,6,15,0.9)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(124,58,237,0.2)',
      } : {}}
    >
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">Aatra <span className="font-normal opacity-60">AI</span></span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {[['Features', '#features'], ['Pricing', '#pricing'], ['Contact', '/contact']].map(([label, href]) => (
            <a key={label} href={href}
              className="text-sm text-gray-400 hover:text-white transition-colors">{label}</a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isSignedIn ? (
            <Link to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {user?.imageUrl && <img src={user.imageUrl} alt="" className="w-5 h-5 rounded-full" />}
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/sign-in" className="text-sm text-gray-400 hover:text-white px-4 py-2 rounded-xl transition-colors">Sign In</Link>
              <Link to="/sign-up"
                className="text-sm font-semibold px-4 py-2 rounded-xl text-white hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-5 py-4 flex flex-col gap-3"
          style={{ background: 'rgba(8,6,15,0.98)', borderTop: '1px solid rgba(124,58,237,0.15)' }}>
          {[['Features', '#features'], ['Pricing', '#pricing'], ['Contact', '/contact']].map(([label, href]) => (
            <a key={label} href={href} className="text-sm text-gray-300 py-2"
              onClick={() => setMobileOpen(false)}>{label}</a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-white/10">
            {isSignedIn ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>Dashboard</Link>
            ) : (
              <>
                <Link to="/sign-in" onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 rounded-xl text-sm text-gray-300 border border-white/10">Sign In</Link>
                <Link to="/sign-up" onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
