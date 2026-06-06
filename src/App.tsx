import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import Hero from './sections/Hero';
import BrandShowcase from './sections/BrandShowcase';
import Features from './sections/Features';
import ShowOff from './sections/ShowOff';
import Proof from './sections/Proof';
import Footer from './sections/Footer';
import ChatWidget from './sections/ChatWidget';
import CursorGlow from './sections/CursorGlow';

const Navigation = lazy(() => import('./sections/Navigation'));
const Pricing = lazy(() => import('./sections/Pricing'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminGateways = lazy(() => import('./pages/admin-gateways'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));

const Spin = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#08060f' }}>
    <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <Spin />;
  return isSignedIn ? <>{children}</> : <Navigate to="/sign-in" replace />;
}

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: '#08060f' }}>
      <CursorGlow />
      <Suspense fallback={<div className="h-16" />}>
        <Navigation />
      </Suspense>
      <main>
        <Hero />
        <BrandShowcase />
        <Features />
        <ShowOff />
        <Proof />
        <Suspense fallback={<div className="h-96" />}>
          <Pricing />
        </Suspense>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<Suspense fallback={<Spin />}><SignInPage /></Suspense>} />
      <Route path="/sign-up" element={<Suspense fallback={<Spin />}><SignUpPage /></Suspense>} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Suspense fallback={<Spin />}><Dashboard /></Suspense>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={<Suspense fallback={<Spin />}><AdminPanel /></Suspense>} />
      <Route path="/admin-gateways" element={<Suspense fallback={<Spin />}><AdminGateways /></Suspense>} />
      <Route path="/checkout" element={<Suspense fallback={<Spin />}><Checkout /></Suspense>} />
      <Route path="/contact" element={<Suspense fallback={<Spin />}><Contact /></Suspense>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
