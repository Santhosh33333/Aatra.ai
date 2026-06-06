import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Mic, Palette, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Brain,
    iconBg: 'rgba(0,200,255,0.15)',
    iconColor: '#00c8ff',
    title: 'Smart Replies',
    description: 'AI-powered suggestions that understand context and tone',
  },
  {
    icon: Mic,
    iconBg: 'rgba(255,179,64,0.15)',
    iconColor: '#ffb340',
    title: 'Voice Messages',
    description: 'Send and receive voice messages with crystal-clear quality',
  },
  {
    icon: Palette,
    iconBg: 'rgba(0,200,255,0.15)',
    iconColor: '#00c8ff',
    title: 'Custom Themes',
    description: 'Personalize your chat experience with beautiful themes',
  },
  {
    icon: Users,
    iconBg: 'rgba(255,179,64,0.15)',
    iconColor: '#ffb340',
    title: 'Group Chats',
    description: 'Create groups and stay connected with multiple friends',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current?.children || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
          },
        }
      );

      // Horizontal scroll animation
      const track = trackRef.current;
      if (!track) return;

      const cards = track.querySelectorAll('.feature-card');
      const totalWidth = track.scrollWidth - window.innerWidth + 100;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Card entrance animations
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0.5, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'left 90%',
              containerAnimation: gsap.getById?.('horizontal'),
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative w-full bg-gradient-to-b from-navy-deep to-navy overflow-hidden"
    >
        <div ref={headerRef} className="text-center pt-20 md:pt-32 pb-12 px-6">
        <div className="text-xs font-medium text-gray-muted uppercase tracking-[3px] mb-4">
          FEATURES
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          Everything you need
        </h2>
        <p className="text-lg text-gray-muted">
          Powerful features designed for natural conversation
        </p>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex items-center gap-8 px-12 md:px-24"
          style={{ width: 'max-content' }}
        >
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card w-[300px] md:w-[340px] min-h-[320px] flex flex-col"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105"
                style={{ background: feature.iconBg }}
              >
                <feature.icon size={24} style={{ color: feature.iconColor }} />
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-base text-gray-muted leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative element */}
              <div className="mt-auto pt-6">
                <div
                  className="w-full h-24 rounded-xl opacity-30"
                  style={{
                    background: `linear-gradient(135deg, ${feature.iconBg}, transparent)`,
                  }}
                />
              </div>
            </div>
          ))}

          {/* Spacer for scroll */}
          <div className="w-[100px] flex-shrink-0" />
        </div>
      </div>
    </section>
  );
}
