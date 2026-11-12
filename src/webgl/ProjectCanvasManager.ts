/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { projectVertexShader, projectFragmentShader } from './shaders/projectShader';
import { createFocusFlowTexture, createVastraGoTexture } from './textures/projectTextures';
import { webglCoordinator, detectSoftwareGl } from './webglCoordinator';
import { scrollBus } from '../utils/scrollBus';
import { PaletteDefinition } from '../types/theme';

export interface RegisteredProjectPlane {
  id: string;
  domElement: HTMLElement;
  effectType: number; // 0.0: FocusFlow, 1.0: VastraGo
}

interface PlaneInternal {
  id: string;
  element: HTMLElement;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  material: THREE.ShaderMaterial;
  texture: THREE.CanvasTexture;
  effectType: number;
  pageTop: number;
  pageLeft: number;
  width: number;
  height: number;
  isHovered: boolean;
  targetHover: number;
  pointerUv: THREE.Vector2;
  targetPointerUv: THREE.Vector2;
}

export class ProjectCanvasManager {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.OrthographicCamera | null = null;
  private geometry: THREE.PlaneGeometry | null = null;

  private planes = new Map<string, PlaneInternal>();
  private activePalette: PaletteDefinition;
  private isVisible = true;
  private isSoftware = false;
  private unsubscribeTick: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement, initialPalette: PaletteDefinition) {
    this.canvas = canvas;
    this.activePalette = initialPalette;
    this.isSoftware = detectSoftwareGl();
    this.init();
  }

  private init() {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: !this.isSoftware,
        powerPreference: 'high-performance',
        depth: false,
        stencil: false,
      });

      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.autoClear = true;
      this.renderer.setPixelRatio(this.isSoftware ? 1 : Math.min(window.devicePixelRatio, 1.5));
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.scene = new THREE.Scene();

      // Orthographic camera calibrated 1:1 with CSS pixels
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      this.camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 100);
      this.camera.position.z = 10;

      // Single unit quad geometry scaled per mesh
      this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

      // Listen for window resize
      window.addEventListener('resize', this.handleResize, { passive: true });

      // Start tick subscription
      this.unsubscribeTick = webglCoordinator.subscribe(this.handleTick);
    } catch (err) {
      console.warn('[ProjectCanvasManager] Failed to initialize WebGL:', err);
    }
  }

  public setVisibility(visible: boolean) {
    this.isVisible = visible;
  }

  public updatePalette(palette: PaletteDefinition) {
    this.activePalette = palette;
    const prim = new THREE.Vector3(...palette.shaderUniforms.primaryVec3);
    const sec = new THREE.Vector3(...palette.shaderUniforms.secondaryVec3);
    const acc = new THREE.Vector3(...palette.shaderUniforms.accentVec3);
    const bg = new THREE.Vector3(...palette.shaderUniforms.backgroundVec3);

    this.planes.forEach((plane) => {
      plane.material.uniforms.uPrimaryColor.value.copy(prim);
      plane.material.uniforms.uSecondaryColor.value.copy(sec);
      plane.material.uniforms.uAccentColor.value.copy(acc);
      plane.material.uniforms.uBgColor.value.copy(bg);
    });
  }

  public registerPlane(config: RegisteredProjectPlane) {
    if (!this.scene || !this.geometry) return;

    // Create high-res procedural texture tailored to project
    const texture =
      config.effectType === 0
        ? createFocusFlowTexture(this.activePalette.colors)
        : createVastraGoTexture(this.activePalette.colors);

    const uniforms = {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollVelocity: { value: 0 },
      uEffectType: { value: config.effectType },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPrimaryColor: { value: new THREE.Vector3(...this.activePalette.shaderUniforms.primaryVec3) },
      uSecondaryColor: { value: new THREE.Vector3(...this.activePalette.shaderUniforms.secondaryVec3) },
      uAccentColor: { value: new THREE.Vector3(...this.activePalette.shaderUniforms.accentVec3) },
      uBgColor: { value: new THREE.Vector3(...this.activePalette.shaderUniforms.backgroundVec3) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: projectVertexShader,
      fragmentShader: projectFragmentShader,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(this.geometry, material);
    mesh.visible = false;
    this.scene.add(mesh);

    const internal: PlaneInternal = {
      id: config.id,
      element: config.domElement,
      mesh,
      material,
      texture,
      effectType: config.effectType,
      pageTop: 0,
      pageLeft: 0,
      width: 0,
      height: 0,
      isHovered: false,
      targetHover: 0,
      pointerUv: new THREE.Vector2(0.5, 0.5),
      targetPointerUv: new THREE.Vector2(0.5, 0.5),
    };

    this.planes.set(config.id, internal);
    this.measurePlane(internal);

    // Watch for size changes on the element
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        this.measureAllPlanes();
      });
    }
    this.resizeObserver.observe(config.domElement);
  }

  public unregisterPlane(id: string) {
    const plane = this.planes.get(id);
    if (!plane) return;

    if (this.resizeObserver) {
      this.resizeObserver.unobserve(plane.element);
    }

    if (this.scene) {
      this.scene.remove(plane.mesh);
    }

    plane.material.dispose();
    plane.texture.dispose();
    this.planes.delete(id);
  }

  public setPlaneHover(id: string, isHovered: boolean) {
    const plane = this.planes.get(id);
    if (plane) {
      plane.isHovered = isHovered;
      plane.targetHover = isHovered ? 1.0 : 0.0;
    }
  }

  public setPlanePointer(id: string, normalizedX: number, normalizedY: number) {
    const plane = this.planes.get(id);
    if (plane) {
      plane.targetPointerUv.set(normalizedX, normalizedY);
    }
  }

  private measurePlane(plane: PlaneInternal) {
    const rect = plane.element.getBoundingClientRect();
    const scrollY = scrollBus.getState().scroll;
    plane.pageTop = rect.top + scrollY;
    plane.pageLeft = rect.left;
    plane.width = rect.width;
    plane.height = rect.height;
    plane.material.uniforms.uResolution.value.set(rect.width, rect.height);
  }

  private measureAllPlanes() {
    this.planes.forEach((plane) => this.measurePlane(plane));
  }

  private handleResize = () => {
    if (!this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.isSoftware ? 1 : Math.min(window.devicePixelRatio, 1.5));

    const halfW = width / 2;
    const halfH = height / 2;
    this.camera.left = -halfW;
    this.camera.right = halfW;
    this.camera.top = halfH;
    this.camera.bottom = -halfH;
    this.camera.updateProjectionMatrix();

    this.measureAllPlanes();
  };

  private handleTick = (time: number, delta: number) => {
    if (!this.isVisible || !this.renderer || !this.scene || !this.camera) return;

    const scrollState = scrollBus.getState();
    const currentScroll = scrollState.scroll;
    const velocity = scrollState.velocity;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    let anyPlaneVisible = false;

    this.planes.forEach((plane) => {
      // Calculate current viewport position from cached page coordinates (ZERO DOM READS!)
      const viewportTop = plane.pageTop - currentScroll;
      const viewportLeft = plane.pageLeft;

      // Frustum culling check (100px buffer)
      const isVisibleInViewport =
        viewportTop + plane.height >= -100 && viewportTop <= viewportH + 100;

      if (!isVisibleInViewport) {
        plane.mesh.visible = false;
        return;
      }

      plane.mesh.visible = true;
      anyPlaneVisible = true;

      // Position quad: center of element relative to screen center
      const centerX = viewportLeft + plane.width / 2 - viewportW / 2;
      const centerY = -(viewportTop + plane.height / 2 - viewportH / 2);

      plane.mesh.position.set(centerX, centerY, 0);
      plane.mesh.scale.set(plane.width, plane.height, 1);

      // Smooth hover interpolation
      const currentHover = plane.material.uniforms.uHover.value;
      plane.material.uniforms.uHover.value += (plane.targetHover - currentHover) * Math.min(1.0, delta * 9.0);

      // Smooth pointer UV interpolation
      plane.pointerUv.lerp(plane.targetPointerUv, Math.min(1.0, delta * 12.0));
      plane.material.uniforms.uPointer.value.copy(plane.pointerUv);

      // Uniforms update
      plane.material.uniforms.uTime.value = time;
      plane.material.uniforms.uScrollVelocity.value = velocity;
    });

    if (anyPlaneVisible) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  public dispose() {
    window.removeEventListener('resize', this.handleResize);
    if (this.unsubscribeTick) {
      this.unsubscribeTick();
      this.unsubscribeTick = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    this.planes.forEach((plane) => {
      plane.material.dispose();
      plane.texture.dispose();
    });
    this.planes.clear();

    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    this.scene = null;
    this.camera = null;
  }
}
