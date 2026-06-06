import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useAuth } from '@clerk/clerk-react';

console.log('[v0] App component rendering')

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
    <div className="min-h-screen bg-[#080c18] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Astra AI</h1>
        <p className="text-gray-400 mb-8">Welcome to Astra</p>
        <p className="text-sm text-gray-500">[v0] App is loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  console.log('[v0] App component mounted')
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
