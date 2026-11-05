/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IntroVariant } from '../hooks/useIntro';

interface IntroProps {
  isSplitting: boolean;
  phase: number;
  progress: number;
  variant: IntroVariant;
  onSkip: () => void;
}

const EASE_WARP: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const Intro: React.FC<IntroProps> = ({
  isSplitting,
  phase,
  progress,
  variant,
  onSkip,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      const sec = ((performance.now() - startTime) / 1000).toFixed(1);
      setSecondsElapsed(Number(sec));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'reduced') {
    return (
      <motion.aside
        aria-label="Developer Introduction"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] bg-[#08090D] flex flex-col items-center justify-center text-[#F0F6FC] select-none"
      >
        <div className="font-display font-black text-6xl tracking-tight text-[#00F2FE]">LC</div>
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#8E9BAE] mt-3">
          LALIT CHOUDHARY ✦ CSAI DEVELOPER
        </div>
      </motion.aside>
    );
  }

  return (
    <aside
      aria-label="Developer System Boot Sequence"
      className="fixed inset-0 z-[9999] overflow-hidden select-none bg-[#08090D] text-[#F0F6FC]"
    >
      {/* ==================================================================== */}
      {/* Top Split Half Curtain (-100% on split) */}
      {/* ==================================================================== */}
      <motion.div
        initial={{ y: '0%' }}
        animate={isSplitting ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.8, ease: EASE_WARP }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#08090D] overflow-hidden z-10 border-b border-[#00F2FE]/30 shadow-[0_4px_30px_rgba(0,242,254,0.15)]"
      >
        {/* Subtle cyan cyber glow orb */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#00F2FE]/10 rounded-full blur-[140px]" />
      </motion.div>

      {/* ==================================================================== */}
      {/* Bottom Split Half Curtain (+100% on split) */}
      {/* ==================================================================== */}
      <motion.div
        initial={{ y: '0%' }}
        animate={isSplitting ? { y: '100%' } : { y: '0%' }}
        transition={{ duration: 0.8, ease: EASE_WARP }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#08090D] overflow-hidden z-10 border-t border-[#8B5CF6]/30 shadow-[0_-4px_30px_rgba(139,92,246,0.15)]"
      >
        {/* Subtle violet cyber glow orb */}
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#8B5CF6]/12 rounded-full blur-[140px]" />
      </motion.div>

      {/* ==================================================================== */}
      {/* Interactive Main HUD & Cinematic Sequence */}
      {/* ==================================================================== */}
      <div
        className={`relative z-20 w-full h-full flex flex-col justify-between p-6 sm:p-10 transition-opacity duration-300 ${
          isSplitting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Top Header HUD */}
        <div className="w-full flex items-center justify-between font-mono text-xs text-[#8E9BAE] border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-radar-pulse" />
            <span className="tracking-widest uppercase text-[#F0F6FC]">
              SYS_INIT // LALIT.CSAI
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#8E9BAE]">
            <span>NEWTON SCHOOL OF TECHNOLOGY</span>
            <span>✦</span>
            <span className="text-[#00F2FE]">T+{secondsElapsed.toFixed(1)}s / 6.2s</span>
          </div>

          {/* Accessible Skip Button */}
          <button
            type="button"
            onClick={onSkip}
            aria-label="Skip introduction animation and enter portfolio"
            className="group min-h-[40px] px-3.5 py-1.5 border border-[#00F2FE]/40 hover:border-[#00F2FE] bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 text-[#00F2FE] flex items-center gap-2 tracking-wider uppercase text-xs transition-all cursor-pointer"
          >
            <span>Skip Intro</span>
            <span className="text-[10px] text-[#8E9BAE] group-hover:text-[#F0F6FC]">(ESC)</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        {/* Center Content: Dynamic Multi-Phase Cinematic Transitions */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center relative py-8">
          <AnimatePresence mode="wait">
            {/* Phase 1: Cyber Kernel Boot (0.0s - 1.8s) */}
            {phase === 1 && (
              <motion.div
                key="phase-1"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg space-y-6"
              >
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#00F2FE] flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#00F2FE] animate-ping" />
                  INITIALIZING ARCHITECTURE
                </div>

                <div className="bg-[#0E131E]/80 border border-white/10 p-5 font-mono text-xs text-left text-[#8E9BAE] space-y-2.5 backdrop-blur-md rounded-none shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between text-[#F0F6FC]">
                    <span>&gt; TARGET: LALIT CHOUDHARY</span>
                    <span className="text-[#10B981]">OK</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8E9BAE]">
                    <span>&gt; CSAI CORE: NEWTON SCHOOL OF TECH</span>
                    <span className="text-[#10B981]">LOADED</span>
                  </div>
                  <div className="flex items-center justify-between text-[#8E9BAE]">
                    <span>&gt; QUANT &amp; OPEN SOURCE TELEMETRY</span>
                    <span className="text-[#00F2FE]">SYNCED</span>
                  </div>
                  <div className="flex items-center justify-between text-[#00F2FE]">
                    <span>&gt; NEURAL MESH &amp; INTERACTIVE FLUID</span>
                    <span className="animate-pulse">MOUNTING...</span>
                  </div>
                </div>

                {/* Cyber Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs text-[#8E9BAE]">
                    <span>SYSTEM COMPILATION</span>
                    <span className="text-[#00F2FE] font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 overflow-hidden relative">
                    <motion.div
                      style={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-[#00F2FE] via-[#8B5CF6] to-[#00F2FE] transition-all duration-75 shadow-[0_0_12px_#00F2FE]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 2: Kinetic Monogram & Hologram Reveal (1.8s - 3.8s) */}
            {phase === 2 && (
              <motion.div
                key="phase-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: EASE_WARP }}
                className="flex flex-col items-center justify-center space-y-4"
              >
                {/* Glowing Monogram */}
                <div className="relative">
                  <span className="font-display font-extrabold text-[clamp(6rem,22vw,14rem)] leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#F0F6FC] via-[#00F2FE] to-[#8B5CF6] drop-shadow-[0_0_40px_rgba(0,242,254,0.35)] select-none">
                    LC
                  </span>
                  <div className="absolute -inset-4 bg-[#00F2FE]/10 blur-3xl -z-10 rounded-full pointer-events-none" />
                </div>

                {/* Name & Academic Title */}
                <div className="space-y-2">
                  <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight text-[#F0F6FC] uppercase">
                    Lalit Choudhary
                  </h1>
                  <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-[#00F2FE]">
                    Computer Science &amp; Artificial Intelligence
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#8E9BAE]">
                    Newton School of Technology ✦ Rishihood University
                  </p>
                </div>

                {/* Audio-visual Equalizer Wave Bars */}
                <div className="flex items-end gap-1.5 h-8 pt-4">
                  {[24, 40, 16, 48, 32, 56, 28, 44, 20, 52, 36, 60, 24, 48, 32].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [8, h, 12, h * 0.8, 8],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.07,
                        ease: 'easeInOut',
                      }}
                      className="w-1 bg-gradient-to-t from-[#8B5CF6] to-[#00F2FE] rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Phase 3: Telemetry Verification & Node Lock (3.8s - 5.4s) */}
            {phase >= 3 && (
              <motion.div
                key="phase-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl space-y-6"
              >
                <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#10B981] flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-[#10B981] rounded-full animate-ping" />
                  TELEMETRY NODES SYNCHRONIZED
                </div>

                {/* 4 Tech Nodes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left font-mono">
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-3.5 bg-[#0E131E]/90 border border-[#00F2FE]/40 backdrop-blur-md flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] text-[#8E9BAE] uppercase">Project Node 01</div>
                      <div className="text-sm font-bold text-[#F0F6FC]">FocusFlow</div>
                    </div>
                    <span className="text-[10px] uppercase px-2 py-0.5 border border-[#10B981]/50 text-[#10B981] bg-[#10B981]/10">
                      Live
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-3.5 bg-[#0E131E]/90 border border-white/10 backdrop-blur-md flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] text-[#8E9BAE] uppercase">Project Node 02</div>
                      <div className="text-sm font-bold text-[#F0F6FC]">VastraGo</div>
                    </div>
                    <span className="text-[10px] uppercase px-2 py-0.5 border border-[#8B5CF6]/50 text-[#8B5CF6] bg-[#8B5CF6]/10">
                      In Progress
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-3.5 bg-[#0E131E]/90 border border-[#00F2FE]/40 backdrop-blur-md flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] text-[#8E9BAE] uppercase">Honor Node 01</div>
                      <div className="text-sm font-bold text-[#F0F6FC]">WorldQuant BRAIN</div>
                    </div>
                    <span className="text-[10px] uppercase px-2 py-0.5 border border-[#00F2FE]/50 text-[#00F2FE] bg-[#00F2FE]/10">
                      Gold Level
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-3.5 bg-[#0E131E]/90 border border-white/10 backdrop-blur-md flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] text-[#8E9BAE] uppercase">Honor Node 02</div>
                      <div className="text-sm font-bold text-[#F0F6FC]">Hacktoberfest 2026</div>
                    </div>
                    <span className="text-[10px] uppercase px-2 py-0.5 border border-[#10B981]/50 text-[#10B981] bg-[#10B981]/10">
                      Attendee
                    </span>
                  </motion.div>
                </div>

                <div className="font-mono text-xs text-[#00F2FE] tracking-widest uppercase animate-pulse">
                  &gt;&gt; ENGAGING WARP LANDING SEQUENCE...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Status Bar */}
        <div className="w-full flex items-center justify-between font-mono text-xs text-[#8E9BAE] border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-[#00F2FE]">✦</span>
            <span>PORTFOLIO SYSTEM // 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <span>PRESS</span>
            <kbd className="px-2 py-0.5 border border-white/20 bg-white/5 text-[#F0F6FC] text-[10px]">
              ESC
            </kbd>
            <span>TO BYPASS</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
