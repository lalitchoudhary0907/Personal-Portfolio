/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { useMagnetic } from '../hooks/useMagnetic';
import { useScrollTo, useActiveSection } from '../context/ScrollContext';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const MagneticNavLink: React.FC<{
  href: string;
  label: string;
  isActive: boolean;
}> = ({ href, label, isActive }) => {
  const scrollTo = useScrollTo();
  const { ref, style } = useMagnetic<HTMLAnchorElement>({
    radius: 70,
    pullFactor: 0.25,
    maxOffset: 8,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href, { offset: -30 });
    window.history.pushState(null, '', href);
  };

  return (
    <motion.a
      ref={ref}
      style={style}
      href={href}
      onClick={handleClick}
      data-cursor="link"
      data-cursor-label={label.toUpperCase()}
      className={`group relative min-h-[44px] px-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors inline-flex items-center gap-1.5 ${
        isActive ? 'text-[var(--primary)] font-semibold' : 'text-[var(--ink)] hover:text-[var(--primary)]'
      }`}
    >
      {isActive && (
        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
      )}
      <span>{label}</span>
      {/* Underline that draws from left to right on hover or stays when active */}
      <span
        aria-hidden="true"
        className={`absolute bottom-2 left-2 right-2 h-[1.5px] bg-[var(--primary)] transition-transform duration-300 origin-left ease-out ${
          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </motion.a>
  );
};

export const Header: React.FC = () => {
  const scrollTo = useScrollTo();
  const activeSection = useActiveSection();
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Dynamic Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 30,
    restDelta: 0.001,
  });

  // Logo magnetic physics
  const logoMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 70,
    pullFactor: 0.25,
    maxOffset: 8,
  });

  // Scroll direction detection (hide on scroll down, show on scroll up, transform only)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          // Always visible at the top
          if (currentScrollY < 40) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current + 6) {
            // Scrolling down
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current - 6) {
            // Scrolling up
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Accessibility: Lock background scroll and handle focus trap when mobile menu opens
  useEffect(() => {
    if (!isMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (focusableElements && focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }

      // Trap focus
      if (e.key === 'Tab' && focusableElements && focusableElements.length > 0) {
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <>
      <header
        role="banner"
        // Always visible when keyboard focus is inside (:focus-within) or when isVisible is true
        className={`fixed top-0 left-0 right-0 z-40 bg-transparent text-[var(--ink)] pt-[env(safe-area-inset-top)] transition-transform duration-300 ease-out focus-within:!translate-y-0 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between gap-6 relative">
          {/* LC Monogram linking to #top (min 44px tap target) */}
          <motion.a
            ref={logoMagnetic.ref}
            style={logoMagnetic.style}
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#top');
              window.history.pushState(null, '', '#top');
            }}
            data-cursor="link"
            aria-label="Lalit Choudhary — Top of page"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-start font-display font-extrabold text-2xl tracking-tighter text-[var(--ink)] hover:text-[var(--primary)] transition-colors select-none cursor-pointer"
          >
            LC
          </motion.a>

          {/* Desktop Nav: Work, About, Contact with drawing underline & magnetic pull */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8"
          >
            {NAV_ITEMS.map((item) => (
              <MagneticNavLink
                key={item.label}
                href={item.href}
                label={item.label}
                isActive={activeSection === item.href}
              />
            ))}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('replay_intro'))}
              data-cursor="link"
              aria-label="Replay 6-second cinematic tech introduction"
              className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--primary)] px-3 py-1.5 border border-white/10 hover:border-[var(--primary)]/50 bg-white/[0.03] transition-colors cursor-pointer"
            >
              Intro ↺
            </button>
          </nav>

          {/* Mobile Menu Button (<768px, min 44px tap target) */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-overlay-menu"
            aria-label="Open navigation menu"
            data-cursor="link"
            className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--ink)] hover:text-[var(--primary)] border border-[var(--line)] hover:border-[var(--primary)] px-4 py-2 transition-colors cursor-pointer"
          >
            Menu
          </button>
        </div>

        {/* Dynamic Global Scroll Progress Bar */}
        <motion.div
          style={{ scaleX: smoothProgress }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] origin-left shadow-[0_0_12px_var(--primary-glow)]"
        />
      </header>

      {/* Mobile Full-Screen Paper Overlay (<768px, safe-area padded) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-overlay-menu"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 bg-[var(--paper)] flex flex-col justify-between pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] px-6 sm:px-10 select-none md:hidden"
          >
            {/* Overlay Top Bar */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
              <span className="font-display font-black text-2xl tracking-tighter text-[var(--ink)]">
                LC
              </span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                data-cursor="link"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--ink)] hover:text-[var(--primary)] border border-[var(--line)] px-4 py-2 transition-colors cursor-pointer"
              >
                Close [Esc]
              </button>
            </div>

            {/* Display-size Nav Links */}
            <nav className="flex flex-col gap-6 my-auto">
              {NAV_ITEMS.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    closeMenu();
                    scrollTo(item.href, { offset: -30 });
                    window.history.pushState(null, '', item.href);
                  }}
                  data-cursor="link"
                  className="group flex items-baseline justify-between font-display text-[clamp(2.5rem,10vw,4.5rem)] font-bold tracking-tight text-[var(--ink)] hover:text-[var(--primary)] transition-colors border-b border-[var(--line)] pb-3 cursor-pointer"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] group-hover:text-[var(--primary)] transition-colors">
                    0{index + 1} &rarr;
                  </span>
                </a>
              ))}
            </nav>

            {/* Overlay Footer Note */}
            <div className="pt-4 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
              <span>Lalit Choudhary</span>
              <span>Computer Science &amp; AI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
