/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PaletteId } from '../types/theme';

export const PaletteSwitcherBar: React.FC = () => {
  const { paletteId, setPaletteId, activePalette, palettes, openComparison } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 select-none font-mono"
      aria-label="Design System Palette Switcher"
    >
      {/* Expanded Popover Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Palette Selection Menu"
          className="mb-2.5 p-3 sm:p-4 rounded-xl border border-[var(--border-bright)] bg-[var(--paper)]/95 backdrop-blur-xl shadow-2xl w-72 max-w-[90vw] text-[var(--ink)] animate-slide-up space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: activePalette.colors.primary }}
              />
              <span className="text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
                Palette Identity
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close theme menu"
              className="text-[11px] text-[var(--ink-muted)] hover:text-[var(--ink)] px-1.5 py-0.5 rounded transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Palette List */}
          <div className="space-y-1.5" role="radiogroup" aria-label="Available Colour Palettes">
            {palettes.map((p) => {
              const isCurrent = paletteId === p.id;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={isCurrent}
                  onClick={() => {
                    setPaletteId(p.id as PaletteId);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    isCurrent
                      ? 'bg-[var(--paper-card)] border border-[var(--primary)] text-[var(--ink)] shadow-sm'
                      : 'border border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: p.colors.primary }}
                    />
                    <span className="font-semibold text-[11px]">[{p.letter}]</span>
                    <span className="text-[11px] truncate">{p.shortName}</span>
                  </div>
                  {isCurrent && (
                    <span className="text-[9px] uppercase tracking-wider text-[var(--primary)] font-bold">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Compare Studio & Keyboard shortcut info */}
          <div className="pt-2 border-t border-[var(--line)] flex flex-col gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                openComparison();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-[var(--border-accent)] bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 text-[var(--accent)] text-xs font-medium transition-all"
            >
              <span>Compare (4) Studio</span>
              <span className="text-[10px]" aria-hidden="true">↗</span>
            </button>

            <div className="flex items-center justify-between text-[9px] text-[var(--ink-muted)] pt-0.5">
              <span>Quick: <kbd className="px-1 py-0.2 rounded bg-white/10 text-[var(--ink)]">Alt+1..4</kbd></span>
              <span>Toggle: <kbd className="px-1 py-0.2 rounded bg-white/10 text-[var(--ink)]">Alt+P</kbd></span>
            </div>
          </div>
        </div>
      )}

      {/* Unobtrusive Floating Pill Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        title="Explore Palette Identities (Alt + P)"
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border bg-[var(--paper)]/90 backdrop-blur-md text-xs transition-all shadow-lg hover:shadow-xl ${
          isOpen
            ? 'border-[var(--primary)] text-[var(--ink)]'
            : 'border-[var(--line-bright)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--primary)]'
        }`}
      >
        <span
          className="w-2 h-2 rounded-full transition-transform group-hover:scale-125"
          style={{ backgroundColor: activePalette.colors.primary }}
        />
        <span className="text-[11px] tracking-wider uppercase">
          Palette {activePalette.letter}
        </span>
        <span className="text-[10px] text-[var(--ink-muted)]/60 group-hover:text-[var(--ink-muted)]">
          {isOpen ? '▴' : '▾'}
        </span>
      </button>
    </div>
  );
};
