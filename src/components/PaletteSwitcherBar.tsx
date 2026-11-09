/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PaletteId } from '../types/theme';

export const PaletteSwitcherBar: React.FC = () => {
  const { paletteId, setPaletteId, activePalette, palettes, openComparison } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      aria-label="Palette Switcher HUD"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] transition-all duration-300"
    >
      {isCollapsed ? (
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--border-bright)] bg-[var(--paper)]/90 backdrop-blur-md shadow-2xl text-xs font-mono text-[var(--ink)] hover:border-[var(--primary)] transition-all group"
          title="Expand Palette Explorer HUD"
        >
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: activePalette.colors.primary }}
          />
          <span className="font-semibold tracking-wider uppercase text-[11px]">
            Palette {activePalette.letter}: {activePalette.shortName}
          </span>
          <span className="text-[10px] text-[var(--ink-muted)] group-hover:text-[var(--primary)]">
            [Explore ↗]
          </span>
        </button>
      ) : (
        <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl border border-[var(--border-bright)] bg-[var(--paper)]/92 backdrop-blur-xl shadow-2xl text-[var(--ink)] animate-slide-up">
          {/* Label / Prefix */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 text-xs font-mono border-r border-[var(--line)]">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activePalette.colors.primary }}
            />
            <span className="text-[10px] tracking-widest uppercase text-[var(--ink-muted)]">
              Palette Identity
            </span>
          </div>

          {/* 4 Palette Selector Pills */}
          <div className="flex items-center gap-1 sm:gap-1.5" role="radiogroup" aria-label="Colour Palette Selection">
            {palettes.map((p) => {
              const isCurrent = paletteId === p.id;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={isCurrent}
                  onClick={() => setPaletteId(p.id as PaletteId)}
                  className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-xs transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                    isCurrent
                      ? 'bg-[var(--paper-card)] border border-[var(--primary)] text-[var(--ink)] shadow-md'
                      : 'border border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-white/5'
                  }`}
                  title={`${p.name} (${p.visualIdentity})`}
                >
                  <span
                    className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
                    style={{ backgroundColor: p.colors.primary }}
                  />
                  <span className="font-semibold text-[11px] sm:text-xs">
                    {p.letter}
                  </span>
                  <span className="hidden md:inline text-[11px] opacity-80">
                    {p.shortName}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-[var(--line)] mx-0.5" />

          {/* Full Comparison Studio Button */}
          <button
            onClick={openComparison}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-accent)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] font-mono text-xs font-medium transition-all"
            title="Open side-by-side palette exploration studio"
          >
            <span>Compare (4)</span>
            <span className="text-[10px]">↗</span>
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => setIsCollapsed(true)}
            aria-label="Minimize palette switcher bar"
            className="p-1.5 rounded-lg text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-white/10 transition-colors"
            title="Minimize bar"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </aside>
  );
};
