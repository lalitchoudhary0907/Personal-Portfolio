/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Centralized WebGL Lifecycle & Animation Frame Coordinator.
 * Prevents duplicate requestAnimationFrame loops and manages tab visibility,
 * frame pacing, and unified render subscription across the application.
 */

type FrameCallback = (time: number, delta: number) => void;

class WebGLCoordinator {
  private callbacks = new Set<FrameCallback>();
  private rafId: number | null = null;
  private lastTime = 0;
  private isTabVisible = true;
  private isRunning = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isTabVisible = !document.hidden;
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = () => {
    this.isTabVisible = !document.hidden;
    if (this.isTabVisible) {
      this.lastTime = performance.now();
      this.startLoop();
    } else {
      this.stopLoop();
    }
  };

  public subscribe(cb: FrameCallback): () => void {
    this.callbacks.add(cb);
    if (!this.isRunning && this.callbacks.size > 0 && this.isTabVisible) {
      this.lastTime = performance.now();
      this.startLoop();
    }

    return () => {
      this.callbacks.delete(cb);
      if (this.callbacks.size === 0) {
        this.stopLoop();
      }
    };
  }

  private tick = (currentTime: number) => {
    if (!this.isRunning) return;

    const delta = Math.min((currentTime - this.lastTime) / 1000, 0.1); // clamp delta to 100ms
    this.lastTime = currentTime;
    const time = currentTime * 0.001;

    for (const cb of this.callbacks) {
      try {
        cb(time, delta);
      } catch (err) {
        // Prevent one faulty subscriber from killing the entire loop
        console.warn('[WebGLCoordinator] subscriber error:', err);
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  };

  private startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stopLoop() {
    this.isRunning = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

export const webglCoordinator = new WebGLCoordinator();

/**
 * Helper to detect software WebGL renderers (SwiftShader, llvmpipe, WARP)
 * to adapt rendering quality without altering layout or DOM semantics.
 */
export const detectSoftwareGl = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return true;

    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(String(renderer));
  } catch {
    return false;
  }
};
