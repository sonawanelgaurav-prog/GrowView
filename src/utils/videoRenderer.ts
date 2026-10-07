import {
  PosterRenderDocument,
  renderPosterDocumentToCanvas,
} from './canvasRenderer';
import {
  VideoRenderOptions,
  VideoAnimationPresetId,
} from '../types';
import { renderAnimatedVideoFrame } from './videoAnimationEngine';

export { renderAnimatedVideoFrame };

export interface VideoProgressEvent {
  percent: number; // 0 to 100
  currentSecond: number;
  totalSeconds: number;
  statusText: string;
}

export interface VideoExportResult {
  blob: Blob;
  url: string;
  filename: string;
  mimeType: string;
  duration: number;
}

/**
 * Synthesizes festival background music using Web Audio API
 */
function createFestiveAudioStream(
  audioTrack: VideoRenderOptions['audioTrack'],
  durationSec: number
): { stream: MediaStream | null; stop: () => void } {
  if (audioTrack === 'none' || typeof window === 'undefined') {
    return { stream: null, stop: () => {} };
  }

  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return { stream: null, stop: () => {} };

    const ctx = new AudioContextClass();
    const dest = ctx.createMediaStreamDestination();

    let isPlaying = true;
    const intervalIds: number[] = [];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
    masterGain.connect(dest);

    if (audioTrack === 'dhol-tasha') {
      // 126 BPM Festive Dhol Tasha rhythm (Kick + Snare + Bell)
      const beatIntervalMs = (60 / 126) * 1000;
      let beatCount = 0;

      const playDholBeat = () => {
        if (!isPlaying || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        beatCount++;

        // Low Bass Dhol (Bass drum)
        if (beatCount % 2 === 1) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
          gain.gain.setValueAtTime(0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.26);
        }

        // Tasha Sharp Snap (High percussion)
        const tashaOsc = ctx.createOscillator();
        const tashaGain = ctx.createGain();
        tashaOsc.type = 'triangle';
        tashaOsc.frequency.setValueAtTime(480 + (beatCount % 4) * 60, now);
        tashaOsc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        tashaGain.gain.setValueAtTime(0.4, now);
        tashaGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        tashaOsc.connect(tashaGain);
        tashaGain.connect(masterGain);
        tashaOsc.start(now);
        tashaOsc.stop(now + 0.11);
      };

      playDholBeat();
      const iv = window.setInterval(playDholBeat, beatIntervalMs);
      intervalIds.push(iv);
    } else if (audioTrack === 'shehnai') {
      // Shehnai festive pentatonic melodic melody (Bhairavi / Shubh Vivaah / Utsav scale)
      const notes = [440, 493.88, 554.37, 659.25, 739.99, 880]; // A, B, C#, E, F#, A
      let noteIndex = 0;

      const playShehnaiNote = () => {
        if (!isPlaying || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const freq = notes[noteIndex % notes.length];
        noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2)) % notes.length;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        // vibrato effect
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.99, now + 0.3);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.48);
      };

      playShehnaiNote();
      const iv = window.setInterval(playShehnaiNote, 320);
      intervalIds.push(iv);
    } else if (audioTrack === 'temple-bells') {
      // Temple Bells / Ghanta chime
      const bellFreqs = [523.25, 659.25, 783.99, 1046.5];
      let bellIdx = 0;

      const playBell = () => {
        if (!isPlaying || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const freq = bellFreqs[bellIdx % bellFreqs.length];
        bellIdx++;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.25);
      };

      playBell();
      const iv = window.setInterval(playBell, 900);
      intervalIds.push(iv);
    } else if (audioTrack === 'peaceful-night' || (audioTrack as string) === 'motivational_cinematic') {
      const nightNotes = [523.25, 659.25, 783.99, 1046.5];
      let nIdx = 0;
      const playChime = () => {
        if (!isPlaying || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        const freq = nightNotes[nIdx % nightNotes.length];
        nIdx++;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.85);
      };

      playChime();
      const iv = window.setInterval(playChime, 1100);
      intervalIds.push(iv);
    }

    const stop = () => {
      isPlaying = false;
      intervalIds.forEach((id) => clearInterval(id));
      try {
        ctx.close();
      } catch {
        // ignore
      }
    };

    return { stream: dest.stream, stop };
  } catch (err) {
    console.warn('Audio synthesis could not initialize:', err);
    return { stream: null, stop: () => {} };
  }
}

/**
 * Determines the best supported video container/codec for browser
 */
function getBestVideoMimeType(preferMp4: boolean): string {
  if (typeof MediaRecorder === 'undefined') return '';

  const candidates = preferMp4
    ? [
        'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
        'video/mp4',
        'video/webm;codecs=h264',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ]
    : [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ];

  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) {
      return c;
    }
  }
  return '';
}

/**
 * 🎬 Draws 20 high-fidelity video animation presets on canvas frame
 */
export function drawVideoAnimationPreset(
  ctx: CanvasRenderingContext2D,
  presetId: VideoAnimationPresetId,
  timeSec: number,
  durationSec: number,
  width: number,
  height: number,
  primaryColor: string = '#f59e0b',
  accentColor: string = '#ec4899'
): void {
  const t = timeSec;
  const progress = (t / durationSec) % 1;

  ctx.save();

  switch (presetId) {
    case 'pulse-glow': {
      // 1. Heartbeat breathing radial glow & frame pulse
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.5);
      const cx = width / 2;
      const cy = height * 0.45;
      const radius = width * (0.35 + pulse * 0.08);

      const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.25)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Edge border glow
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.3 + pulse * 0.4})`;
      ctx.lineWidth = 4 + pulse * 6;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      break;
    }

    case 'ken-burns': {
      // 2. Slow cinematic zoom & pan overlay sweep
      const sweepX = Math.sin(t * 0.8) * (width * 0.3) + width / 2;
      const grad = ctx.createRadialGradient(sweepX, height * 0.35, 10, sweepX, height * 0.35, width * 0.6);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
      grad.addColorStop(0.4, 'rgba(251, 191, 36, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'golden-sparkles': {
      // 3. Floating golden shimmering particles & stars
      const count = 35;
      for (let i = 0; i < count; i++) {
        const seed = i * 137.5;
        const px = ((seed * 11 + t * 45) % width);
        const py = ((seed * 17 - t * 65 + height * 2) % height);
        const size = 2.5 + 3.5 * Math.sin(t * 4 + i);
        const alpha = Math.max(0.2, Math.abs(Math.sin(t * 3 + seed)));

        ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, size), 0, Math.PI * 2);
        ctx.fill();

        // 4-point sparkle star on bright ones
        if (i % 3 === 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px - size * 2, py);
          ctx.lineTo(px + size * 2, py);
          ctx.moveTo(px, py - size * 2);
          ctx.lineTo(px, py + size * 2);
          ctx.stroke();
        }
      }
      break;
    }

    case 'diya-float': {
      // 4. Floating Diyas & warm flickering flame halos
      const diyaCount = 6;
      for (let i = 0; i < diyaCount; i++) {
        const baseX = (width / (diyaCount + 1)) * (i + 1);
        const dy = Math.sin(t * 2 + i * 1.5) * 12;
        const flameY = height * 0.82 + dy;
        const flicker = 0.8 + 0.3 * Math.sin(t * 8 + i * 3);

        // Glow halo
        const halo = ctx.createRadialGradient(baseX, flameY, 2, baseX, flameY, 35 * flicker);
        halo.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
        halo.addColorStop(0.3, 'rgba(249, 115, 22, 0.45)');
        halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(baseX, flameY, 40 * flicker, 0, Math.PI * 2);
        ctx.fill();

        // Little Diya base
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(baseX, flameY + 12, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flame teardrop
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.moveTo(baseX, flameY - 14 * flicker);
        ctx.quadraticCurveTo(baseX + 6, flameY, baseX, flameY + 6);
        ctx.quadraticCurveTo(baseX - 6, flameY, baseX, flameY - 14 * flicker);
        ctx.fill();
      }
      break;
    }

    case 'confetti-burst': {
      // 5. Festive Confetti / Gulal burst
      const count = 45;
      const colors = ['#f43f5e', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#eab308'];
      for (let i = 0; i < count; i++) {
        const seed = i * 29;
        const x = (seed * 19 + Math.sin(t + i) * 60) % width;
        const y = ((t * 120 + seed * 37) % (height + 100)) - 50;
        const rot = t * 3 + seed;
        const col = colors[i % colors.length];

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = col;
        ctx.fillRect(-6, -3, 12, 6);
        ctx.restore();
      }
      break;
    }

    case 'saffron-wave': {
      // 6. Saffron silk wave swirl
      const waveY = height * 0.5 + Math.sin(t * 2) * (height * 0.2);
      const grad = ctx.createLinearGradient(0, waveY - 80, width, waveY + 80);
      grad.addColorStop(0, 'rgba(234, 88, 12, 0)');
      grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.25)');
      grad.addColorStop(1, 'rgba(234, 88, 12, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, waveY - 60);
      for (let x = 0; x <= width; x += 40) {
        const cy = waveY + Math.sin(t * 3 + (x / width) * 4) * 40;
        ctx.lineTo(x, cy);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'text-slide-up': {
      // 7. Typography smooth slide & shimmer
      const textReveal = Math.min(1, t / 1.2);
      if (textReveal < 1) {
        ctx.fillStyle = `rgba(0,0,0, ${0.4 * (1 - textReveal)})`;
        ctx.fillRect(0, height * 0.55, width, height * 0.3);
      }
      // Light beam over text area
      const beamX = ((t * 400) % (width * 1.6)) - width * 0.3;
      const bGrad = ctx.createLinearGradient(beamX - 60, 0, beamX + 60, 0);
      bGrad.addColorStop(0, 'rgba(255,255,255,0)');
      bGrad.addColorStop(0.5, 'rgba(255,255,255,0.22)');
      bGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = bGrad;
      ctx.fillRect(0, height * 0.45, width, height * 0.45);
      break;
    }

    case 'chakra-spin': {
      // 8. Sudarshan Chakra / Divine Aura rotation behind deity
      const cx = width / 2;
      const cy = height * 0.4;
      const radius = width * 0.32;
      const angle = t * 0.8;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      // Glowing circular rays
      const rays = 24;
      for (let i = 0; i < rays; i++) {
        const rayAngle = (Math.PI * 2 / rays) * i;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.28)' : 'rgba(245, 158, 11, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(rayAngle) * radius, Math.sin(rayAngle) * radius);
        ctx.stroke();
      }

      // Outer golden halo ring
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'gold-light-sweep': {
      // 9. Diagonal shimmering gold light sweep
      const sweepProgress = (t * 0.4) % 1.4 - 0.2;
      const sx = sweepProgress * (width + height);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.clip();

      const grad = ctx.createLinearGradient(sx - 120, -100, sx + 120, height + 100);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.4, 'rgba(254, 240, 138, 0.35)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
      grad.addColorStop(0.6, 'rgba(254, 240, 138, 0.35)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      break;
    }

    case 'flower-shower': {
      // 10. Fresh marigold (झेंडू) and rose (गुलाब) petal shower
      const count = 30;
      for (let i = 0; i < count; i++) {
        const seed = i * 47;
        const x = (seed * 23 + Math.sin(t * 1.5 + i) * 80) % width;
        const y = ((t * 90 + seed * 31) % (height + 80)) - 40;
        const rot = t * 2 + seed;
        const isRose = i % 2 === 0;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);

        // Petal shape
        ctx.fillStyle = isRose ? '#e11d48' : '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Petal highlight
        ctx.fillStyle = isRose ? '#fb7185' : '#fde047';
        ctx.beginPath();
        ctx.ellipse(2, -2, 4, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      break;
    }

    case 'cinematic-smoke': {
      // 11. Royal mystical smoke & fire embers
      const smokeCount = 5;
      for (let i = 0; i < smokeCount; i++) {
        const cx = (width / (smokeCount + 1)) * (i + 1) + Math.sin(t + i) * 30;
        const cy = height - ((t * 60 + i * 140) % height);
        const radius = 60 + Math.sin(t * 2 + i) * 20;

        const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
        grad.addColorStop(0, 'rgba(234, 88, 12, 0.22)');
        grad.addColorStop(0.6, 'rgba(180, 83, 9, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'blessing-auras': {
      // 12. Divine blessing rays from the central deity
      const cx = width / 2;
      const cy = height * 0.42;
      const rays = 18;
      const pulse = 0.7 + 0.3 * Math.sin(t * 3);

      for (let i = 0; i < rays; i++) {
        const a1 = (Math.PI * 2 / rays) * i + t * 0.2;
        const a2 = a1 + (Math.PI * 2 / rays) * 0.5;
        const r = width * 0.7;

        ctx.fillStyle = `rgba(253, 224, 71, ${0.08 * pulse})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, a1, a2);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }

    case 'neon-border-pulse': {
      // 13. Cyber Neon Border Pulse
      const pulse = Math.abs(Math.sin(t * 4));
      ctx.strokeStyle = `rgba(6, 182, 212, ${0.4 + pulse * 0.6})`;
      ctx.lineWidth = 6 + pulse * 6;
      ctx.strokeRect(16, 16, width - 32, height - 32);

      // Corner accent boxes
      const cornerSize = 32;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      // Top-Left
      ctx.strokeRect(12, 12, cornerSize, cornerSize);
      // Top-Right
      ctx.strokeRect(width - 12 - cornerSize, 12, cornerSize, cornerSize);
      // Bottom-Left
      ctx.strokeRect(12, height - 12 - cornerSize, cornerSize, cornerSize);
      // Bottom-Right
      ctx.strokeRect(width - 12 - cornerSize, height - 12 - cornerSize, cornerSize, cornerSize);
      break;
    }

    case 'parallax-drift': {
      // 14. 3D Parallax background drift
      const shiftX = Math.sin(t * 0.7) * 25;
      const grad = ctx.createLinearGradient(shiftX, 0, width + shiftX, height);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, 'rgba(244, 63, 94, 0.12)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'beat-flash': {
      // 15. Dhol-Tasha Rhythm Flash (subtle pulse on 126BPM beats)
      const beat = Math.pow(Math.sin(t * Math.PI * 2.1), 8); // Sharp peak on beats
      if (beat > 0.3) {
        ctx.fillStyle = `rgba(255, 255, 255, ${beat * 0.22})`;
        ctx.fillRect(0, 0, width, height);
      }
      break;
    }

    case 'lens-flare': {
      // 16. Sunbeam & Lens Flare Sweep
      const fx = (Math.sin(t * 0.6) * 0.4 + 0.5) * width;
      const fy = height * 0.22;

      const flareGrad = ctx.createRadialGradient(fx, fy, 4, fx, fy, 140);
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      flareGrad.addColorStop(0.2, 'rgba(253, 224, 71, 0.5)');
      flareGrad.addColorStop(0.6, 'rgba(249, 115, 22, 0.2)');
      flareGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, 140, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal flare beam
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, fy);
      ctx.lineTo(width, fy);
      ctx.stroke();
      break;
    }

    case 'water-ripples': {
      // 17. Concentric water wave ripples
      const cx = width / 2;
      const cy = height * 0.5;
      const rippleCount = 4;
      for (let i = 0; i < rippleCount; i++) {
        const r = ((t * 80 + i * 70) % (width * 0.5));
        const alpha = Math.max(0, 1 - r / (width * 0.5));

        ctx.strokeStyle = `rgba(14, 165, 233, ${alpha * 0.35})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    case 'fireworks': {
      // 18. Fireworks celebration
      const bursts = [
        { x: width * 0.25, y: height * 0.2, timeOffset: 0, color: '#f43f5e' },
        { x: width * 0.75, y: height * 0.25, timeOffset: 0.8, color: '#eab308' },
        { x: width * 0.5, y: height * 0.15, timeOffset: 1.5, color: '#3b82f6' },
      ];

      for (const b of bursts) {
        const localT = (t + b.timeOffset) % 2.0;
        if (localT < 1.2) {
          const radius = localT * 90;
          const alpha = 1 - localT / 1.2;
          const particles = 16;
          for (let p = 0; p < particles; p++) {
            const angle = (Math.PI * 2 / particles) * p;
            const px = b.x + Math.cos(angle) * radius;
            const py = b.y + Math.sin(angle) * radius + localT * 15; // gravity

            ctx.fillStyle = b.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        }
      }
      break;
    }

    case 'dhol-tasha-shake': {
      // 19. High Energy Beat Shake
      const beat = Math.sin(t * 8);
      if (Math.abs(beat) > 0.8) {
        const shakeX = (Math.random() - 0.5) * 6;
        const shakeY = (Math.random() - 0.5) * 6;
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 5;
        ctx.strokeRect(10 + shakeX, 10 + shakeY, width - 20, height - 20);
      }
      break;
    }

    case 'floating-3d-tilt': {
      // 20. 3D card float & perspective shimmer
      const tilt = Math.sin(t * 1.5) * 15;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      grad.addColorStop(0.5, 'rgba(20, 184, 166, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle border depth
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.strokeRect(14 + tilt * 0.2, 14, width - 28, height - 28);
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

/**
 * 🚀 Renders full high-definition video with selected animation preset & festive audio!
 */
export async function renderPosterVideo(
  doc: PosterRenderDocument,
  options: VideoRenderOptions,
  onProgress?: (event: VideoProgressEvent) => void
): Promise<VideoExportResult> {
  if (typeof window === 'undefined') {
    throw new Error('Video rendering requires browser environment');
  }

  // 1. Pre-render base static poster canvas at high resolution
  onProgress?.({
    percent: 10,
    currentSecond: 0,
    totalSeconds: options.durationSeconds,
    statusText: 'हाय-डेफिनिशन पोस्टर कॅन्व्हास तयार होत आहे...',
  });

  const baseCanvas = await renderPosterDocumentToCanvas(doc);

  // 2. Setup resolution dimensions
  const is916 = doc.aspectRatio === '9:16';
  let targetWidth = 1080;
  let targetHeight = is916 ? 1920 : 1080;

  if (options.resolution === '720p') {
    targetWidth = 720;
    targetHeight = is916 ? 1280 : 720;
  } else if (options.resolution === '480p') {
    targetWidth = 480;
    targetHeight = is916 ? 854 : 480;
  }

  const recordingCanvas = document.createElement('canvas');
  recordingCanvas.width = targetWidth;
  recordingCanvas.height = targetHeight;
  const ctx = recordingCanvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Canvas 2D context creation failed');
  }

  // Draw initial frame
  ctx.drawImage(baseCanvas, 0, 0, targetWidth, targetHeight);

  // 3. Audio setup
  const { stream: audioStream, stop: stopAudio } = createFestiveAudioStream(
    options.audioTrack,
    options.durationSeconds
  );

  // 4. Capture Canvas stream
  const fps = options.fps || 30;
  const canvasStream = recordingCanvas.captureStream(fps);

  const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
  if (audioStream) {
    combinedTracks.push(...audioStream.getAudioTracks());
  }
  const combinedStream = new MediaStream(combinedTracks);

  // 5. Setup MediaRecorder with best MIME type
  const preferMp4 = options.format === 'mp4';
  const selectedMime = getBestVideoMimeType(preferMp4) || 'video/webm';

  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(combinedStream, {
      mimeType: selectedMime,
      videoBitsPerSecond: options.resolution === '1080p' ? 8_000_000 : 4_000_000,
    });
  } catch {
    // Fallback without mimeType parameter
    recorder = new MediaRecorder(combinedStream);
  }

  const recordedChunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      try {
        const finalBlob = new Blob(recordedChunks, {
          type: selectedMime.split(';')[0] || (preferMp4 ? 'video/mp4' : 'video/webm'),
        });
        resolve(finalBlob);
      } catch (err) {
        reject(err);
      }
    };
    recorder.onerror = (err) => reject(err);
  });

  recorder.start(250); // Emit chunk every 250ms

  // 6. Animation Frame Loop
  const totalDurationMs = options.durationSeconds * 1000;
  const startTime = performance.now();

  await new Promise<void>((resolve) => {
    const renderLoop = () => {
      const now = performance.now();
      const elapsedMs = now - startTime;
      const currentSec = elapsedMs / 1000;

      if (elapsedMs >= totalDurationMs) {
        // Finished!
        recorder.stop();
        stopAudio();
        onProgress?.({
          percent: 100,
          currentSecond: options.durationSeconds,
          totalSeconds: options.durationSeconds,
          statusText: 'व्हिडिओ सेव्ह होत आहे...',
        });
        resolve();
        return;
      }

      // Render dynamic animated video frame (poster motion + transformations + visual overlays)
      renderAnimatedVideoFrame(
        ctx,
        baseCanvas,
        options.animationPresetId,
        currentSec,
        options.durationSeconds,
        targetWidth,
        targetHeight,
        doc.template.theme?.primaryColor || '#f59e0b',
        doc.template.theme?.accentColor || '#ec4899'
      );

      // Watermark for free users if enabled
      if (options.includeBranding) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(targetWidth - 210, 16, 194, 28);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('GrowView - Poster Maker', targetWidth - 200, 34);
        ctx.restore();
      }

      // Progress update
      const percent = Math.min(99, Math.round(15 + (elapsedMs / totalDurationMs) * 82));
      onProgress?.({
        percent,
        currentSecond: Math.min(options.durationSeconds, Math.floor(currentSec * 10) / 10),
        totalSeconds: options.durationSeconds,
        statusText: `व्हिडिओ फ्रेम्स रेंडर होत आहेत (${percent}%)...`,
      });

      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  });

  const blob = await recordingPromise;
  const url = URL.createObjectURL(blob);

  const safeTitle = (doc.template.titleNative || doc.template.title || 'video')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-');
  const safeBrand = (doc.profile.name || 'brand')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-');

  // If mime is webm or mp4, set filename
  const extension = options.format === 'mp4' ? 'mp4' : 'webm';
  const filename = `${safeTitle}-${safeBrand}-${options.animationPresetId}.${extension}`;

  return {
    blob,
    url,
    filename,
    mimeType: blob.type,
    duration: options.durationSeconds,
  };
}
