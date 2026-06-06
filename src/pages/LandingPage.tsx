import { Navigation } from '../sections/Navigation';
import { Hero } from '../sections/Hero';
import { Features } from '../sections/Features';
import { ChatWidget } from '../sections/ChatWidget';
import { Footer } from '../sections/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <Features />
      <ChatWidget />
      <Footer />
    </div>
  );
}
