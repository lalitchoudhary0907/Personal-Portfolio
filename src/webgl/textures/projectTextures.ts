/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export interface TexturePaletteColors {
  primary: string;
  secondary: string;
  accent: string;
  background?: string;
  text?: string;
  paper?: string;
  ink?: string;
}

/**
 * Creates an authentic high-resolution (1280x800) procedural texture
 * representing the FocusFlow Pomodoro Productivity Platform interface.
 */
export function createFocusFlowTexture(colors: TexturePaletteColors): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Deep architectural background
  ctx.fillStyle = '#06080e';
  ctx.fillRect(0, 0, 1280, 800);

  // Subtle dot grid background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let x = 40; x < 1280; x += 40) {
    for (let y = 40; y < 800; y += 40) {
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  }

  // Header Bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fillRect(60, 60, 1160, 56);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 60, 1160, 56);

  ctx.font = '600 16px "SF Mono", "Fira Code", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('FOCUSFLOW // v1.0', 90, 95);

  ctx.font = '500 13px "SF Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('POMODORO PRODUCTIVITY ENGINE · VERIFIED LIVE APP', 340, 95);

  ctx.fillStyle = colors.primary;
  ctx.beginPath();
  ctx.arc(1180, 88, 5, 0, Math.PI * 2);
  ctx.fill();

  // Central Pomodoro Dial
  const centerX = 640;
  const centerY = 440;
  const radius = 190;

  // Outer Tick Ring
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 5 === 0;
    const length = isMajor ? 14 : 7;
    const startR = radius + 25;
    const endR = startR + length;

    const x1 = centerX + Math.cos(angle) * startR;
    const y1 = centerY + Math.sin(angle) * startR;
    const x2 = centerX + Math.cos(angle) * endR;
    const y2 = centerY + Math.sin(angle) * endR;

    ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = isMajor ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    if (isMajor) {
      const numR = endR + 18;
      const numX = centerX + Math.cos(angle) * numR;
      const numY = centerY + Math.sin(angle) * numR + 4;
      ctx.font = '500 11px monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'center';
      const label = i === 0 ? '60' : String(i).padStart(2, '0');
      ctx.fillText(label, numX, numY);
    }
  }

  // Background Dial Arc
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Active Progress Arc (25 minutes elapsed)
  ctx.beginPath();
  const startAngle = -Math.PI / 2;
  const progressAngle = startAngle + (25 / 60) * Math.PI * 2;
  ctx.arc(centerX, centerY, radius, startAngle, progressAngle);
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Arc Tip Glow Indicator
  const tipX = centerX + Math.cos(progressAngle) * radius;
  const tipY = centerY + Math.sin(progressAngle) * radius;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Central Digital Time Display
  ctx.textAlign = 'center';
  ctx.font = '700 82px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('25:00', centerX, centerY + 20);

  ctx.font = '700 14px "SF Mono", monospace';
  ctx.fillStyle = colors.primary;
  ctx.letterSpacing = '4px';
  ctx.fillText('DEEP WORK SESSION', centerX, centerY + 65);

  // Bottom Status Pills
  ctx.font = '500 12px "SF Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('CYCLE 01 / 04  ·  AUDIO CHIMES ENABLED  ·  LOCALSTORAGE SYNCHRONIZED', centerX, 730);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates an authentic high-resolution (1280x800) procedural texture
 * representing the VastraGo Parametric Tailoring CAD Blueprint interface.
 */
export function createVastraGoTexture(colors: TexturePaletteColors): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Dark architectural slate background
  ctx.fillStyle = '#06070c';
  ctx.fillRect(0, 0, 1280, 800);

  // Technical blueprint grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 30; x < 1280; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 800);
    ctx.stroke();
  }
  for (let y = 30; y < 800; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }

  // Major Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
  for (let x = 120; x < 1280; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 800);
    ctx.stroke();
  }
  for (let y = 120; y < 800; y += 120) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }

  // Blueprint Top Metadata Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fillRect(60, 50, 1160, 50);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.strokeRect(60, 50, 1160, 50);

  ctx.font = '600 15px "SF Mono", monospace';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('VASTRAGO // SYSTEM BLUEPRINT SPECIFICATION', 90, 82);

  ctx.font = '500 12px "SF Mono", monospace';
  ctx.fillStyle = colors.accent;
  ctx.fillText('PARAMETRIC CAD · CONCEPT SPECIFICATION (UNDER PROGRESS)', 580, 82);

  // Anatomical Garment Vector Wireframe
  const cx = 640;
  const cy = 420;

  ctx.strokeStyle = colors.secondary;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);

  // Center Datum Axis
  ctx.beginPath();
  ctx.moveTo(cx, 160);
  ctx.lineTo(cx, 680);
  ctx.stroke();
  ctx.setLineDash([]);

  // Jacket / Garment Silhouette Outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  // Collar
  ctx.moveTo(cx - 70, 220);
  ctx.lineTo(cx, 270);
  ctx.lineTo(cx + 70, 220);
  // Shoulders
  ctx.lineTo(cx + 250, 260);
  // Right Sleeve
  ctx.lineTo(cx + 310, 520);
  ctx.lineTo(cx + 240, 540);
  ctx.lineTo(cx + 200, 370);
  // Right Torso
  ctx.lineTo(cx + 180, 640);
  // Bottom Hem
  ctx.lineTo(cx - 180, 640);
  // Left Torso
  ctx.lineTo(cx - 200, 370);
  // Left Sleeve
  ctx.lineTo(cx - 240, 540);
  ctx.lineTo(cx - 310, 520);
  // Left Shoulder
  ctx.lineTo(cx - 250, 260);
  ctx.closePath();
  ctx.stroke();

  // Dimension Markers & Nodes
  const drawDimension = (x1: number, y1: number, x2: number, y2: number, label: string) => {
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // End Crossbars
    ctx.beginPath();
    ctx.moveTo(x1, y1 - 6);
    ctx.lineTo(x1, y1 + 6);
    ctx.moveTo(x2, y2 - 6);
    ctx.lineTo(x2, y2 + 6);
    ctx.stroke();

    // Measurement Pill
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 10;
    ctx.font = '600 12px "SF Mono", monospace';
    ctx.fillStyle = colors.accent;
    ctx.textAlign = 'center';
    ctx.fillText(label, midX, midY);
  };

  drawDimension(cx - 250, 210, cx + 250, 210, 'SHOULDER SPAN: 46.5 CM (SAMPLE SPEC)');
  drawDimension(cx - 190, 380, cx + 190, 380, 'CHEST ARC: 98.0 CM (SAMPLE SPEC)');
  drawDimension(cx - 170, 660, cx + 170, 660, 'HEM PERIMETER: 104.0 CM (SAMPLE SPEC)');

  // Dimension Nodes
  const drawNode = (x: number, y: number, name: string) => {
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '500 10px "SF Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.fillText(name, x + 12, y + 4);
  };

  drawNode(cx - 250, 260, 'NODE_S01 [ACROMION]');
  drawNode(cx + 250, 260, 'NODE_S02 [ACROMION]');
  drawNode(cx, 270, 'NODE_C01 [SUPRASTERNAL]');
  drawNode(cx - 190, 380, 'NODE_T01 [THORACIC_L]');
  drawNode(cx + 190, 380, 'NODE_T02 [THORACIC_R]');

  // Bottom Blueprint Specification
  ctx.font = '500 12px "SF Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'center';
  ctx.fillText('DECENTRALIZED ARTISAN MATCHING PROTOCOL · ALGORITHMIC FIT PIPELINE (UNDER PROGRESS)', cx, 740);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
