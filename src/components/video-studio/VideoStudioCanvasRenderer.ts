import {
  VideoStudioLayer,
  VideoStudioAspectRatio,
  BusinessProfile,
  FrameId,
  FooterFrameConfig,
} from '../../types';
import { calculateLayerComputedState } from '../../data/videoStudioPresets';
import { drawCanonicalFooterOnCanvas } from '../../utils/canvasRenderer';
import { getMotifSvgXml } from '../../utils/motifSvgMap';

export interface CanvasDimensions {
  width: number;
  height: number;
}

export function getCanvasDimensionsForAspectRatio(aspectRatio: VideoStudioAspectRatio): CanvasDimensions {
  switch (aspectRatio) {
    case '9:16':
      return { width: 1080, height: 1920 };
    case '4:5':
      return { width: 1080, height: 1350 };
    case '1:1':
    default:
      return { width: 1080, height: 1080 };
  }
}

// Image cache to avoid reloading images every frame
const imageCache: Map<string, HTMLImageElement> = new Map();

function getCachedImage(url: string): HTMLImageElement | null {
  if (imageCache.has(url)) {
    const img = imageCache.get(url)!;
    return img.complete ? img : null;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  imageCache.set(url, img);
  return null;
}

/**
 * Preload all raster images and SVG data-URIs into imageCache ahead of time.
 */
export async function preloadVideoStudioAssets(layers: VideoStudioLayer[]): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const layer of layers) {
    if (layer.imageUrl) {
      promises.push(
        new Promise((resolve) => {
          if (imageCache.has(layer.imageUrl!) && imageCache.get(layer.imageUrl!)!.complete) {
            resolve();
            return;
          }
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = layer.imageUrl!;
          imageCache.set(layer.imageUrl!, img);
        })
      );
    }
    const motifType = layer.svgIcon || layer.motifType || layer.name || '';
    if (motifType) {
      const primColor = layer.primaryColor || '#c084fc';
      const accColor = layer.accentColor || '#fef08a';
      const svgXml = getMotifSvgXml(motifType, primColor, accColor);
      const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgXml)}`;
      promises.push(
        new Promise((resolve) => {
          if (imageCache.has(dataUri) && imageCache.get(dataUri)!.complete) {
            resolve();
            return;
          }
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = dataUri;
          imageCache.set(dataUri, img);
        })
      );
    }
  }
  await Promise.all(promises);
}

/**
 * Draws all scene layers for current time `t` onto the target 2D canvas context.
 */
export function renderVideoStudioFrame(
  ctx: CanvasRenderingContext2D,
  layers: VideoStudioLayer[],
  currentTime: number,
  totalDuration: number,
  aspectRatio: VideoStudioAspectRatio,
  options: {
    selectedLayerId?: string | null;
    showSafeGuides?: boolean;
    showCenterGuides?: boolean;
    showGrid?: boolean;
    scaleRatio?: number; // scale multiplier for preview display
    activeProfile?: BusinessProfile;
    projectFrameId?: FrameId;
    footerConfig?: Partial<FooterFrameConfig>;
    accentColor?: string;
  } = {}
) {
  const { width: W, height: H } = getCanvasDimensionsForAspectRatio(aspectRatio);

  ctx.save();
  ctx.clearRect(0, 0, W, H);

  // 1. Draw Default Canvas Dark Base
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Sort layers by zIndex
  const sortedLayers = [...layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  for (const layer of sortedLayers) {
    if (!layer.visible) continue;

    const computed = calculateLayerComputedState(layer, currentTime, totalDuration, W, H);
    if (!computed.visible || computed.opacity <= 0) continue;

    ctx.save();
    ctx.globalAlpha = computed.opacity;

    // Filters (brightness & blur)
    const filters: string[] = [];
    if (computed.brightness !== 1) {
      filters.push(`brightness(${computed.brightness})`);
    }
    if (computed.blur > 0) {
      filters.push(`blur(${computed.blur}px)`);
    }
    if (layer.contrast && layer.contrast !== 1) {
      filters.push(`contrast(${layer.contrast})`);
    }
    if (layer.saturation && layer.saturation !== 1) {
      filters.push(`saturate(${layer.saturation})`);
    }
    if (filters.length > 0) {
      ctx.filter = filters.join(' ');
    }

    // Translate & Transform around layer center
    ctx.translate(computed.x, computed.y);
    if (computed.rotation !== 0) {
      ctx.rotate((computed.rotation * Math.PI) / 180);
    }
    if (computed.scale !== 1) {
      ctx.scale(computed.scale, computed.scale);
    }

    const drawW = layer.width || 200;
    const drawH = layer.height || 200;
    const halfW = drawW / 2;
    const halfH = drawH / 2;

    // Render Layer by Type
    switch (layer.type) {
      case 'background': {
        if (layer.imageUrl) {
          const img = getCachedImage(layer.imageUrl);
          if (img) {
            ctx.drawImage(img, -halfW, -halfH, drawW, drawH);
          } else {
            drawFallbackGradient(ctx, -halfW, -halfH, drawW, drawH, W, H, layer);
          }
        } else {
          drawFallbackGradient(ctx, -halfW, -halfH, drawW, drawH, W, H, layer);
        }
        break;
      }

      case 'deity':
      case 'poster_image': {
        if (layer.imageUrl) {
          const img = getCachedImage(layer.imageUrl);
          if (img) {
            ctx.drawImage(img, -halfW, -halfH, drawW, drawH);
          } else {
            drawMotifLayer(ctx, halfW, halfH, drawW, drawH, layer);
          }
        } else {
          drawMotifLayer(ctx, halfW, halfH, drawW, drawH, layer);
        }
        break;
      }

      case 'heading':
      case 'subheading':
      case 'text': {
        if (layer.text) {
          drawLayerText(ctx, layer, drawW, drawH);
        }
        break;
      }

      case 'logo': {
        const frameId = layer.frameId || options.projectFrameId || 'footer-01';
        const profile = layer.profile || options.activeProfile;
        const config = layer.footerConfig || options.footerConfig || {};

        if (profile) {
          // USER MANDATE: The company logo and frame info must remain static and identical to the poster!
          // We restore the local transformation matrix to draw in pure canvas coordinate space,
          // ensuring the brand frame never moves, shakes, or distorts.
          ctx.restore();
          ctx.save();
          const footerH = layer.height || Math.round(H * 0.18);
          drawCanonicalFooterOnCanvas(
            ctx,
            frameId,
            profile,
            config,
            W,
            H,
            footerH,
            options.accentColor || '#f59e0b'
          );
          ctx.restore();
          ctx.save(); // keep canvas stack balanced for outer ctx.restore()
        } else if (layer.text) {
          drawLayerText(ctx, layer, drawW, drawH);
        }
        break;
      }

      case 'particles': {
        drawFestiveParticles(ctx, -halfW, -halfH, drawW, drawH, currentTime);
        break;
      }

      case 'decoration': {
        drawDecorativeFloral(ctx, halfW, halfH, currentTime);
        break;
      }

      default:
        break;
    }

    ctx.restore();
  }

  // 2. Overlays: Center Guides, Grid, Safe Area
  if (options.showGrid) {
    drawCanvasGrid(ctx, W, H);
  }
  if (options.showCenterGuides) {
    drawCenterGuides(ctx, W, H);
  }
  if (options.showSafeGuides) {
    drawSafeGuides(ctx, W, H, aspectRatio);
  }

  // 3. Selection Bounding Box & Handles
  if (options.selectedLayerId) {
    const selected = layers.find((l) => l.id === options.selectedLayerId);
    if (selected && selected.visible) {
      const comp = calculateLayerComputedState(selected, currentTime, totalDuration, W, H);
      drawSelectionBox(ctx, comp, selected.width || 200, selected.height || 200);
    }
  }

  ctx.restore();
}

// Sub-renderers
function drawFallbackGradient(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  canvasW: number,
  canvasH: number,
  layer?: VideoStudioLayer
) {
  const gradClass = (layer?.bgGradient || '').toLowerCase();
  const grad = ctx.createLinearGradient(0, y, 0, y + h);

  // Check if Night Sky / Sweet Dreams gradient
  if (
    gradClass.includes('slate-950') ||
    gradClass.includes('purple') ||
    gradClass.includes('indigo') ||
    gradClass.includes('blue-950') ||
    (layer?.motifType || '').includes('night')
  ) {
    // Deep starry midnight blue / purple gradient for Sweet Dreams
    grad.addColorStop(0, '#030712'); // deep midnight slate
    grad.addColorStop(0.35, '#1e1b4b'); // deep celestial indigo
    grad.addColorStop(0.7, '#2e1065'); // ethereal royal purple
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    // Soft celestial violet & moonlight glow
    const radial = ctx.createRadialGradient(0, -canvasH * 0.1, 30, 0, -canvasH * 0.1, canvasW * 0.7);
    radial.addColorStop(0, 'rgba(192, 132, 252, 0.35)');
    radial.addColorStop(0.5, 'rgba(129, 140, 248, 0.15)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(x, y, w, h);

    // Delicate star field
    ctx.save();
    ctx.fillStyle = '#ffffff';
    const starCoords = [
      [-canvasW * 0.35, -canvasH * 0.3, 2],
      [-canvasW * 0.2, -canvasH * 0.42, 1.5],
      [canvasW * 0.28, -canvasH * 0.38, 2.5],
      [canvasW * 0.38, -canvasH * 0.22, 1.8],
      [-canvasW * 0.12, -canvasH * 0.18, 1.2],
      [canvasW * 0.15, -canvasH * 0.44, 2],
      [-canvasW * 0.38, -canvasH * 0.1, 1.5],
      [canvasW * 0.32, -canvasH * 0.05, 1.8],
    ];
    for (const [sx, sy, sr] of starCoords) {
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else if (gradClass.includes('cyan') || gradClass.includes('blue') || gradClass.includes('sky')) {
    // Oceanic / Sky Blue
    grad.addColorStop(0, '#082f49');
    grad.addColorStop(0.5, '#0369a1');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    const radial = ctx.createRadialGradient(0, 0, 40, 0, 0, canvasW * 0.6);
    radial.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(x, y, w, h);
  } else if (gradClass.includes('emerald') || gradClass.includes('green') || gradClass.includes('teal')) {
    // Fresh Emerald
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#047857');
    grad.addColorStop(1, '#022c22');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  } else if (
    gradClass.includes('red') ||
    gradClass.includes('rose') ||
    gradClass.includes('maroon')
  ) {
    // Festive Red / Maroon
    grad.addColorStop(0, '#4c0519');
    grad.addColorStop(0.5, '#881337');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  } else if (
    gradClass.includes('amber') ||
    gradClass.includes('orange') ||
    gradClass.includes('saffron') ||
    (layer?.name || '').includes('ganesh')
  ) {
    // Festive Saffron / Orange
    grad.addColorStop(0, '#7f1d1d');
    grad.addColorStop(0.4, '#991b1b');
    grad.addColorStop(0.7, '#ea580c');
    grad.addColorStop(1, '#431407');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    const radial = ctx.createRadialGradient(0, 0, 50, 0, 0, canvasW * 0.6);
    radial.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(x, y, w, h);
  } else {
    // Neutral Elegant Dark Slate
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  }
}

function drawMotifLayer(
  ctx: CanvasRenderingContext2D,
  halfW: number,
  halfH: number,
  drawW: number,
  drawH: number,
  layer: VideoStudioLayer
) {
  const motifType = layer.svgIcon || layer.motifType || layer.name || '';
  const primColor = layer.primaryColor || '#c084fc';
  const accColor = layer.accentColor || '#fef08a';

  // 1. Generate clean Vector SVG for this exact motif
  const svgXml = getMotifSvgXml(motifType, primColor, accColor);
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgXml)}`;

  // 2. Draw cached SVG image if ready
  const img = getCachedImage(dataUri);
  if (img) {
    ctx.drawImage(img, -halfW, -halfH, drawW, drawH);
    return;
  }

  // 3. Fallback immediate vector drawing matching the motif category
  drawMotifFallbackVector(ctx, halfW, halfH, motifType, primColor, accColor);
}

function drawMotifFallbackVector(
  ctx: CanvasRenderingContext2D,
  halfW: number,
  halfH: number,
  motifType: string,
  primColor: string,
  accColor: string
) {
  const norm = (motifType || '').toLowerCase();

  if (norm.includes('night') || norm.includes('crescent') || norm.includes('moon') || norm.includes('cloud')) {
    // Night & Sweet Dreams: Crescent Moon, Aura & Stars
    const aura = ctx.createRadialGradient(0, 0, 15, 0, 0, halfW * 0.9);
    aura.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
    aura.addColorStop(0.6, 'rgba(192, 132, 252, 0.2)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, halfW * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Golden Crescent Moon (drawn with pure curve path without modifying canvas blend mode)
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(halfW * 0.05, -halfH * 0.12, halfW * 0.42, 0.4 * Math.PI, 1.7 * Math.PI, false);
    ctx.quadraticCurveTo(halfW * 0.28, -halfH * 0.12, Math.cos(0.4 * Math.PI) * halfW * 0.42 + halfW * 0.05, Math.sin(0.4 * Math.PI) * halfW * 0.42 - halfH * 0.12);
    ctx.closePath();
    ctx.fill();

    // Dreamy Cloud in front
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#818cf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(-halfW * 0.2, halfH * 0.3, halfW * 0.25, 0, Math.PI * 2);
    ctx.arc(halfW * 0.1, halfH * 0.2, halfW * 0.32, 0, Math.PI * 2);
    ctx.arc(halfW * 0.35, halfH * 0.32, halfW * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sparkling Stars
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(halfW * 0.45, -halfH * 0.4, 4, 0, Math.PI * 2);
    ctx.arc(-halfW * 0.4, -halfH * 0.2, 3, 0, Math.PI * 2);
    ctx.arc(-halfW * 0.25, halfH * 0.1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (norm.includes('morning') || norm.includes('sun') || norm.includes('peaks')) {
    // Morning Sun over hills
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -halfH * 0.1, halfW * 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f766e';
    ctx.beginPath();
    ctx.moveTo(-halfW, halfH * 0.6);
    ctx.lineTo(-halfW * 0.2, 0);
    ctx.lineTo(halfW * 0.3, halfH * 0.4);
    ctx.lineTo(halfW, halfH * 0.6);
    ctx.closePath();
    ctx.fill();
    return;
  }

  if (norm.includes('diya') || norm.includes('diwali')) {
    // Diya with flame
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -halfH * 0.15, halfW * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(0, halfH * 0.25, halfW * 0.45, halfH * 0.2, 0, 0, Math.PI);
    ctx.fill();
    return;
  }

  if (norm.includes('ganesh') || norm.includes('bappa')) {
    // Sacred Ganesha Motif (Only if actually a Ganesh motif)
    const aura = ctx.createRadialGradient(0, 0, 20, 0, 0, halfW);
    aura.addColorStop(0, 'rgba(253, 224, 71, 0.6)');
    aura.addColorStop(0.7, 'rgba(234, 88, 12, 0.25)');
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, halfW, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;

    // Crown
    ctx.beginPath();
    ctx.moveTo(0, -halfH * 0.75);
    ctx.lineTo(halfW * 0.35, -halfH * 0.35);
    ctx.lineTo(-halfW * 0.35, -halfH * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.ellipse(0, -halfH * 0.1, halfW * 0.45, halfH * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Trunk
    ctx.beginPath();
    ctx.moveTo(-10, -halfH * 0.05);
    ctx.quadraticCurveTo(-halfW * 0.4, halfH * 0.3, 0, halfH * 0.45);
    ctx.quadraticCurveTo(halfW * 0.2, halfH * 0.5, halfW * 0.35, halfH * 0.4);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Tilak
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, -halfH * 0.22, 10, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Default Sacred Aura Medallion
  ctx.fillStyle = primColor;
  ctx.beginPath();
  ctx.arc(0, 0, halfW * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawLayerText(ctx: CanvasRenderingContext2D, layer: VideoStudioLayer, w: number, h: number) {
  const fontSize = layer.fontSize || 42;
  const fontWeight = layer.fontWeight || 'bold';
  const fontFamily = layer.fontFamily || 'Poppins, sans-serif';

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = layer.textAlign || 'center';
  ctx.textBaseline = 'middle';

  // Text Shadow
  if (layer.shadowColor) {
    ctx.shadowColor = layer.shadowColor;
    ctx.shadowBlur = layer.shadowBlur || 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
  }

  // Stroke Outline
  if (layer.strokeWidth && layer.strokeColor) {
    ctx.strokeStyle = layer.strokeColor;
    ctx.lineWidth = layer.strokeWidth;
    ctx.strokeText(layer.text || '', 0, 0, w);
  }

  // Text Fill
  ctx.fillStyle = layer.color || '#ffffff';
  ctx.fillText(layer.text || '', 0, 0, w);

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

function drawFestiveParticles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  currentTime: number
) {
  const particleCount = 45;
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 137.5;
    const speed = 40 + (i % 5) * 15;
    const px = ((seed * 11 + currentTime * speed * (i % 2 === 0 ? 1 : -1)) % w) - w / 2;
    const py = ((seed * 23 + currentTime * 60) % h) - h / 2;
    const radius = 2 + (i % 4) * 2;
    const pulse = 0.5 + 0.5 * Math.sin(currentTime * 4 + i);

    ctx.fillStyle = i % 3 === 0 ? `rgba(254, 240, 138, ${pulse})` : `rgba(249, 115, 22, ${pulse * 0.8})`;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDecorativeFloral(ctx: CanvasRenderingContext2D, halfW: number, halfH: number, time: number) {
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 4;
  const leaves = 8;
  const wobble = Math.sin(time * 2) * 4;

  for (let i = 0; i < leaves; i++) {
    const angle = (i * Math.PI * 2) / leaves;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, halfH * 0.4 + wobble, 12, 35, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawCanvasGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  const step = 80;
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function drawCenterGuides(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = '#06b6d4'; // Cyan center line
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  // Vertical Center
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
  ctx.stroke();

  // Horizontal Center
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  ctx.setLineDash([]);
}

function drawSafeGuides(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  aspectRatio: VideoStudioAspectRatio
) {
  // Safe margins (Instagram / WhatsApp Reels safe title zone: 10% top/bottom, 5% sides)
  const marginX = w * 0.06;
  const marginTop = aspectRatio === '9:16' ? h * 0.12 : h * 0.06;
  const marginBottom = aspectRatio === '9:16' ? h * 0.14 : h * 0.06;

  ctx.strokeStyle = '#eab308'; // Amber safe margin
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);

  ctx.strokeRect(marginX, marginTop, w - marginX * 2, h - marginTop - marginBottom);

  ctx.setLineDash([]);
}

function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  computed: { x: number; y: number; scale: number; rotation: number },
  w: number,
  h: number
) {
  ctx.save();
  ctx.translate(computed.x, computed.y);
  if (computed.rotation !== 0) {
    ctx.rotate((computed.rotation * Math.PI) / 180);
  }
  if (computed.scale !== 1) {
    ctx.scale(computed.scale, computed.scale);
  }

  const halfW = w / 2;
  const halfH = h / 2;

  // Blue Bounding Box
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(-halfW, -halfH, w, h);

  // 4 Corner Handles
  const handleSize = 12;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;

  const corners = [
    [-halfW, -halfH],
    [halfW, -halfH],
    [halfW, halfH],
    [-halfW, halfH],
  ];

  for (const [cx, cy] of corners) {
    ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
    ctx.strokeRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
  }

  // Rotation Handle at Top
  ctx.beginPath();
  ctx.moveTo(0, -halfH);
  ctx.lineTo(0, -halfH - 24);
  ctx.strokeStyle = '#38bdf8';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -halfH - 24, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#38bdf8';
  ctx.fill();

  ctx.restore();
}
