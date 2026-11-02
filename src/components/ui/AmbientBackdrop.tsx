/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const AmbientBackdrop: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Canvas Noise/Gradient Overlay */}
      <div className="absolute inset-0 bg-slate-50/60 dark:bg-[#070b14] transition-colors" />

      {/* Primary Cyan Ambient Glow Spot (Top Right) */}
      <div
        className="absolute -top-32 -right-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full blur-[120px] opacity-15 dark:opacity-30 ambient-glow-cyan"
      />

      {/* Electric Blue Ambient Glow Spot (Center Left) */}
      <div
        className="absolute top-1/3 -left-40 w-80 sm:w-[600px] h-80 sm:h-[600px] rounded-full blur-[140px] opacity-10 dark:opacity-25 ambient-glow-blue"
      />

      {/* Subtle Violet Ambient Glow Spot (Bottom Right) */}
      <div
        className="absolute -bottom-40 right-1/4 w-96 sm:w-[550px] h-96 sm:h-[550px] rounded-full blur-[130px] opacity-10 dark:opacity-20 ambient-glow-violet"
      />

      {/* Subtle grid pattern for developer aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
    </div>
  );
};
