'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import type { Category } from '@/types';
import { getPredictionsByCategory } from '@/data/predictions';
import { PredictionCard } from './PredictionCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface CategorySectionProps {
  category: Category;
  index: number;
}

export function CategorySection({ category, index }: CategorySectionProps) {
  const predictions = getPredictionsByCategory(category.id);
  const sectionNumber = String(index + 1).padStart(2, '0');
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  const cardsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !isVisible || hasAnimated.current) return;

    hasAnimated.current = true;

    // Animate section container
    if (ref.current) {
      animate(ref.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        ease: 'outCubic',
      });
    }

    // Animate prediction cards with stagger
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.prediction-card');
      animate(cards, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        ease: 'outCubic',
        delay: stagger(100, { start: 200 }),
      });
    }
  }, [isVisible, ref]);

  return (
    <section
      id={category.id}
      className="scroll-mt-8"
      ref={ref as React.RefObject<HTMLElement>}
      style={{ opacity: 0 }}
    >
      {/* Section Header */}
      <header className="relative mb-8">
        {/* Big background number */}
        <div className="absolute -left-2 sm:-left-6 -top-4 select-none pointer-events-none opacity-20">
          <span className="section-number">{sectionNumber}</span>
        </div>

        <div className="relative flex flex-wrap items-baseline gap-3">
          {/* Section number pill */}
          <span className="inline-flex items-center justify-center w-10 h-10 bg-[var(--color-text)] text-white font-display text-lg rounded-full">
            {index + 1}
          </span>

          {/* Section title */}
          <h2 className="heading-section flex-1">{category.title}</h2>

          {/* Timestamp badge */}
          <span className="sticker text-xs">
            {category.timestamp}
          </span>
        </div>
      </header>

      {/* Predictions grid */}
      <div ref={cardsRef} className="space-y-4">
        {predictions.map((prediction) => (
          <div key={prediction.id} className="prediction-card" style={{ opacity: 0 }}>
            <PredictionCard prediction={prediction} />
          </div>
        ))}
      </div>
    </section>
  );
}
