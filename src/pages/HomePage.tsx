import { lazy, Suspense } from 'react';
import Hero from '../sections/Hero';
import BrandShowcase from '../sections/BrandShowcase';
import Footer from '../sections/Footer';
import ChatWidget from '../sections/ChatWidget';
import CursorGlow from '../sections/CursorGlow';

const Navigation = lazy(() => import('../sections/Navigation'));
const ShowOff = lazy(() => import('../sections/ShowOff'));
const Proof = lazy(() => import('../sections/Proof'));
const Features = lazy(() => import('../sections/Features'));
const Pricing = lazy(() => import('../sections/Pricing'));

export default function HomePage() {
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
