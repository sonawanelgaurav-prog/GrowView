import { VideoAnimationPresetId } from '../types';

/**
 * 🎬 Professional Video Motion & Animation Engine
 * Renders complete video frame with BOTH dynamic physical poster motion
 * (3D Card Float & Tilt, Camera Ken Burns Zoom, Heartbeat Pulses, Rhythmic Shake, Parallax)
 * AND cinematic particle/lighting overlays for all 20 animation presets!
 */
export function renderAnimatedVideoFrame(
  ctx: CanvasRenderingContext2D,
  baseCanvas: HTMLCanvasElement | HTMLImageElement,
  presetId: VideoAnimationPresetId,
  timeSec: number,
  durationSec: number,
  width: number,
  height: number,
  primaryColor: string = '#f59e0b',
  accentColor: string = '#ec4899'
): void {
  const t = timeSec;
  const progress = durationSec > 0 ? (t / durationSec) % 1 : 0;

  // Clear frame completely
  ctx.clearRect(0, 0, width, height);
  ctx.save();

  switch (presetId) {
    case 'floating-3d-tilt': {
      // 20. 3D Card Float & Swing (3D कार्ड फ्लोट आणि स्विंग)
      // Deep luxury gradient background with floating glowing ambient orbs
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.85);
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(0.55, '#0f172a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient bokeh floating particles in the 3D space
      for (let i = 0; i < 14; i++) {
        const orbX = (width * 0.08 + (i * 137.5 + t * 18) % (width * 0.84));
        const orbY = (height * 0.08 + (i * 91.3 + Math.sin(t * 1.5 + i) * 35) % (height * 0.84));
        const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 30 + i * 3);
        orbGrad.addColorStop(0, i % 2 === 0 ? 'rgba(245, 158, 11, 0.22)' : 'rgba(168, 85, 247, 0.22)');
        orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orbX, orbY, 30 + i * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Poster Card 3D Perspective Motion & Swing!
      ctx.save();
      const cx = width / 2;
      const cy = height / 2;
      ctx.translate(cx, cy);

      // Distinct visible 3D card tilt & rocking
      const swingAngle = Math.sin(t * 1.8) * 0.045; // ~2.6 degrees rocking
      ctx.rotate(swingAngle);

      // Vertical up-down floating wave
      const floatY = Math.sin(t * 2.2) * 20;
      const floatX = Math.cos(t * 1.4) * 10;
      ctx.translate(floatX, floatY);

      // Card scale breathing (88% to 92% so borders float in frame)
      const cardScale = 0.89 + Math.sin(t * 1.6) * 0.025;
      ctx.scale(cardScale, cardScale);

      // Deep realistic floating drop-shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 42 + Math.sin(t * 2.2) * 12;
      ctx.shadowOffsetY = 30 - floatY * 0.4;
      ctx.shadowOffsetX = -floatX * 0.4;

      // Draw poster card centered
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);

      // Remove shadow for overlays
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Glowing card border edge
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(t * 3) * 0.25})`;
      ctx.lineWidth = 5;
      ctx.strokeRect(-width / 2 + 2, -height / 2 + 2, width - 4, height - 4);

      // Luminous diagonal light sheen sweeping across the card
      const sweepProgress = ((t * 0.4) % 1.8) - 0.4;
      const sweepX = sweepProgress * width;
      const sheenGrad = ctx.createLinearGradient(sweepX - 160, -height / 2, sweepX + 160, height / 2);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sheenGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.25)');
      sheenGrad.addColorStop(0.5, 'rgba(255, 245, 200, 0.55)');
      sheenGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.25)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(-width / 2, -height / 2, width, height);

      ctx.restore();
      break;
    }

    case 'ken-burns': {
      // 2. Cinematic Ken Burns Zoom & Pan (सिनेमॅटिक झूम व पॅन)
      const zoom = 1.02 + progress * 0.16;
      const panX = Math.sin(t * 0.5) * (width * 0.04);
      const panY = Math.cos(t * 0.4) * (height * 0.03);

      ctx.save();
      ctx.translate(width / 2 + panX, height / 2 + panY);
      ctx.scale(zoom, zoom);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const vig = ctx.createRadialGradient(width / 2, height / 2, width * 0.35, width / 2, height / 2, width * 0.75);
      vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vig.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      const lightX = width * (0.3 + 0.4 * Math.sin(t * 0.35));
      const lightY = height * 0.25;
      const lightGrad = ctx.createRadialGradient(lightX, lightY, 10, lightX, lightY, width * 0.5);
      lightGrad.addColorStop(0, 'rgba(255, 230, 180, 0.2)');
      lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'pulse-glow': {
      // 1. Heartbeat Pulse & Radiant Glow (धडकणारा प्रकाश व पल्स)
      const beatCycle = (t * 1.6) % 1;
      let pulse = 0;
      if (beatCycle < 0.16) {
        pulse = Math.sin((beatCycle / 0.16) * Math.PI) * 0.045;
      } else if (beatCycle >= 0.22 && beatCycle < 0.38) {
        pulse = Math.sin(((beatCycle - 0.22) / 0.16) * Math.PI) * 0.028;
      }

      const pulseScale = 1.0 + pulse;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(pulseScale, pulseScale);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        const waveProgress = (t * 0.75 + w * (1 / waveCount)) % 1;
        const waveRadius = waveProgress * width * 0.7;
        const waveAlpha = Math.max(0, 1 - waveProgress) * 0.5;
        ctx.strokeStyle = `rgba(245, 158, 11, ${waveAlpha})`;
        ctx.lineWidth = 5 * (1 - waveProgress) + 1;
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.45, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      const glowAlpha = 0.35 + (pulse / 0.045) * 0.65;
      ctx.strokeStyle = `rgba(251, 191, 36, ${glowAlpha})`;
      ctx.lineWidth = 6 + pulse * 80;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      break;
    }

    case 'golden-sparkles': {
      // 3. Golden Sparkles & Floating Stars (सुवर्ण कण चमक व स्पार्कल्स)
      const scale = 1.0 + Math.sin(t * 1.2) * 0.015;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      for (let i = 0; i < 45; i++) {
        const seed = i * 79.19;
        const speed = 40 + (i % 5) * 18;
        const px = (seed * 13.7 + Math.sin(t * 1.5 + i) * 25) % width;
        const py = ((seed * 23.3 - t * speed + height * 5) % (height + 40)) - 20;
        const size = 2 + (i % 4) * 1.8;
        const alpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 3 + seed));

        ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();

        if (i % 2 === 0) {
          const starLen = size * 2.8 * alpha;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px - starLen, py);
          ctx.lineTo(px + starLen, py);
          ctx.moveTo(px, py - starLen);
          ctx.lineTo(px, py + starLen);
          ctx.stroke();
        }
      }

      const streakT = (t * 0.35) % 2.0;
      if (streakT < 1.0) {
        const sx = streakT * width * 1.6 - width * 0.3;
        const sGrad = ctx.createLinearGradient(sx - 90, 0, sx + 90, height);
        sGrad.addColorStop(0, 'rgba(253, 224, 71, 0)');
        sGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.28)');
        sGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = sGrad;
        ctx.fillRect(0, 0, width, height);
      }
      break;
    }

    case 'diya-float': {
      // 4. Diya & Lantern Float (दीप ज्योती व कंदील फ्लोट)
      const flicker = 1.0 + Math.sin(t * 16) * 0.04 + Math.sin(t * 29) * 0.02;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(1.006 + (flicker - 1) * 0.25, 1.006 + (flicker - 1) * 0.25);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const fireGrad = ctx.createLinearGradient(0, height, 0, height * 0.65);
      fireGrad.addColorStop(0, `rgba(249, 115, 22, ${0.4 * flicker})`);
      fireGrad.addColorStop(0.5, `rgba(253, 224, 71, ${0.16 * flicker})`);
      fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fireGrad;
      ctx.fillRect(0, 0, width, height);

      const diyaCount = 6;
      for (let i = 0; i < diyaCount; i++) {
        const baseX = (width / (diyaCount + 1)) * (i + 1);
        const dy = Math.sin(t * 2.2 + i * 1.5) * 14;
        const flameY = height * 0.81 + dy;

        const halo = ctx.createRadialGradient(baseX, flameY, 3, baseX, flameY, 45 * flicker);
        halo.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        halo.addColorStop(0.35, 'rgba(249, 115, 22, 0.55)');
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(baseX, flameY, 45 * flicker, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(baseX, flameY + 12, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(baseX, flameY - 16 * flicker);
        ctx.quadraticCurveTo(baseX + 7, flameY, baseX, flameY + 6);
        ctx.quadraticCurveTo(baseX - 7, flameY, baseX, flameY - 16 * flicker);
        ctx.fill();
      }
      break;
    }

    case 'confetti-burst': {
      // 5. Festive Confetti Burst (रंगबेरंगी गुलाल व फुले वर्षाव)
      const blastCycle = t % 2.5;
      const bounce = blastCycle < 0.25 ? Math.sin((blastCycle / 0.25) * Math.PI) * 0.04 : 0;

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(1.0 + bounce, 1.0 + bounce);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const confettiColors = ['#f43f5e', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#eab308'];
      for (let i = 0; i < 55; i++) {
        const seed = i * 113.3;
        const speed = 70 + (i % 6) * 30;
        const py = ((seed * 17.1 + t * speed) % (height + 40)) - 20;
        const px = (seed * 29.3 + Math.sin(t * 3 + i) * 40) % width;
        const rot = t * 4 + seed;
        const color = confettiColors[i % confettiColors.length];

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        ctx.fillStyle = color;
        ctx.fillRect(-6, -3, 12, 6);
        ctx.restore();
      }
      break;
    }

    case 'saffron-wave': {
      // 6. Saffron Silk Waves (भगवा ध्वज व रेशमी लहरी)
      const wavePush = Math.sin(t * 2.0) * 8;
      ctx.save();
      ctx.translate(width / 2 + wavePush, height / 2);
      ctx.scale(1.01, 1.01);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      for (let w = 0; w < 3; w++) {
        const waveT = t * 2.5 + w * 1.8;
        const waveY = height * 0.25 + w * (height * 0.25);
        ctx.strokeStyle = `rgba(234, 88, 12, ${0.28 + Math.sin(waveT) * 0.12})`;
        ctx.lineWidth = 32;
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x <= width; x += 30) {
          const y = waveY + Math.sin((x / width) * Math.PI * 3 + waveT) * 28;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      break;
    }

    case 'text-slide-up': {
      // 7. Typography Slide & Reveal (मराठी मजकूर स्लाईड अप)
      const slideProgress = (t * 0.6) % 1.5;
      const cardOffsetY = slideProgress < 0.3 ? (1 - slideProgress / 0.3) * 30 : 0;
      ctx.save();
      ctx.translate(width / 2, height / 2 - cardOffsetY);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const sweepY = ((t * 0.4) % 1.4) * height - height * 0.2;
      const grad = ctx.createLinearGradient(0, sweepY - 50, 0, sweepY + 50);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'chakra-spin': {
      // 8. Divine Chakra Spin (सुदर्शन चक्र / प्रभामंडळ)
      const chakraRot = t * 0.8;
      const cx = width / 2;
      const cy = height * 0.42;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(chakraRot);
      const rayCount = 16;
      for (let r = 0; r < rayCount; r++) {
        const angle = (Math.PI * 2 / rayCount) * r;
        ctx.fillStyle = r % 2 === 0 ? 'rgba(251, 191, 36, 0.16)' : 'rgba(245, 158, 11, 0.08)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, width * 0.75, angle - 0.08, angle + 0.08);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(1.008 + Math.sin(t * 1.5) * 0.008, 1.008 + Math.sin(t * 1.5) * 0.008);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(chakraRot);
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, width * 0.32, 0, Math.PI * 2);
      ctx.stroke();
      for (let s = 0; s < 12; s++) {
        const sAngle = (Math.PI * 2 / 12) * s;
        const sx = Math.cos(sAngle) * width * 0.32;
        const sy = Math.sin(sAngle) * width * 0.32;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'gold-light-sweep': {
      // 9. Royal Shimmer Sweep (रॉयल गोल्ड लाईट स्वीप)
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(1.01, 1.01);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const sweepT = ((t * 0.55) % 1.6) - 0.3;
      const sweepX = sweepT * width * 1.4;

      const sweepGrad = ctx.createLinearGradient(sweepX - 130, 0, sweepX + 130, height);
      sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sweepGrad.addColorStop(0.4, 'rgba(253, 224, 71, 0.3)');
      sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)');
      sweepGrad.addColorStop(0.6, 'rgba(251, 191, 36, 0.3)');
      sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'flower-shower': {
      // 10. Fresh Petal Shower (झेंडू-गुलाब पुष्पवृष्टी)
      const gentleSway = Math.sin(t * 1.5) * 6;
      ctx.save();
      ctx.translate(width / 2 + gentleSway, height / 2);
      ctx.scale(1.01, 1.01);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const petalColors = ['#f59e0b', '#fbbf24', '#f43f5e', '#e11d48', '#fb923c'];
      for (let i = 0; i < 35; i++) {
        const seed = i * 83.7;
        const fallSpeed = 50 + (i % 4) * 20;
        const py = ((seed * 19.3 + t * fallSpeed) % (height + 50)) - 30;
        const px = (seed * 31.7 + Math.sin(t * 2 + i) * 35) % width;
        const rotation = t * 3 + seed;
        const color = petalColors[i % petalColors.length];

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rotation);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      break;
    }

    case 'cinematic-smoke': {
      // 11. Royal Smoke & Fire (राजेशाही धूर व अग्नी प्रभाव)
      ctx.drawImage(baseCanvas, 0, 0, width, height);

      const fireGlow = ctx.createLinearGradient(0, height, 0, height * 0.65);
      fireGlow.addColorStop(0, 'rgba(194, 65, 12, 0.45)');
      fireGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = fireGlow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 35; i++) {
        const seed = i * 67.3;
        const speed = 45 + (i % 4) * 25;
        const py = ((seed * 19.1 - t * speed + height * 5) % (height + 30)) - 15;
        const px = (seed * 43.7 + Math.sin(t * 2.5 + i) * 25) % width;
        const size = 1.5 + (i % 3) * 1.5;
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 4 + seed));

        ctx.fillStyle = i % 2 === 0 ? `rgba(251, 146, 60, ${alpha})` : `rgba(253, 224, 71, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'blessing-auras': {
      // 12. Divine Blessing Aura (दैवी आशीर्वाद व प्रकाश किरणे)
      const cx = width / 2;
      const cy = height * 0.4;
      const rot = t * 0.6;

      ctx.save();
      ctx.translate(width / 2, height / 2 + Math.sin(t * 1.8) * 5);
      ctx.scale(1.01, 1.01);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      const rays = 12;
      for (let r = 0; r < rays; r++) {
        const angle = (Math.PI * 2 / rays) * r;
        ctx.fillStyle = 'rgba(254, 240, 138, 0.2)';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, width * 0.8, angle - 0.1, angle + 0.1);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'neon-border-pulse': {
      // 13. Cyber Neon Border Pulse (निऑन बॉर्डर ग्लिट्स व पल्स)
      const beat = Math.pow(Math.sin(t * 4), 2);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(1.0 + beat * 0.02, 1.0 + beat * 0.02);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const neonColors = ['#06b6d4', '#ec4899', '#8b5cf6', '#10b981'];
      const curColor = neonColors[Math.floor(t * 1.5) % neonColors.length];

      ctx.strokeStyle = curColor;
      ctx.lineWidth = 6 + beat * 6;
      ctx.shadowColor = curColor;
      ctx.shadowBlur = 18;
      ctx.strokeRect(12, 12, width - 24, height - 24);
      ctx.shadowBlur = 0;
      break;
    }

    case 'parallax-drift': {
      // 14. 3D Parallax Drift (3D पॅरलॅक्स पार्श्वभूमी ड्रिफ्ट)
      const driftX = Math.sin(t * 1.2) * 22;
      const driftY = Math.cos(t * 0.9) * 14;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + driftX, height / 2 + driftY);
      ctx.scale(0.93, 0.93);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
      ctx.shadowBlur = 32;
      ctx.shadowOffsetX = -driftX * 0.6;
      ctx.shadowOffsetY = -driftY * 0.6;
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();
      break;
    }

    case 'beat-flash': {
      // 15. Festival Rhythm Flash (ढोल-ताशा रिदम फ्लॅश)
      const beatInterval = 60 / 126; // 126 BPM
      const beatPhase = (t % beatInterval) / beatInterval;
      const beatImpact = Math.max(0, 1 - beatPhase * 3.5);
      const zoomBounce = 1.0 + beatImpact * 0.038;

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoomBounce, zoomBounce);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      if (beatImpact > 0.1) {
        ctx.fillStyle = `rgba(255, 255, 255, ${beatImpact * 0.28})`;
        ctx.fillRect(0, 0, width, height);
      }
      break;
    }

    case 'lens-flare': {
      // 16. Golden Lens Flare (सूर्यकिरण व सिनेमॅटिक लेन्स फ्लेअर)
      ctx.drawImage(baseCanvas, 0, 0, width, height);

      const fx = (Math.sin(t * 0.7) * 0.4 + 0.5) * width;
      const fy = height * 0.24;

      const flare = ctx.createRadialGradient(fx, fy, 5, fx, fy, 160);
      flare.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      flare.addColorStop(0.25, 'rgba(253, 224, 71, 0.6)');
      flare.addColorStop(0.6, 'rgba(249, 115, 22, 0.25)');
      flare.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(fx, fy, 160, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, fy);
      ctx.lineTo(width, fy);
      ctx.stroke();
      break;
    }

    case 'water-ripples': {
      // 17. Holy Water Wave Ripples (शुभ जल लहरी व रिपल्स)
      const waterBuoyancy = Math.sin(t * 2) * 8;
      ctx.save();
      ctx.translate(width / 2, height / 2 + waterBuoyancy);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      const cx = width / 2;
      const cy = height * 0.5;
      for (let i = 0; i < 4; i++) {
        const r = (t * 90 + i * 80) % (width * 0.6);
        const alpha = Math.max(0, 1 - r / (width * 0.6));
        ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.5})`;
        ctx.lineWidth = 4 * (1 - r / (width * 0.6)) + 1;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case 'fireworks': {
      // 18. Grand Fireworks Celebration (भव्य आतषबाजी व फटाके)
      ctx.drawImage(baseCanvas, 0, 0, width, height);

      const fireworks = [
        { x: width * 0.28, y: height * 0.22, color: '#f43f5e', period: 2.2, offset: 0 },
        { x: width * 0.72, y: height * 0.28, color: '#eab308', period: 2.5, offset: 0.9 },
        { x: width * 0.5, y: height * 0.16, color: '#06b6d4', period: 2.8, offset: 1.7 },
        { x: width * 0.82, y: height * 0.38, color: '#a855f7', period: 2.4, offset: 1.3 },
      ];

      for (const fw of fireworks) {
        const tLocal = (t + fw.offset) % fw.period;
        if (tLocal < 1.4) {
          const pCount = 26;
          const fwProg = tLocal / 1.4;
          const radius = fwProg * (width * 0.25);
          const alpha = Math.max(0, 1 - fwProg);

          for (let p = 0; p < pCount; p++) {
            const angle = (Math.PI * 2 / pCount) * p;
            const speedVar = 0.8 + (p % 3) * 0.2;
            const sparkX = fw.x + Math.cos(angle) * radius * speedVar;
            const sparkY = fw.y + Math.sin(angle) * radius * speedVar + fwProg * fwProg * 40;

            ctx.fillStyle = fw.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 3.5 * (1 - fwProg * 0.5), 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sparkX, sparkY);
            ctx.lineTo(sparkX - Math.cos(angle) * 6, sparkY - Math.sin(angle) * 6);
            ctx.stroke();
          }
          ctx.globalAlpha = 1.0;
        }
      }
      break;
    }

    case 'dhol-tasha-shake': {
      // 19. High Energy Beat Shake (उत्सव बीट शेक व व्हायब्रेशन)
      const beatInterval = 60 / 126;
      const beatPhase = (t % beatInterval) / beatInterval;
      const beatImpact = Math.max(0, 1 - beatPhase * 3.5);
      const shakeX = Math.sin(t * 60) * 12 * beatImpact;
      const shakeY = Math.cos(t * 50) * 10 * beatImpact;
      const zoomBounce = 1.0 + beatImpact * 0.04;

      ctx.save();
      ctx.translate(width / 2 + shakeX, height / 2 + shakeY);
      ctx.scale(zoomBounce, zoomBounce);
      ctx.drawImage(baseCanvas, -width / 2, -height / 2, width, height);
      ctx.restore();

      if (beatImpact > 0.1) {
        ctx.strokeStyle = `rgba(239, 68, 68, ${beatImpact * 0.5})`;
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, width - 20, height - 20);
      }
      break;
    }

    default:
      ctx.drawImage(baseCanvas, 0, 0, width, height);
      break;
  }

  ctx.restore();
}
