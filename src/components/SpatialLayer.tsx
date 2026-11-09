/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { LayerMetadata, calculateSpatialLayerState } from '../utils/spatialNavigation';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface SpatialLayerProps {
  meta: LayerMetadata;
  activeLayer: number;
  isDeckView: boolean;
  mouseTilt: { x: number; y: number };
  onSelect: (index: number) => void;
  children: React.ReactNode;
}

export const SpatialLayer: React.FC<SpatialLayerProps> = ({
  meta,
  activeLayer,
  isDeckView,
  mouseTilt,
  onSelect,
  children,
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const isActive = activeLayer === meta.index;

  const state = calculateSpatialLayerState({
    layerIndex: meta.index,
    activeIndex: activeLayer,
    isDeckView,
    mouseTilt,
    prefersReduced,
  });

  return (
    <section
      id={`layer-${meta.id}`}
      aria-label={`${meta.label} / ${meta.title}`}
      aria-hidden={!isActive && !isDeckView}
      style={{
        transform: state.transform,
        opacity: state.opacity,
        pointerEvents: state.pointerEvents,
        zIndex: state.zIndex,
      }}
      onClick={() => {
        if (isDeckView) {
          onSelect(meta.index);
        }
      }}
      className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDeckView
          ? 'cursor-pointer hover:border-[#00F2FE] hover:shadow-[0_0_36px_rgba(0,242,254,0.35)]'
          : ''
      }`}
    >
      {/* 3D Spatial Plane Frame */}
      <div
        className={`relative w-full h-full max-w-7xl max-h-[92vh] sm:max-h-[88vh] mx-auto rounded-none border transition-all duration-500 flex flex-col overflow-hidden ${
          isDeckView
            ? 'border-[#00F2FE]/40 bg-[#0E131E]/95 shadow-[0_24px_64px_rgba(0,0,0,0.85)] scale-95'
            : isActive
            ? 'border-white/10 bg-[#08090D]/40 shadow-[0_0_80px_rgba(0,0,0,0.5)]'
            : 'border-transparent'
        }`}
      >
        {/* Layer Top Technical HUD Bar */}
        <div className="shrink-0 h-9 px-4 sm:px-6 border-b border-white/10 bg-[#0E131E]/80 backdrop-blur-md flex items-center justify-between font-mono text-[10px] tracking-wider text-[#8E9BAE] select-none">
          {/* Left: Holographic Crosshair & Layer Code */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[#00F2FE] font-bold text-xs">+</span>
            <span className="text-[#00F2FE] font-bold">
              LAYER {meta.label} // {meta.shortTag}
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline text-white/60">
              DEPTH: {meta.zDepth}mm
            </span>
          </div>

          {/* Center: When in Deck View, show click prompt */}
          {isDeckView && (
            <div className="font-mono text-[10px] text-[#00F2FE] uppercase tracking-widest font-semibold flex items-center gap-1.5 animate-pulse">
              <span>CLICK TO ENTER &rarr;</span>
            </div>
          )}

          {/* Right: Geolocation / Space telemetry */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-white/40">
              SYS_COORD: 28.98°N 77.06°E
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]' : 'bg-white/20'
              }`}
            />
          </div>
        </div>

        {/* Inner Scrollable Viewport for Layer Content */}
        <div
          ref={contentRef}
          data-layer-content={meta.index}
          className={`flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 md:p-12 custom-scrollbar ${
            isDeckView ? 'pointer-events-none select-none' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {children}
        </div>

        {/* Layer Bottom Technical HUD Bar */}
        <div className="shrink-0 h-6 px-4 sm:px-6 border-t border-white/5 bg-[#08090D]/60 flex items-center justify-between font-mono text-[9px] text-[#8E9BAE]/50 select-none">
          <span>SEC: {meta.id.toUpperCase()}</span>
          <span>SPATIAL_MATRIX // V3.2</span>
          <span className="text-[#00F2FE]/70">+</span>
        </div>
      </div>
    </section>
  );
};
