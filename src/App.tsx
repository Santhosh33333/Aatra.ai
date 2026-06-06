import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';

// Lazy load ALL page components to prevent router context evaluation issues
const HomePage = lazy(() => import('./pages/HomePage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminGateways = lazy(() => import('./pages/admin-gateways'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return (
    <div className="min-h-screen bg-[#080c18] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
    </div>
  );
  return isSignedIn ? <>{children}</> : <Navigate to="/sign-in" replace />;
}

const fallback = <div className="min-h-screen bg-[#080c18]" />;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={fallback}>
          <HomePage />
        </Suspense>
      } />
        <Route path="/sign-in" element={
        <Suspense fallback={fallback}>
          <SignInPage />
        </Suspense>
      } />
      <Route path="/sign-up" element={
        <Suspense fallback={fallback}>
          <SignUpPage />
        </Suspense>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Suspense fallback={fallback}>
            <Dashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <Suspense fallback={fallback}>
          <AdminPanel />
        </Suspense>
      } />
      <Route path="/admin-gateways" element={
        <Suspense fallback={fallback}>
          <AdminGateways />
        </Suspense>
      } />
      <Route path="/checkout" element={
        <Suspense fallback={fallback}>
          <Checkout />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={fallback}>
          <Contact />
        </Suspense>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
