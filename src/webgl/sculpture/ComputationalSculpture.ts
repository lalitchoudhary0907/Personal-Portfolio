/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface SculptureUpdateParams {
  delta: number;
  time: number;
  pointer: { x: number; y: number };
  dragDelta: { x: number; y: number };
  isHovered: boolean;
  isReducedMotion: boolean;
  scrollProgress?: number;
  scrollVelocity?: number;
  colors: {
    primary: THREE.Color;
    secondary: THREE.Color;
    accent: THREE.Color;
  };
}

export class ComputationalSculpture {
  public group: THREE.Group;

  // Primary geometric components
  private monolithMesh: THREE.Mesh;
  private monolithInnerCore: THREE.Mesh;
  private latticeNodes: THREE.InstancedMesh;
  private latticeLines: THREE.LineSegments;
  private outerRing: THREE.Mesh;
  private innerRing: THREE.Mesh;
  private particleCloud: THREE.Points;

  // Materials for uniform/color updates
  private glassMaterial: THREE.MeshPhysicalMaterial;
  private coreMaterial: THREE.MeshStandardMaterial;
  private nodeMaterial: THREE.MeshStandardMaterial;
  private lineMaterial: THREE.LineBasicMaterial;
  private ringMaterial: THREE.MeshStandardMaterial;
  private particleMaterial: THREE.PointsMaterial;

  // Integrated lights
  public coreLight: THREE.PointLight;
  public rimLightA: THREE.DirectionalLight;
  public rimLightB: THREE.DirectionalLight;

  // Motion physics state
  private currentRotation = { x: 0.22, y: -0.35, z: 0 };
  private targetRotation = { x: 0.22, y: -0.35, z: 0 };
  private floatOffset = 0;

  // Node positions cache for animation
  private nodeCount = 24;
  private baseNodePositions: THREE.Vector3[] = [];
  private dummy = new THREE.Object3D();

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'ComputationalSculpture';

    // ----------------------------------------------------
    // 1. Refractive Chamfered Crystal Monolith (Octagonal Obelisk)
    // ----------------------------------------------------
    const shape = new THREE.Shape();
    const w = 0.65;
    const d = 0.38;
    const c = 0.16; // 45-degree chamfer
    shape.moveTo(-w + c, -d);
    shape.lineTo(w - c, -d);
    shape.lineTo(w, -d + c);
    shape.lineTo(w, d - c);
    shape.lineTo(w - c, d);
    shape.lineTo(-w + c, d);
    shape.lineTo(-w, d - c);
    shape.lineTo(-w, -d + c);
    shape.closePath();

    const monolithGeom = new THREE.ExtrudeGeometry(shape, {
      depth: 3.2,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 3,
      bevelSize: 0.12,
      bevelThickness: 0.14,
    });
    // Center geometry so rotation pivot is true geometric centroid
    monolithGeom.center();

    // High-refraction, crystal optical glass material with chromatic dispersion
    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      roughness: 0.02,
      metalness: 0.0,
      transmission: 0.98, // ultra-clear glass transmission
      ior: 1.54, // optical crystal refractive index
      thickness: 2.2, // tangible glass physical volume
      specularIntensity: 1.2,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 0.42, // chromatic dispersion sheen
      iridescenceIOR: 1.33,
      iridescenceThicknessMinimum: 120,
      iridescenceThicknessMaximum: 380,
      attenuationColor: new THREE.Color('#d4e4ff'),
      attenuationDistance: 3.2,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
    });

    this.monolithMesh = new THREE.Mesh(monolithGeom, this.glassMaterial);
    this.monolithMesh.castShadow = true;
    this.monolithMesh.receiveShadow = true;
    this.group.add(this.monolithMesh);

    // ----------------------------------------------------
    // 2. Inner Neural Core Polyhedron (Algorithmic Nucleus)
    // ----------------------------------------------------
    const coreGeom = new THREE.IcosahedronGeometry(0.52, 1);
    this.coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#688BFF'),
      emissive: new THREE.Color('#688BFF'),
      emissiveIntensity: 1.4,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: true,
    });
    this.monolithInnerCore = new THREE.Mesh(coreGeom, this.coreMaterial);
    this.group.add(this.monolithInnerCore);

    // ----------------------------------------------------
    // 3. Procedural Neural Lattice Nodes & Synaptic Links
    // ----------------------------------------------------
    const nodeGeom = new THREE.SphereGeometry(0.042, 14, 14);
    this.nodeMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#B5FCDE'),
      emissive: new THREE.Color('#B5FCDE'),
      emissiveIntensity: 1.8,
      roughness: 0.08,
      metalness: 0.92,
    });
    this.latticeNodes = new THREE.InstancedMesh(nodeGeom, this.nodeMaterial, this.nodeCount);

    const linePositions: number[] = [];
    for (let i = 0; i < this.nodeCount; i++) {
      const theta = (i / this.nodeCount) * Math.PI * 4;
      const radius = 0.42 + Math.sin(i * 1.6) * 0.28;
      const y = -1.15 + (i / (this.nodeCount - 1)) * 2.3;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius * 0.65;

      const pos = new THREE.Vector3(x, y, z);
      this.baseNodePositions.push(pos);

      this.dummy.position.copy(pos);
      this.dummy.scale.setScalar(1.0);
      this.dummy.updateMatrix();
      this.latticeNodes.setMatrixAt(i, this.dummy.matrix);

      if (i > 0) {
        const prev = this.baseNodePositions[i - 1];
        linePositions.push(prev.x, prev.y, prev.z, pos.x, pos.y, pos.z);
      }
      if (i > 2 && i % 3 === 0) {
        const jump = this.baseNodePositions[i - 3];
        linePositions.push(jump.x, jump.y, jump.z, pos.x, pos.y, pos.z);
      }
    }
    this.latticeNodes.instanceMatrix.needsUpdate = true;
    this.group.add(this.latticeNodes);

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color('#A6B8DD'),
      transparent: true,
      opacity: 0.6,
    });
    this.latticeLines = new THREE.LineSegments(lineGeom, this.lineMaterial);
    this.group.add(this.latticeLines);

    // ----------------------------------------------------
    // 4. Polished Gyroscopic Coordinate Rings
    // ----------------------------------------------------
    const outerRingGeom = new THREE.TorusGeometry(1.85, 0.018, 16, 96);
    const innerRingGeom = new THREE.TorusGeometry(1.48, 0.014, 16, 80);

    this.ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#A6B8DD'),
      emissive: new THREE.Color('#688BFF'),
      emissiveIntensity: 0.4,
      roughness: 0.12,
      metalness: 0.92,
    });

    this.outerRing = new THREE.Mesh(outerRingGeom, this.ringMaterial);
    this.innerRing = new THREE.Mesh(innerRingGeom, this.ringMaterial);

    this.outerRing.rotation.x = Math.PI * 0.38;
    this.innerRing.rotation.y = Math.PI * 0.42;

    this.group.add(this.outerRing);
    this.group.add(this.innerRing);

    // ----------------------------------------------------
    // 5. Ambient Quantum Particles (Clean, Restrained)
    // ----------------------------------------------------
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = Math.cbrt(Math.random()) * 2.1 + 0.8;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 1.1;
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    this.particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#B5FCDE'),
      size: 0.038,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    this.particleCloud = new THREE.Points(particleGeom, this.particleMaterial);
    this.group.add(this.particleCloud);

    // ----------------------------------------------------
    // 6. High-Contrast Studio Lighting Rig
    // ----------------------------------------------------
    this.coreLight = new THREE.PointLight('#688BFF', 5.5, 7, 1.6);
    this.coreLight.position.set(0, 0, 0);
    this.group.add(this.coreLight);

    this.rimLightA = new THREE.DirectionalLight('#B5FCDE', 3.8);
    this.rimLightA.position.set(4, 5, 4);
    this.group.add(this.rimLightA);

    this.rimLightB = new THREE.DirectionalLight('#A6B8DD', 2.8);
    this.rimLightB.position.set(-4, -3, -3);
    this.group.add(this.rimLightB);
  }

  /**
   * Physics, orientation, and color synchronization per frame
   */
  public update(params: SculptureUpdateParams): void {
    const { delta, time, pointer, dragDelta, isHovered, isReducedMotion, colors } = params;

    // Synchronize material colors smoothly
    this.glassMaterial.specularColor.lerp(colors.primary, 0.08);
    this.glassMaterial.attenuationColor.lerp(colors.secondary, 0.08);

    this.coreMaterial.color.lerp(colors.primary, 0.08);
    this.coreMaterial.emissive.lerp(colors.primary, 0.08);

    this.nodeMaterial.color.lerp(colors.accent, 0.08);
    this.nodeMaterial.emissive.lerp(colors.accent, 0.08);

    this.lineMaterial.color.lerp(colors.secondary, 0.08);
    this.ringMaterial.color.lerp(colors.secondary, 0.08);
    this.ringMaterial.emissive.lerp(colors.primary, 0.08);
    this.particleMaterial.color.lerp(colors.accent, 0.08);

    this.coreLight.color.lerp(colors.primary, 0.08);
    this.rimLightA.color.lerp(colors.accent, 0.08);
    this.rimLightB.color.lerp(colors.secondary, 0.08);

    if (isReducedMotion) {
      this.group.rotation.set(0.18, -0.28, 0);
      this.group.position.y = 0;
      return;
    }

    // Apply drag delta with smooth inertia
    if (Math.abs(dragDelta.x) > 0.001 || Math.abs(dragDelta.y) > 0.001) {
      this.targetRotation.y += dragDelta.x * 2.2;
      this.targetRotation.x += dragDelta.y * 2.2;
    } else {
      const pointerTargetY = pointer.x * 0.42;
      const pointerTargetX = -pointer.y * 0.32;

      const idlePrecessionY = time * 0.2;
      const idlePrecessionX = Math.sin(time * 0.3) * 0.07;

      this.targetRotation.y = idlePrecessionY + pointerTargetY;
      this.targetRotation.x = 0.2 + idlePrecessionX + pointerTargetX;
    }

    // Spring damping
    const spring = isHovered ? 0.08 : 0.045;
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * spring;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * spring;

    const scrollTilt = (params.scrollProgress ?? 0) * 0.38;
    const scrollZ = -(params.scrollProgress ?? 0) * 0.75;

    this.group.rotation.x = this.currentRotation.x + scrollTilt;
    this.group.rotation.y = this.currentRotation.y;
    this.group.position.z = scrollZ;

    // Organic floating breathing
    this.floatOffset = Math.sin(time * 0.8) * 0.055;
    this.group.position.y = this.floatOffset;

    // Counter-rotation of core and orbital rings
    this.monolithInnerCore.rotation.x = -time * 0.4;
    this.monolithInnerCore.rotation.y = time * 0.58;

    this.outerRing.rotation.z = time * 0.22;
    this.innerRing.rotation.x = -time * 0.28;

    // Core light pulse
    this.coreLight.intensity = 5.0 + Math.sin(time * 2.2) * 1.0;

    // Pulsing neural lattice nodes
    for (let i = 0; i < this.nodeCount; i++) {
      const base = this.baseNodePositions[i];
      const pulse = 1.0 + Math.sin(time * 2.2 + i * 0.7) * 0.22;
      this.dummy.position.set(
        base.x * (1.0 + Math.sin(time * 1.1 + i) * 0.035),
        base.y + Math.sin(time * 1.4 + i * 0.4) * 0.025,
        base.z * (1.0 + Math.cos(time * 1.1 + i) * 0.035)
      );
      this.dummy.scale.setScalar(pulse);
      this.dummy.updateMatrix();
      this.latticeNodes.setMatrixAt(i, this.dummy.matrix);
    }
    this.latticeNodes.instanceMatrix.needsUpdate = true;

    // Gentle particle cloud rotation
    this.particleCloud.rotation.y = -time * 0.06;
  }

  public resetOrientation(): void {
    this.targetRotation = { x: 0.22, y: -0.35, z: 0 };
  }

  public dispose(): void {
    this.monolithMesh.geometry.dispose();
    this.glassMaterial.dispose();

    this.monolithInnerCore.geometry.dispose();
    this.coreMaterial.dispose();

    this.latticeNodes.geometry.dispose();
    this.nodeMaterial.dispose();

    this.latticeLines.geometry.dispose();
    this.lineMaterial.dispose();

    this.outerRing.geometry.dispose();
    this.innerRing.geometry.dispose();
    this.ringMaterial.dispose();

    this.particleCloud.geometry.dispose();
    this.particleMaterial.dispose();
  }
}
