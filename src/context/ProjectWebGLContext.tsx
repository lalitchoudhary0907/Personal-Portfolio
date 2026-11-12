/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { ProjectCanvasManager } from '../webgl/ProjectCanvasManager';
import { useTheme } from './ThemeContext';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ProjectWebGLContextValue {
  registerProjectPortal: (id: string, element: HTMLElement, effectType: number) => () => void;
  setPortalHover: (id: string, isHovered: boolean) => void;
  setPortalPointer: (id: string, uvX: number, uvY: number) => void;
  isWebGLActive: boolean;
}

const ProjectWebGLContext = createContext<ProjectWebGLContextValue | null>(null);

export const useProjectWebGL = () => {
  const ctx = useContext(ProjectWebGLContext);
  if (!ctx) {
    return {
      registerProjectPortal: () => () => {},
      setPortalHover: () => {},
      setPortalPointer: () => {},
      isWebGLActive: false,
    };
  }
  return ctx;
};

interface ProjectWebGLProviderProps {
  children: React.ReactNode;
}

export const ProjectWebGLProvider: React.FC<ProjectWebGLProviderProps> = ({ children }) => {
  const { activePalette } = useTheme();
  const prefersReduced = usePrefersReducedMotion();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const managerRef = useRef<ProjectCanvasManager | null>(null);
  const [isWebGLActive, setIsWebGLActive] = useState(false);

  // Initialize ProjectCanvasManager
  useEffect(() => {
    if (prefersReduced) {
      setIsWebGLActive(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const manager = new ProjectCanvasManager(canvas, activePalette);
      managerRef.current = manager;
      setIsWebGLActive(true);
    } catch (err) {
      console.warn('[ProjectWebGLProvider] WebGL fallback activated:', err);
      setIsWebGLActive(false);
    }

    return () => {
      if (managerRef.current) {
        managerRef.current.dispose();
        managerRef.current = null;
      }
      setIsWebGLActive(false);
    };
  }, [prefersReduced]);

  // Synchronize palette changes with WebGL shader uniforms
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.updatePalette(activePalette);
    }
  }, [activePalette]);

  // Setup IntersectionObserver on #projects section to pause when out of view
  useEffect(() => {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection || !managerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry?.isIntersecting ?? false;
        if (managerRef.current) {
          managerRef.current.setVisibility(visible);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(projectsSection);
    return () => observer.disconnect();
  }, [isWebGLActive]);

  const registerProjectPortal = useCallback(
    (id: string, element: HTMLElement, effectType: number) => {
      if (managerRef.current) {
        managerRef.current.registerPlane({ id, domElement: element, effectType });
      }
      return () => {
        if (managerRef.current) {
          managerRef.current.unregisterPlane(id);
        }
      };
    },
    []
  );

  const setPortalHover = useCallback((id: string, isHovered: boolean) => {
    if (managerRef.current) {
      managerRef.current.setPlaneHover(id, isHovered);
    }
  }, []);

  const setPortalPointer = useCallback((id: string, uvX: number, uvY: number) => {
    if (managerRef.current) {
      managerRef.current.setPlanePointer(id, uvX, uvY);
    }
  }, []);

  return (
    <ProjectWebGLContext.Provider
      value={{
        registerProjectPortal,
        setPortalHover,
        setPortalPointer,
        isWebGLActive,
      }}
    >
      {/* Fixed Fullscreen Project WebGL Overlay (Hardware Accelerated, pointer-events-none) */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[15] transition-opacity duration-700 ${
          isWebGLActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {children}
    </ProjectWebGLContext.Provider>
  );
};
