/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { profile } from '../data/profile';
import { useMagnetic } from '../hooks/useMagnetic';

export const Footer: React.FC = () => {
  const replayMagnetic = useMagnetic<HTMLButtonElement>({
    radius: 60,
    pullFactor: 0.2,
    maxOffset: 6,
  });

  const backToTopMagnetic = useMagnetic<HTMLAnchorElement>({
    radius: 60,
    pullFactor: 0.2,
    maxOffset: 6,
  });

  const handleReplayIntro = () => {
    window.dispatchEvent(new CustomEvent('replay_intro'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState(null, '', '#top');
  };

  return (
    <footer
      role="contentinfo"
      className="w-full border-t border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] pt-16 pb-[max(3rem,calc(2rem+env(safe-area-inset-bottom)))] px-6 sm:px-10 select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        {/* Left: Copyright */}
        <div className="text-[var(--ink)]">
          &copy; 2026 {profile.name} · BTech CSAI
        </div>

        {/* Center / Right: Actions */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <motion.button
            ref={replayMagnetic.ref}
            style={replayMagnetic.style}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
            type="button"
            onClick={handleReplayIntro}
            data-cursor="link"
            aria-label="Replay cover intro animation"
            className="min-h-[44px] inline-flex items-center px-3 py-1.5 border border-transparent hover:border-[var(--line)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            Replay Intro &larr;
          </motion.button>

          <motion.a
            ref={backToTopMagnetic.ref}
            style={backToTopMagnetic.style}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
            href="#top"
            onClick={handleBackToTop}
            data-cursor="link"
            aria-label="Scroll back to top of page"
            className="min-h-[44px] inline-flex items-center px-3 py-1.5 border border-transparent hover:border-[var(--line)] hover:text-[var(--primary)] transition-colors"
          >
            Back to Top &uarr;
          </motion.a>

          <a
            href="/?tokens"
            data-cursor="link"
            className="min-h-[44px] inline-flex items-center px-3 py-1.5 text-[var(--ink-muted)]/70 hover:text-[var(--primary)] transition-colors"
            title="Design Tokens & Style Guide"
          >
            Design Tokens
          </a>
        </div>
      </div>
    </footer>
  );
};
