/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useTheme } from '../context/ThemeContext';
import { ComputationalSculpture } from '../webgl/sculpture/ComputationalSculpture';
import { webglCoordinator, detectSoftwareGl } from '../webgl/webglCoordinator';

interface Hero3DStageProps {
  className?: string;
}

export const Hero3DStage: React.FC<Hero3DStageProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const prefersReduced = usePrefersReducedMotion();
  const { activePalette } = useTheme();

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isWebGlSupported, setIsWebGlSupported] = useState(true);
  const [modeLabel, setModeLabel] = useState('CRYSTAL PBR // NEURAL CORE');

  const interactionRef = useRef({
    pointer: { x: 0, y: 0 },
    dragStart: { x: 0, y: 0 },
    dragDelta: { x: 0, y: 0 },
    isDragging: false,
    isVisible: true,
  });

  const sculptureRef = useRef<ComputationalSculpture | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const envMapRef = useRef<THREE.Texture | null>(null);

  // Initialize Three.js scene with procedural studio PMREM environment
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer;
    const isSoftware = detectSoftwareGl();

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isSoftware,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 1.75));
    } catch (err) {
      console.warn('[Hero3DStage] WebGL failed to initialize:', err);
      setIsWebGlSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Generate procedural studio environment map for realistic optical glass reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();

    // Top softbox light panel
    const topLightGeom = new THREE.PlaneGeometry(10, 10);
    const topLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const topLight = new THREE.Mesh(topLightGeom, topLightMat);
    topLight.position.set(0, 6, 0);
    topLight.rotation.x = Math.PI / 2;
    envScene.add(topLight);

    // Lateral studio fill panel (tinted with active palette primary)
    const sideLightGeom = new THREE.PlaneGeometry(6, 12);
    const sideLightMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activePalette.colors.primary),
    });
    const sideLight = new THREE.Mesh(sideLightGeom, sideLightMat);
    sideLight.position.set(7, 3, 5);
    sideLight.lookAt(0, 0, 0);
    envScene.add(sideLight);

    // Rim studio panel (tinted with active palette accent)
    const rimLightGeom = new THREE.PlaneGeometry(6, 10);
    const rimLightMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activePalette.colors.accent),
    });
    const rimLight = new THREE.Mesh(rimLightGeom, rimLightMat);
    rimLight.position.set(-7, -2, -5);
    rimLight.lookAt(0, 0, 0);
    envScene.add(rimLight);

    const envTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
    scene.environment = envTexture;
    envMapRef.current = envTexture;

    // Clean up temporary environment generation scene
    topLightGeom.dispose();
    topLightMat.dispose();
    sideLightGeom.dispose();
    sideLightMat.dispose();
    rimLightGeom.dispose();
    rimLightMat.dispose();
    pmremGenerator.dispose();

    // Perspective camera with calibrated focal depth
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0, 6.2);

    // Ambient fill
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.8);
    scene.add(ambientLight);

    // Directional key light
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.2);
    keyLight.position.set(5, 6, 5);
    scene.add(keyLight);

    // Create the procedural computational sculpture
    const sculpture = new ComputationalSculpture();
    scene.add(sculpture.group);
    sculptureRef.current = sculpture;

    // Responsive sizing
    const updateSize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 360;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    // IntersectionObserver to pause rendering when scrolled out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        interactionRef.current.isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.1 }
    );
    intersectionObserver.observe(container);

    const primaryCol = new THREE.Color(activePalette.colors.primary);
    const secondaryCol = new THREE.Color(activePalette.colors.secondary);
    const accentCol = new THREE.Color(activePalette.colors.accent);

    // Master RAF subscription via centralized coordinator
    const unsubscribe = webglCoordinator.subscribe((time, delta) => {
      if (!interactionRef.current.isVisible) return;

      primaryCol.set(activePalette.colors.primary);
      secondaryCol.set(activePalette.colors.secondary);
      accentCol.set(activePalette.colors.accent);

      sculpture.update({
        delta,
        time,
        pointer: interactionRef.current.pointer,
        dragDelta: interactionRef.current.dragDelta,
        isHovered,
        isReducedMotion: prefersReduced,
        colors: {
          primary: primaryCol,
          secondary: secondaryCol,
          accent: accentCol,
        },
      });

      // Decay drag delta after applied
      interactionRef.current.dragDelta.x *= 0.88;
      interactionRef.current.dragDelta.y *= 0.88;

      renderer.render(scene, camera);
    });

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      unsubscribe();
      sculpture.dispose();
      if (envMapRef.current) {
        envMapRef.current.dispose();
      }
      renderer.dispose();
      sculptureRef.current = null;
      sceneRef.current = null;
    };
  }, [prefersReduced]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    interactionRef.current.isDragging = true;
    interactionRef.current.dragStart = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    interactionRef.current.pointer.x = Math.max(-1, Math.min(1, nx));
    interactionRef.current.pointer.y = Math.max(-1, Math.min(1, ny));

    if (interactionRef.current.isDragging) {
      const dx = (e.clientX - interactionRef.current.dragStart.x) / rect.width;
      const dy = (e.clientY - interactionRef.current.dragStart.y) / rect.height;

      interactionRef.current.dragDelta.x = dx;
      interactionRef.current.dragDelta.y = dy;

      interactionRef.current.dragStart = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore capture release error
    }
    interactionRef.current.isDragging = false;
    setIsDragging(false);
  };

  const handleDoubleClick = useCallback(() => {
    if (sculptureRef.current) {
      sculptureRef.current.resetOrientation();
      setModeLabel('ORIENTATION RESET // FOCAL REST');
      setTimeout(() => setModeLabel('CRYSTAL PBR // NEURAL CORE'), 1800);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        interactionRef.current.pointer = { x: 0, y: 0 };
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      className={`relative w-full rounded-2xl border border-[var(--border-bright)] bg-[var(--paper-deep)]/90 backdrop-blur-xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none transition-all duration-300 hover:border-[var(--primary)] ${className}`}
      aria-label="Interactive 3D Computational Sculpture: Refractive Glass Monolith with Neural Lattice. Drag to rotate, double click to reset."
      role="region"
    >
      {/* Ambient Glow Aura */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)`,
        }}
      />

      {/* Card Header Telemetry */}
      <div className="relative z-10 flex items-center justify-between p-3.5 sm:p-4 border-b border-[var(--line)] bg-[var(--paper-card)]/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--secondary)] font-semibold">
            Interactive WebGL 2.0
          </span>
          <span className="text-[var(--ink-muted)]/40 hidden sm:inline">·</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--ink-muted)] hidden sm:inline">
            Drag to Rotate
          </span>
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--secondary)] flex items-center gap-1.5">
          <span className="text-[var(--accent)]">✦</span>
          <span>{modeLabel}</span>
        </div>
      </div>

      {/* 3D Viewport Canvas Container with generous cinematic height */}
      <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[430px] flex items-center justify-center overflow-hidden">
        {isWebGlSupported ? (
          <canvas ref={canvasRef} className="w-full h-full block touch-none" />
        ) : (
          <div className="text-center p-6 font-mono text-xs text-[var(--ink-muted)]">
            <p className="text-[var(--primary)] font-semibold mb-1">WebGL Acceleration Unavailable</p>
            <p>Procedural hardware rendering gracefully bypassed.</p>
          </div>
        )}

        {/* Dynamic Drag State Badge (Subtle top-left indicator instead of bottom-right overlap) */}
        {isDragging && (
          <div
            aria-hidden="true"
            className="absolute top-3 left-3 pointer-events-none font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--accent)] bg-[var(--paper)]/90 text-[var(--accent)] shadow-md"
          >
            Rotating Active ↔
          </div>
        )}
      </div>

      {/* Card Sub-Bar: Architecture & Mathematical Rationale */}
      <div className="relative z-10 p-3 sm:p-3.5 border-t border-[var(--line)] bg-[var(--paper)]/60 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px]">
        <div>
          <span className="text-[var(--ink)] font-semibold">Refractive Monolith</span>
          <span className="text-[var(--ink-muted)]/50 mx-1.5">·</span>
          <span className="text-[var(--ink-muted)]">Procedural Neural Lattice</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--secondary)]">
          <button
            onClick={handleDoubleClick}
            className="hover:text-[var(--primary)] text-[9px] uppercase tracking-wider underline underline-offset-2 transition-colors cursor-pointer"
            title="Reset to default front-facing view"
          >
            Reset View ↺
          </button>
          <span className="text-[var(--ink-muted)]/40">|</span>
          <span className="text-[var(--accent)]">Synced // {activePalette.shortName}</span>
        </div>
      </div>
    </div>
  );
};
