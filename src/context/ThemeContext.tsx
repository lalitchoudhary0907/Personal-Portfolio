/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { PaletteDefinition, PaletteId } from '../types/theme';
import { PALETTES, PALETTE_LIST, DEFAULT_PALETTE_ID, getPalette } from '../config/palettes';

interface ThemeContextType {
  paletteId: PaletteId;
  activePalette: PaletteDefinition;
  palettes: PaletteDefinition[];
  setPaletteId: (id: PaletteId) => void;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (open: boolean) => void;
  openComparison: () => void;
  closeComparison: () => void;
}

const STORAGE_KEY = 'portfolio_active_palette_id';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paletteId, setPaletteIdState] = useState<PaletteId>(() => {
    if (typeof window === 'undefined') return DEFAULT_PALETTE_ID;
    try {
      // Check URL query param first (?palette=palette-b or ?p=b)
      const params = new URLSearchParams(window.location.search);
      const urlP = params.get('palette') || params.get('p');
      if (urlP) {
        if (urlP === 'a' || urlP === 'palette-a') return 'palette-a';
        if (urlP === 'b' || urlP === 'palette-b') return 'palette-b';
        if (urlP === 'c' || urlP === 'palette-c') return 'palette-c';
        if (urlP === 'd' || urlP === 'palette-d') return 'palette-d';
      }
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved in PALETTES) {
        return saved as PaletteId;
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_PALETTE_ID;
  });

  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const setPaletteId = useCallback((newId: PaletteId) => {
    setPaletteIdState(newId);
    try {
      localStorage.setItem(STORAGE_KEY, newId);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const openComparison = useCallback(() => setIsComparisonOpen(true), []);
  const closeComparison = useCallback(() => setIsComparisonOpen(false), []);

  // Update HTML data-theme attribute
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', paletteId);
  }, [paletteId]);

  // Global keyboard shortcuts (Alt+1, Alt+2, Alt+3, Alt+4 to switch palettes; Shift+P or Alt+P to toggle modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea or contenteditable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          setPaletteId('palette-a');
        } else if (e.key === '2') {
          e.preventDefault();
          setPaletteId('palette-b');
        } else if (e.key === '3') {
          e.preventDefault();
          setPaletteId('palette-c');
        } else if (e.key === '4') {
          e.preventDefault();
          setPaletteId('palette-d');
        } else if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setIsComparisonOpen((prev) => !prev);
        }
      } else if (e.key === 'Escape' && isComparisonOpen) {
        setIsComparisonOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setPaletteId, isComparisonOpen]);

  const activePalette = useMemo(() => getPalette(paletteId), [paletteId]);

  const value = useMemo(
    () => ({
      paletteId,
      activePalette,
      palettes: PALETTE_LIST,
      setPaletteId,
      isComparisonOpen,
      setIsComparisonOpen,
      openComparison,
      closeComparison,
    }),
    [paletteId, activePalette, setPaletteId, isComparisonOpen, openComparison, closeComparison]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
