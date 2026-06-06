import { Link } from 'react-router-dom';

interface NavigationProps {
  isSignedIn?: boolean;
  userEmail?: string;
}

export function Navigation({ isSignedIn = false, userEmail = '' }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/astra-logo.png" 
            alt="Astra AI Logo" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              console.error('[v0] Logo failed to load from /astra-logo.png');
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition">
            Astra AI
          </span>
        </Link>

        {/* Right side - Auth */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <span className="text-sm text-gray-600">{userEmail}</span>
              <Link 
                to="/dashboard" 
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/sign-in" 
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Sign In
              </Link>
              <Link 
                to="/sign-up" 
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
