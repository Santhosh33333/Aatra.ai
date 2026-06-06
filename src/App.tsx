import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import Hero from './sections/Hero';
import BrandShowcase from './sections/BrandShowcase';
import Footer from './sections/Footer';
import ChatWidget from './sections/ChatWidget';
import CursorGlow from './sections/CursorGlow';
import { logger } from './lib/logger';

// Lazy load all components that use router hooks or Link
const Navigation = lazy(() => import('./sections/Navigation'));
const ShowOff = lazy(() => import('./sections/ShowOff'));
const Proof = lazy(() => import('./sections/Proof'));
const Features = lazy(() => import('./sections/Features'));
const Pricing = lazy(() => import('./sections/Pricing'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminGateways = lazy(() => import('./pages/admin-gateways'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
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

function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#080c18] text-white overflow-x-hidden">
      <CursorGlow />
      <Suspense fallback={<div className="h-16 bg-[#080c18]" />}>
        <Navigation />
      </Suspense>
      <main>
        <Hero />
        <BrandShowcase />
        <Suspense fallback={<div className="h-96 bg-[#080c18]" />}>
          <ShowOff />
          <Proof />
          <Features />
        </Suspense>
        <Suspense fallback={<div className="h-screen bg-[#080c18]" />}>
          <Pricing />
        </Suspense>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    logger.info('[Navigation] App mounted');
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080c18]" />}>
            <SignInPage />
          </Suspense>
        } />
        <Route path="/sign-up" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080c18]" />}>
            <SignUpPage />
          </Suspense>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Suspense fallback={<div className="min-h-screen bg-[#080c18] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" /></div>}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080c18]" />}>
            <AdminPanel />
          </Suspense>
        } />
        <Route path="/admin-gateways" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080c18]" />}>
            <AdminGateways />
          </Suspense>
        } />
        <Route path="/checkout" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080c18]" />}>
            <Checkout />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<div className="min-h-screen bg-[#080c18]" />}>
            <Contact />
          </Suspense>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
