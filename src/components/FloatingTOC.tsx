'use client';

import { useEffect, useState, useRef } from 'react';
import { animate } from 'animejs';
import { motion, AnimatePresence } from 'framer-motion';
import { categories } from '@/data/categories';

export function FloatingTOC() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const tocRef = useRef<HTMLDivElement>(null);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate in when becoming visible
  useEffect(() => {
    if (!isVisible || !tocRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!prefersReducedMotion) {
      animate(tocRef.current, {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 400,
        ease: 'outCubic',
      });
    }
  }, [isVisible]);

  // Track active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach((category) => {
      const element = document.getElementById(category.id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(category.id);
          }
        },
        { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={tocRef}
      className="fixed left-3 top-1/2 -translate-y-1/2 z-50 hidden md:block"
    >
      <nav className="bg-white border-3 border-[var(--color-text)] rounded-2xl p-2 shadow-xl">
        <ul className="space-y-1">
          {categories.map((category, index) => {
            const isActive = activeSection === category.id;
            const isHovered = hoveredItem === category.id;
            return (
              <li key={category.id} className="relative">
                <a
                  href={`#${category.id}`}
                  onMouseEnter={() => setHoveredItem(category.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[var(--color-text)] text-white scale-110'
                      : 'hover:bg-[var(--color-bg-alt)] text-[var(--color-text)] hover:scale-105'
                  }`}
                >
                  {index + 1}
                </a>
                {/* Tooltip with fluid animation */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 44, y: '-50%' }}
                      animate={{ opacity: 1, x: 48, y: '-50%' }}
                      exit={{ opacity: 0, x: 44, y: '-50%' }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="absolute left-0 top-1/2 pointer-events-none z-10"
                    >
                      <div className="bg-[var(--color-text)] text-white text-sm font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg relative">
                        {category.title}
                        {/* Arrow */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-[var(--color-text)]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
