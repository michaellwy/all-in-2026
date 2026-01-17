import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { categories } from '@/data/categories';
import { CategorySection } from './CategorySection';
import { FloatingTOC } from './FloatingTOC';
import { hosts, hostOrder, hostAvatars } from '@/data/hosts';
import type { HostId } from '@/types';

export function Article() {
  const heroRef = useRef<HTMLHeadingElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const avatarsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    // Hero title stagger animation - more dramatic entrance
    if (heroRef.current) {
      const lines = heroRef.current.querySelectorAll('.hero-line');
      animate(lines, {
        translateY: [100, 0],
        translateX: [-20, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        rotateX: [45, 0],
        duration: 1200,
        ease: 'outExpo',
        delay: stagger(200),
      });
    }

    // Host avatar bounce animation - starts after hero title
    if (avatarsRef.current) {
      const avatars = avatarsRef.current.querySelectorAll('.host-avatar');
      animate(avatars, {
        scale: [0.8, 1.05, 1],
        translateY: [15, -3, 0],
        opacity: [0, 1, 1],
        duration: 600,
        ease: 'outBack',
        delay: stagger(100, { start: 800 }),
      });
    }

    // Category pills stagger animation - starts after avatars
    if (navRef.current) {
      const pills = navRef.current.querySelectorAll('.category-pill');
      animate(pills, {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        ease: 'outBack',
        delay: stagger(50, { start: 1400 }),
      });
    }
  }, []);

  return (
    <article className="min-h-screen bg-[var(--color-bg)]">
      <FloatingTOC />

      {/* Fun header bar */}
      <div className="zigzag-border" />

      {/* Hero Section */}
      <header className="px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Sticker label + credit */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="sticker">January 2026</span>
            <a
              href="https://x.com/michael_lwy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
            >
              by @michael_lwy
            </a>
          </div>

          {/* Big bold title */}
          <h1 ref={heroRef} className="heading-hero mb-6 overflow-hidden">
            <span className="hero-line block opacity-0">All-In</span>
            <span className="hero-line block text-[var(--color-accent)] opacity-0">2026</span>
            <span className="hero-line block opacity-0">Predictions</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-[var(--color-text-secondary)] max-w-xl mb-10 leading-relaxed">
            Four besties. <span className="squiggle">36 calls</span>. One year to prove who's right.
          </p>

          {/* Host avatars row */}
          <div ref={avatarsRef} className="flex flex-wrap items-end gap-4 sm:gap-6">
            {hostOrder.map((hostId, index) => (
              <HostAvatar
                key={hostId}
                hostId={hostId}
                rotation={index % 2 === 0 ? 'rotate-2' : '-rotate-2'}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="card p-6 sm:p-8 -rotate-1">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <p className="text-lg sm:text-xl leading-relaxed flex-1">
              Every year, the <strong>All-In Podcast</strong> hosts make their predictions.
              This is a <span className="squiggle">scoreboard</span> tracking how those bets
              are holding up against reality—with real-time data where we can find it.
            </p>
            <a
              href="https://www.youtube.com/watch?v=yEb2DX0TzKM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 group"
            >
              <div className="w-40 aspect-video rounded-lg overflow-hidden border-2 border-[var(--color-border)] group-hover:border-[var(--color-accent)] transition-colors relative">
                <img
                  src="https://img.youtube.com/vi/yEb2DX0TzKM/mqdefault.jpg"
                  alt="Watch the episode"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center mt-1 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)]">
                Watch episode →
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <nav className="bg-[var(--color-bg-alt)] border-y-2 border-[var(--color-border-bold)] py-6">
        <div ref={navRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="category-pill inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-[var(--color-text)] rounded-full text-sm font-semibold hover:bg-[var(--color-text)] hover:text-white transition-colors opacity-0"
              >
                <span className="text-[var(--color-text-muted)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="hidden sm:inline">{category.title}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Category sections */}
        <div className="space-y-16 sm:space-y-24">
          {categories.map((category, index) => (
            <CategorySection
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--color-text)] text-white">
        <div className="zigzag-border rotate-180" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="font-display text-xl mb-2">The Scoreboard</h3>
              <p className="text-sm opacity-70">
                Data updates automatically. Stock/ETF via Yahoo Finance.
                <br />
                Economic data via FRED. Predictions via Polymarket.
              </p>
            </div>
            <div className="flex -space-x-3">
              {hostOrder.map((hostId) => (
                <div
                  key={hostId}
                  className="w-12 h-12 rounded-full border-3 border-white overflow-hidden bg-white"
                  style={{ borderColor: hosts[hostId].color }}
                >
                  <img
                    src={hostAvatars[hostId]}
                    alt={hosts[hostId].name}
                    className="w-full h-full object-cover scale-150"
                    style={{ objectPosition: 'center 25%' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm opacity-60">
            Built with fun. Not affiliated with the All-In Podcast.
          </div>
        </div>
      </footer>
    </article>
  );
}

const hostCatchphrases: Record<HostId, string> = {
  friedberg: "We are in a fiscal crisis",
  chamath: "[Laughing] Groq.. Groq.. Groqqq",
  sacks: "Let's be clear...",
  jason: "Disgraziad!",
};

function HostAvatar({
  hostId,
  rotation,
}: {
  hostId: HostId;
  rotation: string;
}) {
  const host = hosts[hostId];
  const catchphrase = hostCatchphrases[hostId];

  return (
    <div className={`host-avatar flex flex-col items-center gap-2 ${rotation} group relative`} style={{ opacity: 0 }}>
      {/* Speech bubble tooltip */}
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10 group-hover:-translate-y-1"
      >
        <div
          className="relative bg-white px-3 py-2 rounded-xl shadow-lg border-2 whitespace-nowrap text-sm font-medium"
          style={{ borderColor: host.color, color: host.color }}
        >
          "{catchphrase}"
          {/* Speech bubble tail */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: `8px solid ${host.color}`,
            }}
          />
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid white',
            }}
          />
        </div>
      </div>
      <div
        className="avatar-blob-lg cursor-pointer transition-transform group-hover:scale-110 overflow-hidden"
        style={{ borderColor: host.color }}
      >
        <img
          src={hostAvatars[hostId]}
          alt={host.name}
          className="w-full h-full object-cover scale-150"
          style={{ objectPosition: 'center 25%' }}
        />
      </div>
      <span
        className="font-semibold text-sm px-2 py-0.5 rounded-full"
        style={{ backgroundColor: host.color, color: 'white' }}
      >
        {host.name}
      </span>
    </div>
  );
}
