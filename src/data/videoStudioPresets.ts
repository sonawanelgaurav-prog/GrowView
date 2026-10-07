import {
  VideoEntrancePresetId,
  VideoMovementPresetId,
  VideoExitPresetId,
  VideoEasing,
  VideoStudioLayer,
  VideoKeyframe,
} from '../types';

export interface PresetInfo<T extends string> {
  id: T;
  name: string;
  nameMarathi: string;
  category: 'entrance' | 'movement' | 'exit';
  description: string;
  iconName: string;
}

// 1. 10 Entrance Presets
export const ENTRANCE_PRESETS: PresetInfo<VideoEntrancePresetId>[] = [
  {
    id: 'fade_in',
    name: 'Fade In',
    nameMarathi: 'फेम इन (सावकाश दिसणे)',
    category: 'entrance',
    description: 'Smooth opacity reveal from 0% to 100%',
    iconName: 'Eye',
  },
  {
    id: 'fade_zoom_in',
    name: 'Fade + Zoom In',
    nameMarathi: 'फेड + झूम इन',
    category: 'entrance',
    description: 'Fades in while expanding smoothly from 80% to 100%',
    iconName: 'Maximize2',
  },
  {
    id: 'slide_from_left',
    name: 'Slide From Left',
    nameMarathi: 'डावीकडून स्लाईड',
    category: 'entrance',
    description: 'Enters gracefully from off-canvas left edge',
    iconName: 'ArrowRight',
  },
  {
    id: 'slide_from_right',
    name: 'Slide From Right',
    nameMarathi: 'उजवीकडून स्लाईड',
    category: 'entrance',
    description: 'Enters gracefully from off-canvas right edge',
    iconName: 'ArrowLeft',
  },
  {
    id: 'slide_from_top',
    name: 'Slide From Top',
    nameMarathi: 'वरतून खाली स्लाईड',
    category: 'entrance',
    description: 'Descends smoothly from top edge into position',
    iconName: 'ArrowDown',
  },
  {
    id: 'slide_from_bottom',
    name: 'Slide From Bottom',
    nameMarathi: 'खालून वर स्लाईड',
    category: 'entrance',
    description: 'Rises smoothly from bottom into place',
    iconName: 'ArrowUp',
  },
  {
    id: 'zoom_in',
    name: 'Zoom In',
    nameMarathi: 'झूम इन (मोठे होणे)',
    category: 'entrance',
    description: 'Scales from 0% to 100% directly from center',
    iconName: 'ZoomIn',
  },
  {
    id: 'zoom_out',
    name: 'Zoom Out',
    nameMarathi: 'झूम आऊट (नॉर्मल होणे)',
    category: 'entrance',
    description: 'Snaps inward from 150% oversize to normal 100%',
    iconName: 'ZoomOut',
  },
  {
    id: 'pop_in',
    name: 'Pop In',
    nameMarathi: 'पॉप इन (झटक्यात येणे)',
    category: 'entrance',
    description: 'Dynamic pop with slight overshoot (108%) before settling',
    iconName: 'Sparkles',
  },
  {
    id: 'bounce_in',
    name: 'Bounce In',
    nameMarathi: 'बाउन्स इन (उडी मारत येणे)',
    category: 'entrance',
    description: 'Playful bouncy entrance with physical spring dampening',
    iconName: 'Activity',
  },
];

// 2. 10 Movement Presets
export const MOVEMENT_PRESETS: PresetInfo<VideoMovementPresetId>[] = [
  {
    id: 'none',
    name: 'Static / None',
    nameMarathi: 'स्थिर (काहीही नाही)',
    category: 'movement',
    description: 'Remains in fixed position without ambient movement',
    iconName: 'Square',
  },
  {
    id: 'slow_pan_left',
    name: 'Slow Pan Left',
    nameMarathi: 'सावकाश डावीकडे सरकणे',
    category: 'movement',
    description: 'Continuous subtle horizontal drift toward the left',
    iconName: 'MoveLeft',
  },
  {
    id: 'slow_pan_right',
    name: 'Slow Pan Right',
    nameMarathi: 'सावकाश उजवीकडे सरकणे',
    category: 'movement',
    description: 'Continuous subtle horizontal drift toward the right',
    iconName: 'MoveRight',
  },
  {
    id: 'slow_pan_up',
    name: 'Slow Pan Up',
    nameMarathi: 'सावकाश वर जाणे',
    category: 'movement',
    description: 'Gentle upward ascent over entire duration',
    iconName: 'MoveUp',
  },
  {
    id: 'slow_pan_down',
    name: 'Slow Pan Down',
    nameMarathi: 'सावकाश खाली येणे',
    category: 'movement',
    description: 'Gentle downward drift over entire duration',
    iconName: 'MoveDown',
  },
  {
    id: 'floating',
    name: 'Floating',
    nameMarathi: 'हवेत तरंगणे (फ्लोटिंग)',
    category: 'movement',
    description: 'Continuous sine-wave vertical float like a suspended icon',
    iconName: 'Waves',
  },
  {
    id: 'gentle_zoom',
    name: 'Gentle Zoom',
    nameMarathi: 'हलका झूम (ब्रीदिंग)',
    category: 'movement',
    description: 'Slow rhythmic breathing scale between 98% and 104%',
    iconName: 'Maximize',
  },
  {
    id: 'cinematic_zoom',
    name: 'Cinematic Zoom',
    nameMarathi: 'सिनेमॅटिक झूम इन',
    category: 'movement',
    description: 'Unidirectional cinematic slow push (100% to 112%)',
    iconName: 'Film',
  },
  {
    id: 'parallax_movement',
    name: 'Parallax Movement',
    nameMarathi: 'पॅरलॅक्स मोशन',
    category: 'movement',
    description: 'Simultaneous subtle pan and zoom creating 3D depth perception',
    iconName: 'Layers',
  },
  {
    id: 'circular_motion',
    name: 'Circular Motion',
    nameMarathi: 'वर्तुळाकार फिरणे',
    category: 'movement',
    description: 'Smooth micro-orbital rotation around center point',
    iconName: 'RotateCw',
  },
  {
    id: 'wave_movement',
    name: 'Wave Movement',
    nameMarathi: 'लाटेसारखी हालचाल (वेव्ह)',
    category: 'movement',
    description: 'Horizontal and vertical undulating wave pattern',
    iconName: 'Wind',
  },
];

// 3. 5 Exit Presets
export const EXIT_PRESETS: PresetInfo<VideoExitPresetId>[] = [
  {
    id: 'none',
    name: 'Stay on Screen',
    nameMarathi: 'शेवटपर्यंत स्क्रीनवर राहणे',
    category: 'exit',
    description: 'Element remains fully visible until video ends',
    iconName: 'CheckSquare',
  },
  {
    id: 'fade_out',
    name: 'Fade Out',
    nameMarathi: 'सावकाश दिसेनासे होणे',
    category: 'exit',
    description: 'Smooth opacity reduction to 0% before scene ends',
    iconName: 'EyeOff',
  },
  {
    id: 'zoom_out_fade',
    name: 'Zoom Out + Fade',
    nameMarathi: 'झूम आऊट + फेड',
    category: 'exit',
    description: 'Shrinks into distance while fading away',
    iconName: 'Minimize2',
  },
  {
    id: 'slide_left_out',
    name: 'Slide Left Out',
    nameMarathi: 'डावीकडे निघून जाणे',
    category: 'exit',
    description: 'Slides off-screen through the left margin',
    iconName: 'ArrowLeftCircle',
  },
  {
    id: 'slide_right_out',
    name: 'Slide Right Out',
    nameMarathi: 'उजवीकडे निघून जाणे',
    category: 'exit',
    description: 'Slides off-screen through the right margin',
    iconName: 'ArrowRightCircle',
  },
  {
    id: 'slide_down_out',
    name: 'Slide Down Out',
    nameMarathi: 'खाली निघून जाणे',
    category: 'exit',
    description: 'Descends smoothly out of canvas at the end',
    iconName: 'ArrowDownCircle',
  },
];

// Easing Functions
export function applyEasing(t: number, easing: VideoEasing = 'easeInOut'): number {
  const clampT = Math.max(0, Math.min(1, t));
  switch (easing) {
    case 'linear':
      return clampT;
    case 'easeIn':
      return clampT * clampT;
    case 'easeOut':
      return clampT * (2 - clampT);
    case 'easeInOut':
      return clampT < 0.5 ? 2 * clampT * clampT : -1 + (4 - 2 * clampT) * clampT;
    case 'bounce': {
      let n = clampT;
      if (n < 1 / 2.75) {
        return 7.5625 * n * n;
      } else if (n < 2 / 2.75) {
        n -= 1.5 / 2.75;
        return 7.5625 * n * n + 0.75;
      } else if (n < 2.5 / 2.75) {
        n -= 2.25 / 2.75;
        return 7.5625 * n * n + 0.9375;
      } else {
        n -= 2.625 / 2.75;
        return 7.5625 * n * n + 0.984375;
      }
    }
    case 'elastic': {
      if (clampT === 0) return 0;
      if (clampT === 1) return 1;
      const p = 0.3;
      return Math.pow(2, -10 * clampT) * Math.sin(((clampT - p / 4) * (2 * Math.PI)) / p) + 1;
    }
    default:
      return clampT;
  }
}

// Keyframe Interpolator
export function interpolateKeyframes(
  keyframes: VideoKeyframe[],
  currentTime: number,
  fallback: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    opacity: number;
    blur: number;
    brightness: number;
  }
) {
  if (!keyframes || keyframes.length === 0) return fallback;
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);

  if (currentTime <= sorted[0].time) {
    const k = sorted[0];
    return {
      x: k.x ?? fallback.x,
      y: k.y ?? fallback.y,
      scale: k.scale ?? fallback.scale,
      rotation: k.rotation ?? fallback.rotation,
      opacity: k.opacity ?? fallback.opacity,
      blur: k.blur ?? fallback.blur,
      brightness: k.brightness ?? fallback.brightness,
    };
  }

  if (currentTime >= sorted[sorted.length - 1].time) {
    const k = sorted[sorted.length - 1];
    return {
      x: k.x ?? fallback.x,
      y: k.y ?? fallback.y,
      scale: k.scale ?? fallback.scale,
      rotation: k.rotation ?? fallback.rotation,
      opacity: k.opacity ?? fallback.opacity,
      blur: k.blur ?? fallback.blur,
      brightness: k.brightness ?? fallback.brightness,
    };
  }

  // Find surrounding keyframes
  let prevK = sorted[0];
  let nextK = sorted[1];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (currentTime >= sorted[i].time && currentTime <= sorted[i + 1].time) {
      prevK = sorted[i];
      nextK = sorted[i + 1];
      break;
    }
  }

  const duration = nextK.time - prevK.time || 0.001;
  const rawProgress = (currentTime - prevK.time) / duration;
  const progress = applyEasing(rawProgress, nextK.easing || 'easeInOut');

  const pX0 = prevK.x ?? fallback.x;
  const pX1 = nextK.x ?? fallback.x;
  const pY0 = prevK.y ?? fallback.y;
  const pY1 = nextK.y ?? fallback.y;
  const pS0 = prevK.scale ?? fallback.scale;
  const pS1 = nextK.scale ?? fallback.scale;
  const pR0 = prevK.rotation ?? fallback.rotation;
  const pR1 = nextK.rotation ?? fallback.rotation;
  const pO0 = prevK.opacity ?? fallback.opacity;
  const pO1 = nextK.opacity ?? fallback.opacity;
  const pB0 = prevK.blur ?? fallback.blur;
  const pB1 = nextK.blur ?? fallback.blur;
  const pBr0 = prevK.brightness ?? fallback.brightness;
  const pBr1 = nextK.brightness ?? fallback.brightness;

  return {
    x: pX0 + (pX1 - pX0) * progress,
    y: pY0 + (pY1 - pY0) * progress,
    scale: pS0 + (pS1 - pS0) * progress,
    rotation: pR0 + (pR1 - pR0) * progress,
    opacity: pO0 + (pO1 - pO0) * progress,
    blur: pB0 + (pB1 - pB0) * progress,
    brightness: pBr0 + (pBr1 - pBr0) * progress,
  };
}

// Master Transform Calculator for any layer at currentTime
export function calculateLayerComputedState(
  layer: VideoStudioLayer,
  currentTime: number,
  totalDuration: number,
  canvasW: number,
  canvasH: number
): {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  blur: number;
  brightness: number;
  visible: boolean;
} {
  if (!layer.visible) {
    return {
      x: layer.x,
      y: layer.y,
      scale: 0,
      rotation: layer.rotation,
      opacity: 0,
      blur: layer.blur,
      brightness: layer.brightness,
      visible: false,
    };
  }

  // Base state
  let currentX = layer.x;
  let currentY = layer.y;
  let currentScale = layer.scale || 1;
  let currentRotation = layer.rotation || 0;
  let currentOpacity = layer.opacity !== undefined ? layer.opacity : 1;
  let currentBlur = layer.blur || 0;
  let currentBrightness = layer.brightness !== undefined ? layer.brightness : 1;

  // 1. If custom keyframes are defined, apply keyframe interpolation
  if (layer.keyframes && layer.keyframes.length > 0) {
    const kState = interpolateKeyframes(layer.keyframes, currentTime, {
      x: currentX,
      y: currentY,
      scale: currentScale,
      rotation: currentRotation,
      opacity: currentOpacity,
      blur: currentBlur,
      brightness: currentBrightness,
    });
    currentX = kState.x;
    currentY = kState.y;
    currentScale = kState.scale;
    currentRotation = kState.rotation;
    currentOpacity = kState.opacity;
    currentBlur = kState.blur;
    currentBrightness = kState.brightness;
  } else {
    // 2. Apply Entrance Presets
    const entranceStart = layer.entranceDelay || 0;
    const entranceDuration = layer.entranceDuration || 1.0;
    const entranceEnd = entranceStart + entranceDuration;

    if (currentTime < entranceStart) {
      // Not yet entered
      currentOpacity = 0;
      currentScale = 0;
    } else if (currentTime < entranceEnd) {
      const t = (currentTime - entranceStart) / entranceDuration;
      const progress = applyEasing(t, layer.entranceEasing || 'easeOut');

      switch (layer.entrancePreset) {
        case 'fade_in':
          currentOpacity = progress * (layer.opacity ?? 1);
          break;
        case 'fade_zoom_in':
          currentOpacity = progress * (layer.opacity ?? 1);
          currentScale = (layer.scale || 1) * (0.8 + 0.2 * progress);
          break;
        case 'slide_from_left':
          currentOpacity = Math.min(1, progress * 1.5) * (layer.opacity ?? 1);
          currentX = layer.x - (1 - progress) * (canvasW * 0.7);
          break;
        case 'slide_from_right':
          currentOpacity = Math.min(1, progress * 1.5) * (layer.opacity ?? 1);
          currentX = layer.x + (1 - progress) * (canvasW * 0.7);
          break;
        case 'slide_from_top':
          currentOpacity = Math.min(1, progress * 1.5) * (layer.opacity ?? 1);
          currentY = layer.y - (1 - progress) * (canvasH * 0.6);
          break;
        case 'slide_from_bottom':
          currentOpacity = Math.min(1, progress * 1.5) * (layer.opacity ?? 1);
          currentY = layer.y + (1 - progress) * (canvasH * 0.6);
          break;
        case 'zoom_in':
          currentOpacity = progress * (layer.opacity ?? 1);
          currentScale = (layer.scale || 1) * progress;
          break;
        case 'zoom_out':
          currentOpacity = progress * (layer.opacity ?? 1);
          currentScale = (layer.scale || 1) * (1.6 - 0.6 * progress);
          break;
        case 'pop_in': {
          currentOpacity = Math.min(1, progress * 2) * (layer.opacity ?? 1);
          const popProgress = applyEasing(t, 'bounce');
          currentScale = (layer.scale || 1) * popProgress;
          break;
        }
        case 'bounce_in': {
          currentOpacity = Math.min(1, progress * 2) * (layer.opacity ?? 1);
          const bounceProgress = applyEasing(t, 'bounce');
          currentScale = (layer.scale || 1) * bounceProgress;
          currentY = layer.y - (1 - bounceProgress) * 120;
          break;
        }
      }
    }

    // 3. Apply Continuous Movement Presets (during active window)
    if (currentTime >= entranceEnd && layer.movementPreset !== 'none') {
      const activeTime = currentTime - entranceEnd;
      const speed = layer.movementSpeed || 1;

      switch (layer.movementPreset) {
        case 'slow_pan_left':
          currentX -= activeTime * 12 * speed;
          break;
        case 'slow_pan_right':
          currentX += activeTime * 12 * speed;
          break;
        case 'slow_pan_up':
          currentY -= activeTime * 10 * speed;
          break;
        case 'slow_pan_down':
          currentY += activeTime * 10 * speed;
          break;
        case 'floating':
          currentY += Math.sin(activeTime * 2.2 * speed) * 14;
          currentRotation += Math.cos(activeTime * 1.5 * speed) * 1.5;
          break;
        case 'gentle_zoom': {
          const breath = Math.sin(activeTime * 1.8 * speed) * 0.04;
          currentScale = (layer.scale || 1) * (1 + breath);
          break;
        }
        case 'cinematic_zoom': {
          const pushProgress = Math.min(1, activeTime / Math.max(1, totalDuration - entranceEnd));
          currentScale = (layer.scale || 1) * (1 + 0.12 * pushProgress * speed);
          break;
        }
        case 'parallax_movement': {
          currentX += Math.sin(activeTime * 1.2 * speed) * 16;
          currentY += Math.cos(activeTime * 1.0 * speed) * 8;
          currentScale = (layer.scale || 1) * (1 + Math.sin(activeTime * 1.5) * 0.03);
          break;
        }
        case 'circular_motion': {
          const radius = 12 * speed;
          currentX += Math.cos(activeTime * 1.8 * speed) * radius;
          currentY += Math.sin(activeTime * 1.8 * speed) * radius;
          break;
        }
        case 'wave_movement':
          currentX += Math.sin(activeTime * 2.5 * speed) * 15;
          currentY += Math.cos(activeTime * 3.0 * speed) * 8;
          break;
      }
    }

    // 4. Apply Exit Presets (toward end of scene)
    if (layer.exitPreset !== 'none') {
      const exitDuration = layer.exitDuration || 1.0;
      const exitStart = Math.max(entranceEnd, totalDuration - exitDuration - (layer.exitDelay || 0));

      if (currentTime > exitStart) {
        const exitT = Math.min(1, (currentTime - exitStart) / exitDuration);
        const exitProgress = applyEasing(exitT, 'easeInOut');

        switch (layer.exitPreset) {
          case 'fade_out':
            currentOpacity *= 1 - exitProgress;
            break;
          case 'zoom_out_fade':
            currentOpacity *= 1 - exitProgress;
            currentScale *= 1 - 0.5 * exitProgress;
            break;
          case 'slide_left_out':
            currentOpacity *= 1 - exitProgress;
            currentX -= exitProgress * (canvasW * 0.6);
            break;
          case 'slide_right_out':
            currentOpacity *= 1 - exitProgress;
            currentX += exitProgress * (canvasW * 0.6);
            break;
          case 'slide_down_out':
            currentOpacity *= 1 - exitProgress;
            currentY += exitProgress * (canvasH * 0.6);
            break;
        }
      }
    }
  }

  return {
    x: currentX,
    y: currentY,
    scale: Math.max(0, currentScale),
    rotation: currentRotation,
    opacity: Math.max(0, Math.min(1, currentOpacity)),
    blur: Math.max(0, currentBlur),
    brightness: Math.max(0, currentBrightness),
    visible: currentOpacity > 0.01 && currentScale > 0.01,
  };
}
