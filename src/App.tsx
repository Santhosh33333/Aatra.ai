import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import ShowOff from './sections/ShowOff';
import Proof from './sections/Proof';
import Features from './sections/Features';
import Pricing from './sections/Pricing';
import Footer from './sections/Footer';
import ChatWidget from './sections/ChatWidget';
import CursorGlow from './sections/CursorGlow';
import AdminPanel from './pages/AdminPanel';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';

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
        <ShowOff />
        <Proof />
        <Features />
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
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
