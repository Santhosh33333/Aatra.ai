import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Pricing from './sections/Pricing';
import Footer from './sections/Footer';
import ChatWidget from './sections/ChatWidget';
import CursorGlow from './sections/CursorGlow';

// Lazy load heavy animated sections
const ShowOff = lazy(() => import('./sections/ShowOff'));
const Proof = lazy(() => import('./sections/Proof'));
const Features = lazy(() => import('./sections/Features'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

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
      <Navigation />
      <main>
        <Hero />
        <Suspense fallback={<div className="h-96 bg-[#080c18]" />}>
          <ShowOff />
          <Proof />
          <Features />
        </Suspense>
        <Pricing />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
