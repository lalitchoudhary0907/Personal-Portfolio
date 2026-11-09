/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SPATIAL_LAYERS, TOTAL_LAYERS } from '../utils/spatialNavigation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface LayerHUDProps {
  activeLayer: number;
  isDeckView: boolean;
  onSelectLayer: (index: number) => void;
  onToggleDeckView: () => void;
  onPrevLayer: () => void;
  onNextLayer: () => void;
}

export const LayerHUD: React.FC<LayerHUDProps> = ({
  activeLayer,
  isDeckView,
  onSelectLayer,
  onToggleDeckView,
  onPrevLayer,
  onNextLayer,
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const currentMeta = SPATIAL_LAYERS[activeLayer] || SPATIAL_LAYERS[0];

  return (
    <aside
      aria-label="3D Spatial Navigation HUD"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto select-none hidden md:flex flex-col items-end gap-3"
    >
      {/* 3D Isometric Deck View Toggle Button */}
      <button
        type="button"
        onClick={onToggleDeckView}
        data-cursor="link"
        aria-pressed={isDeckView}
        aria-label={isDeckView ? 'Return to focused 3D layer' : 'Switch to 3D Isometric Deck View'}
        className={`group relative flex items-center gap-2.5 px-3.5 py-2 border font-mono text-[11px] uppercase tracking-wider backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg ${
          isDeckView
            ? 'bg-[#00F2FE] text-[#08090D] border-[#00F2FE] shadow-[0_0_24px_rgba(0,242,254,0.45)]'
            : 'bg-[#0E131E]/80 text-[#F0F6FC] border-white/15 hover:border-[#00F2FE]/60 hover:text-[#00F2FE]'
        }`}
      >
        <span className="text-sm font-bold">
          {isDeckView ? '⛶' : '◰'}
        </span>
        <span className="font-semibold">
          {isDeckView ? 'Focus Layer' : '3D Deck View'}
        </span>
        <span
          className={`text-[9px] px-1 py-0.5 rounded font-mono ${
            isDeckView ? 'bg-black/20 text-black' : 'bg-white/10 text-white/70'
          }`}
        >
          [D]
        </span>
      </button>

      {/* Layer HUD Controller Card */}
      <div className="bg-[#0E131E]/90 border border-white/10 backdrop-blur-xl p-3.5 flex flex-col gap-3 min-w-[200px] shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
        {/* Telemetry Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 font-mono text-[10px] tracking-wider text-[#8E9BAE]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] animate-pulse" />
            <span>3D SPATIAL STACK</span>
          </div>
          <span className="text-[#00F2FE]">
            {activeLayer + 1}/{TOTAL_LAYERS}
          </span>
        </div>

        {/* Current Active Layer Info */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs font-bold text-[#00F2FE]">
              LAYER {currentMeta.label}
            </span>
            <span className="font-mono text-[10px] text-[#8E9BAE]">
              Z: {currentMeta.zDepth}mm
            </span>
          </div>
          <span className="font-display text-sm font-semibold text-[#F0F6FC] truncate">
            {currentMeta.title}
          </span>
        </div>

        {/* Vertical 3D Layer Stack Planes */}
        <div className="flex flex-col gap-1.5 pt-1">
          {SPATIAL_LAYERS.map((layer) => {
            const isActive = activeLayer === layer.index;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => onSelectLayer(layer.index)}
                data-cursor="link"
                aria-current={isActive ? 'step' : undefined}
                className={`group flex items-center justify-between px-2.5 py-1.5 border font-mono text-[11px] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-[#00F2FE] bg-[#00F2FE]/15 text-[#00F2FE] shadow-[inset_0_0_12px_rgba(0,242,254,0.2)]'
                    : 'border-white/5 bg-white/[0.02] text-[#8E9BAE] hover:border-white/20 hover:text-[#F0F6FC] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 transition-colors ${
                      isActive ? 'bg-[#00F2FE]' : 'bg-white/20 group-hover:bg-white/50'
                    }`}
                  />
                  <span className="font-semibold">{layer.label}</span>
                  <span className="text-[10px] tracking-wider text-white/50 group-hover:text-white/80">
                    {layer.shortTag}
                  </span>
                </div>
                <span className="text-[9px] text-[#8E9BAE]/60 group-hover:text-[#00F2FE]">
                  [{layer.index + 1}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Prev / Next Steppers */}
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-white/10 font-mono text-[10px]">
          <button
            type="button"
            onClick={onPrevLayer}
            disabled={activeLayer === 0}
            data-cursor="link"
            aria-label="Go to previous 3D layer"
            className="px-2 py-1.5 border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] hover:border-white/25 text-[#F0F6FC] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>▲</span>
            <span>PREV [↑]</span>
          </button>
          <button
            type="button"
            onClick={onNextLayer}
            disabled={activeLayer === TOTAL_LAYERS - 1}
            data-cursor="link"
            aria-label="Go to next 3D layer"
            className="px-2 py-1.5 border border-white/10 bg-white/[0.02] hover:bg-white/[0.07] hover:border-white/25 text-[#F0F6FC] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>▼</span>
            <span>NEXT [↓]</span>
          </button>
        </div>

        {/* Hotkey hint */}
        <div className="font-mono text-[9px] text-center text-[#8E9BAE]/60 pt-0.5">
          Wheel / Keys [1-6] • [↑/↓]
        </div>
      </div>
    </aside>
  );
};
