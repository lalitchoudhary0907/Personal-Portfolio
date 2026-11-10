/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useTheme } from '../context/ThemeContext';
import { backgroundVertexShader, backgroundFragmentShader } from '../webgl/shaders/backgroundShader';
import { webglCoordinator, detectSoftwareGl } from '../webgl/webglCoordinator';

export const AmbientBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const prefersReduced = usePrefersReducedMotion();
  const { activePalette } = useTheme();

  const [useWebGL, setUseWebGL] = useState(true);

  // Normalized pointer coordinates [-1, 1]
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, intensity: 0 });

  // WebGL Renderer & Scene references
  const threeRefs = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    unsubscribe: () => void;
  } | null>(null);

  // Track pointer movements
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerRef.current.targetX = nx;
      pointerRef.current.targetY = ny;
      pointerRef.current.intensity = 1.0;
    };

    const handlePointerLeave = () => {
      pointerRef.current.intensity = 0.0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Initialize WebGL Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    const isSoftware = detectSoftwareGl();

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false, // fragment shader handles antialiasing
        powerPreference: 'high-performance',
        depth: false,
        stencil: false,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
    } catch (e) {
      console.warn('[AmbientBackground] WebGL initialization failed, using 2D fallback:', e);
      setUseWebGL(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerIntensity: { value: 0 },
      uQuality: { value: isSoftware ? 0.5 : 1.0 },
      uBgColor: { value: new THREE.Vector3(...activePalette.shaderUniforms.backgroundVec3) },
      uPrimaryColor: { value: new THREE.Vector3(...activePalette.shaderUniforms.primaryVec3) },
      uSecondaryColor: { value: new THREE.Vector3(...activePalette.shaderUniforms.secondaryVec3) },
      uAccentColor: { value: new THREE.Vector3(...activePalette.shaderUniforms.accentVec3) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: backgroundVertexShader,
      fragmentShader: backgroundFragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize Handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Target color vectors for smooth lerping
    const targetBg = new THREE.Vector3(...activePalette.shaderUniforms.backgroundVec3);
    const targetPrim = new THREE.Vector3(...activePalette.shaderUniforms.primaryVec3);
    const targetSec = new THREE.Vector3(...activePalette.shaderUniforms.secondaryVec3);
    const targetAcc = new THREE.Vector3(...activePalette.shaderUniforms.accentVec3);

    // Frame update subscribed to centralized coordinator
    const unsubscribe = webglCoordinator.subscribe((time, delta) => {
      // Smooth pointer interpolation
      const ptr = pointerRef.current;
      ptr.x += (ptr.targetX - ptr.x) * 0.08;
      ptr.y += (ptr.targetY - ptr.y) * 0.08;
      ptr.intensity += (0 - ptr.intensity) * 0.02; // slowly decay if idle

      uniforms.uTime.value = prefersReduced ? 1.0 : time;
      uniforms.uPointer.value.set(ptr.x, ptr.y);
      uniforms.uPointerIntensity.value = prefersReduced ? 0.3 : Math.max(0.2, ptr.intensity);

      // Smooth color transitions when palette switches
      targetBg.set(...activePalette.shaderUniforms.backgroundVec3);
      targetPrim.set(...activePalette.shaderUniforms.primaryVec3);
      targetSec.set(...activePalette.shaderUniforms.secondaryVec3);
      targetAcc.set(...activePalette.shaderUniforms.accentVec3);

      uniforms.uBgColor.value.lerp(targetBg, 0.06);
      uniforms.uPrimaryColor.value.lerp(targetPrim, 0.06);
      uniforms.uSecondaryColor.value.lerp(targetSec, 0.06);
      uniforms.uAccentColor.value.lerp(targetAcc, 0.06);

      renderer.render(scene, camera);
    });

    threeRefs.current = {
      renderer,
      scene,
      camera,
      material,
      mesh,
      unsubscribe,
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      threeRefs.current = null;
    };
  }, [prefersReduced]);

  // Update target palette colors when activePalette changes
  useEffect(() => {
    if (!threeRefs.current) return;
    const { material } = threeRefs.current;
    const u = material.uniforms;
    if (u) {
      // Vectors will lerp towards new targets in the render frame loop
    }
  }, [activePalette]);

  // 2D Canvas Fallback if WebGL unavailable
  useEffect(() => {
    if (useWebGL) return;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const unsubscribe = webglCoordinator.subscribe((time) => {
      ctx.fillStyle = activePalette.colors.background;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric center gradient
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, activePalette.colors.surface);
      grad.addColorStop(1, activePalette.colors.background);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, [useWebGL, activePalette]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[var(--paper)] transition-colors duration-700"
    >
      {useWebGL ? (
        <canvas ref={canvasRef} className="w-full h-full block" />
      ) : (
        <canvas ref={fallbackCanvasRef} className="w-full h-full block" />
      )}
    </div>
  );
};
