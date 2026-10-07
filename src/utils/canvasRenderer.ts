import {
  PosterTemplate,
  BusinessProfile,
  FooterFrameConfig,
  CanvasCustomElement,
  FrameId,
  PosterFormatConfig,
  getPosterFormatByRatio,
  AspectRatio,
  LogoShape,
  PosterWatermarkConfig,
} from '../types';
import { preloadImage, getCachedImage, ensureFontsReady } from './assetCache';
export { preloadImage, getCachedImage, ensureFontsReady };
import { getMotifSvgXml } from './motifSvgMap';
import { FOOTER_FRAMES } from '../data/footerFrames';

export interface PosterRenderDocument {
  template: PosterTemplate;
  profile: BusinessProfile;
  frameId: FrameId;
  footerConfig?: Partial<FooterFrameConfig>;
  showFooter?: boolean;
  aspectRatio: AspectRatio;
  formatConfig?: PosterFormatConfig;
  watermark?: PosterWatermarkConfig;

  // Visual Customizations
  customBgImage?: string | null;
  customBgGradient?: string | null;
  customElements?: CanvasCustomElement[];

  // Fallback direct text strings
  customHeadline?: string;
  customSubtext?: string;
  customQuote?: string;

  // Dynamic Element Positions & Styles (Normalized 0-100 coordinates)
  dateBadgeStyle?: {
    text?: string;
    fontSize?: number;
    color?: string;
    bgColor?: string;
    isHidden?: boolean;
    x?: number; // 0..100% of width
    y?: number; // 0..100% of content safe height (0..80% of canvas)
    align?: 'left' | 'center' | 'right';
  };

  companyLogoUrl?: string | null;
  companyLogoPosition?: {
    x: number; // 0..100%
    y: number; // 0..100% of content safe height
    size: number; // 0..100%
  };

  motifStyle?: {
    type?: string;
    x?: number;
    y?: number;
    size?: number;
    scale?: number;
    rotation?: number;
    opacity?: number;
    isHidden?: boolean;
    primaryColor?: string;
    accentColor?: string;
  };

  headlineStyle?: {
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    isBold?: boolean;
    bold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    isHidden?: boolean;
    x?: number;
    y?: number;
    boxWidth?: number; // percentage width 20-100
    boxHeight?: number;
    align?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
    shadow?: boolean;
    shadowColor?: string;
    shadowBlur?: number;
  };

  subtextStyle?: {
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    isBold?: boolean;
    bold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    isHidden?: boolean;
    x?: number;
    y?: number;
    boxWidth?: number;
    boxHeight?: number;
    align?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
    shadow?: boolean;
  };

  quoteStyle?: {
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    isHidden?: boolean;
    x?: number;
    y?: number;
    boxWidth?: number;
    boxHeight?: number;
    align?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
    shadow?: boolean;
  };
}

export interface ExportResult {
  dataUrl: string;
  blob: Blob;
  filename: string;
}

/**
 * Helper: Round Rectangle Path on Canvas Context
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Helper: Draw Cover Image onto Canvas
 */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  if (!imgW || !imgH) return;

  const targetRatio = w / h;
  const imgRatio = imgW / imgH;

  let sx = 0;
  let sy = 0;
  let sWidth = imgW;
  let sHeight = imgH;

  if (imgRatio > targetRatio) {
    sWidth = imgH * targetRatio;
    sx = (imgW - sWidth) / 2;
  } else {
    sHeight = imgW / targetRatio;
    sy = (imgH - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

/**
 * Helper: Draw Contain Image onto Canvas
 */
function drawContainImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgW = img.naturalWidth || img.width;
  const imgH = img.naturalHeight || img.height;
  if (!imgW || !imgH) return;

  const imgAspect = imgW / imgH;
  let drawW = w;
  let drawH = drawW / imgAspect;

  if (drawH > h) {
    drawH = h;
    drawW = drawH * imgAspect;
  }

  const drawX = x + (w - drawW) / 2;
  const drawY = y + (h - drawH) / 2;

  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

/**
 * Helper: Draw Gradient Background
 */
function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  gradientClass: string,
  width: number,
  height: number
) {
  const grad = ctx.createLinearGradient(0, 0, width, height);

  if (gradientClass.includes('amber') || gradientClass.includes('orange')) {
    grad.addColorStop(0, '#451a03');
    grad.addColorStop(0.4, '#7c2d12');
    grad.addColorStop(1, '#1c1917');
  } else if (gradientClass.includes('red') || gradientClass.includes('rose')) {
    grad.addColorStop(0, '#4c0519');
    grad.addColorStop(0.5, '#881337');
    grad.addColorStop(1, '#0f172a');
  } else if (
    gradientClass.includes('cyan') ||
    gradientClass.includes('blue') ||
    gradientClass.includes('sky')
  ) {
    grad.addColorStop(0, '#082f49');
    grad.addColorStop(0.5, '#0369a1');
    grad.addColorStop(1, '#020617');
  } else if (gradientClass.includes('purple') || gradientClass.includes('indigo')) {
    grad.addColorStop(0, '#3b0764');
    grad.addColorStop(0.5, '#581c87');
    grad.addColorStop(1, '#09090b');
  } else if (gradientClass.includes('emerald') || gradientClass.includes('teal')) {
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(0.5, '#047857');
    grad.addColorStop(1, '#022c22');
  } else {
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#020617');
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
}

export interface FormattedTextOptions {
  fontSize: number;
  fontFamily: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  color: string;
  align?: 'left' | 'center' | 'right';
  lineHeightMultiplier?: number;
  letterSpacing?: number;
  shadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetY?: number;
  maxLines?: number;
}

/**
 * UNIFIED, UNICODE-SAFE, MULTI-LINE TEXT BLOCK RENDERER
 * Guarantees exact paragraph preservation, fixed box width, consistent alignment,
 * and perfectly stable positioning without any reflow or line-jump during drag or export.
 */
export function renderFormattedTextBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  boxWidthPx: number,
  options: FormattedTextOptions
) {
  if (!text || text.trim() === '') return;

  ctx.save();

  // 1. Configure Typography Font
  const weight = options.isBold ? 'bold ' : '';
  const style = options.isItalic ? 'italic ' : '';
  const fontSize = options.fontSize;
  ctx.font = `${style}${weight}${fontSize}px ${options.fontFamily}`;

  // Optional letter spacing
  if (options.letterSpacing !== undefined && 'letterSpacing' in ctx) {
    try {
      (ctx as any).letterSpacing = `${options.letterSpacing}px`;
    } catch {}
  }

  const lineHeight = fontSize * (options.lineHeightMultiplier || 1.3);
  const align = options.align || 'center';

  // 2. Parse Paragraphs (Respect explicit \n line breaks)
  const rawParagraphs = text.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of rawParagraphs) {
    if (para.trim() === '') {
      lines.push('');
      continue;
    }

    const words = para.split(' ');
    let currentLine = '';

    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth <= boxWidthPx || !currentLine) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  // Handle maxLines if specified
  let finalLines = lines;
  if (options.maxLines && finalLines.length > options.maxLines) {
    finalLines = finalLines.slice(0, options.maxLines);
    if (finalLines.length > 0) {
      finalLines[finalLines.length - 1] = finalLines[finalLines.length - 1].replace(/\.+$/, '') + '...';
    }
  }

  // 3. Compute Vertical Positioning (Centered symmetrically at centerY)
  const totalLines = Math.max(1, finalLines.length);
  const startY = centerY - ((totalLines - 1) * lineHeight) / 2;

  // 4. Configure Alignment & Shadow
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';

  let drawX = centerX;
  if (align === 'left') {
    drawX = centerX - boxWidthPx / 2;
  } else if (align === 'right') {
    drawX = centerX + boxWidthPx / 2;
  }

  if (options.shadow !== false) {
    ctx.shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = options.shadowBlur ?? 14;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = options.shadowOffsetY ?? 3;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = options.color;

  // 5. Draw each line
  for (let i = 0; i < finalLines.length; i++) {
    const lineY = startY + i * lineHeight;
    const lineText = finalLines[i];
    if (lineText) {
      ctx.fillText(lineText, drawX, lineY);

      // Underline support if requested
      if (options.isUnderline) {
        const metrics = ctx.measureText(lineText);
        let lineStartX = drawX;
        if (align === 'center') {
          lineStartX = drawX - metrics.width / 2;
        } else if (align === 'right') {
          lineStartX = drawX - metrics.width;
        }
        const underlineY = lineY + fontSize * 0.45;
        ctx.save();
        ctx.strokeStyle = options.color;
        ctx.lineWidth = Math.max(1.5, fontSize * 0.05);
        ctx.beginPath();
        ctx.moveTo(lineStartX, underlineY);
        ctx.lineTo(lineStartX + metrics.width, underlineY);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  ctx.restore();
}

/**
 * Text Wrapping Utility with Max Lines support (legacy wrapper)
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 4
) {
  renderFormattedTextBlock(ctx, text, x, y, maxWidth, {
    fontSize: lineHeight / 1.3,
    fontFamily: ctx.font || 'sans-serif',
    color: (ctx.fillStyle as string) || '#ffffff',
    align: ctx.textAlign as any,
    lineHeightMultiplier: 1.3,
    maxLines,
  });
}

/**
 * Shape Path Generator for Canvas
 */
function drawShapePath(
  ctx: CanvasRenderingContext2D,
  shape: LogoShape | string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.beginPath();
  switch (shape) {
    case 'circle': {
      const radius = Math.min(w, h) / 2;
      ctx.arc(x + w / 2, y + h / 2, radius, 0, Math.PI * 2);
      break;
    }
    case 'square': {
      ctx.rect(x, y, w, h);
      break;
    }
    case 'rounded': {
      roundRect(ctx, x, y, w, h, Math.min(w, h) * 0.22);
      break;
    }
    case 'hexagon': {
      ctx.moveTo(x + w * 0.5, y);
      ctx.lineTo(x + w, y + h * 0.25);
      ctx.lineTo(x + w, y + h * 0.75);
      ctx.lineTo(x + w * 0.5, y + h);
      ctx.lineTo(x, y + h * 0.75);
      ctx.lineTo(x, y + h * 0.25);
      ctx.closePath();
      break;
    }
    case 'cut-corner': {
      const cut = Math.min(w, h) * 0.18;
      ctx.moveTo(x + cut, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h - cut);
      ctx.lineTo(x + w - cut, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + cut);
      ctx.closePath();
      break;
    }
    case 'badge': {
      const r = Math.min(w, h) * 0.15;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h * 0.65);
      ctx.quadraticCurveTo(x + w, y + h, x + w / 2, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h * 0.65);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      break;
    }
    case 'freeform':
    default: {
      roundRect(ctx, x, y, w, h, Math.min(w, h) * 0.32);
      break;
    }
  }
}

/**
 * Draw Right-Side or Floating Logo Box on Canvas
 */
function drawStyledLogoContainer(
  ctx: CanvasRenderingContext2D,
  logoImg: HTMLImageElement | null,
  shape: LogoShape | string,
  x: number,
  y: number,
  size: number,
  accentColor: string,
  isDoubleGold: boolean = false,
  fallbackLetter: string = ''
) {
  // If no logo image is provided or loaded, do not draw
  if (!logoImg || !logoImg.complete || logoImg.naturalWidth <= 0) {
    return;
  }

  ctx.save();
  // Transparent floating logo with subtle drop shadow (बॅग्राउंड ला काही नको)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  drawContainImage(ctx, logoImg, x, y, size, size);
  ctx.restore();
}

/**
 * Mobile Badge Helper on Canvas
 */
function drawMobileBadgePill(
  ctx: CanvasRenderingContext2D,
  mobileText: string,
  rightX: number,
  centerY: number,
  variant: 'solid' | 'outline' | 'pill',
  accentColor: string
): number {
  if (!mobileText) return 0;

  ctx.save();
  ctx.font = 'bold 22px "Outfit", sans-serif';
  const label = `📞 ${mobileText}`;
  const textWidth = ctx.measureText(label).width;
  const badgeWidth = textWidth + 34;
  const badgeHeight = 36;
  const badgeX = rightX - badgeWidth;
  const badgeY = centerY - badgeHeight / 2;

  if (variant === 'solid') {
    ctx.fillStyle = accentColor;
    roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, badgeX + badgeWidth / 2, centerY + 1);
  } else if (variant === 'outline') {
    ctx.fillStyle = 'rgba(6, 78, 59, 0.7)';
    roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 8);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, badgeX + badgeWidth / 2, centerY + 1);
  } else {
    // Default pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, badgeHeight / 2);
    ctx.fill();
    ctx.strokeStyle = `${accentColor}90`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, badgeX + badgeWidth / 2, centerY + 1);
  }

  ctx.restore();
  return badgeWidth;
}

/**
 * CANONICAL BUSINESS FOOTER RENDERER (ALL 27 FRAMES SUPPORTED)
 * Strictly occupies [canvasHeight - footerHeight, canvasHeight].
 */
export function drawCanonicalFooterOnCanvas(
  ctx: CanvasRenderingContext2D,
  frameId: FrameId,
  profile: BusinessProfile,
  config: Partial<FooterFrameConfig>,
  width: number,
  height: number,
  footerHeight: number,
  accentColor: string
) {
  const arrangement = config.arrangement || 'bottom';
  let frameY = height - footerHeight;
  let frameX = 0;
  let frameW = width;

  if (arrangement === 'top') {
    frameY = 0;
  } else if (arrangement === 'floating') {
    const margin = Math.round(width * 0.03);
    frameX = margin;
    frameW = width - margin * 2;
    frameY = height - footerHeight - Math.round(height * 0.025);
  }

  const normalizedId = frameId.startsWith('footer-') ? frameId : 'footer-01';

  // Find frame definition for default accents & shapes
  const frameDef = FOOTER_FRAMES.find((f) => f.id === normalizedId) || FOOTER_FRAMES[0];
  const effectiveAccent = config.accentColor || frameDef.accent || accentColor || '#f59e0b';
  const customBg = config.bgColor || frameDef.backgroundColor || '#090d16';
  const customText = config.textColor || frameDef.textColor || '#ffffff';
  const mutedText = frameDef.mutedTextColor || (frameDef.isLightBg ? '#475569' : '#cbd5e1');
  const isDarkTheme = config.colorMode === 'dark' || (!frameDef.isLightBg && config.colorMode !== 'light');

  // Dynamic font sizing & bold weight based on user configuration
  const fontMultiplier = config.customFontSize ? (config.customFontSize / 14) : 1;
  const isBoldWeight = config.isBold !== false ? 'bold' : 'normal';
  const getFont = (basePx: number, isSubText: boolean = false) => {
    const computedSize = Math.max(12, Math.round(basePx * fontMultiplier));
    const weight = isSubText ? (config.isBold ? '600' : 'normal') : isBoldWeight;
    return `${weight} ${computedSize}px "Outfit", "Noto Sans Devanagari", sans-serif`;
  };

  const showPersonal = config.showPersonalName !== false;
  const showCompany = config.showCompanyName !== false;
  const showDesignation = config.showDesignation !== false;
  const showMobile = config.showMobileNumber !== false;
  const showWork = config.showCompanyWork !== false;

  const personalName = showPersonal && profile.ownerName ? profile.ownerName.trim() : '';
  const companyName = showCompany && profile.name ? profile.name.trim() : '';
  const designation = showDesignation && profile.designation ? profile.designation.trim() : '';
  const mobileNumber =
    showMobile && (profile.phone || profile.whatsapp)
      ? (profile.phone || profile.whatsapp).trim()
      : '';
  const companyWork =
    showWork && (profile.tagline || (profile as any).companyWork)
      ? (profile.tagline || (profile as any).companyWork).trim()
      : '';

  // Right-side Logo Loading (Respects showCompanyLogo setting and deletion)
  const showLogo = config.showCompanyLogo !== false;
  const hasLogo = showLogo && !!profile.logoUrl && profile.logoUrl.trim() !== '';
  let logoImg: HTMLImageElement | null = null;
  if (hasLogo && profile.logoUrl) {
    logoImg = getCachedImage(profile.logoUrl);
    if (!logoImg) {
      preloadImage(profile.logoUrl).catch(() => {});
    }
  }

  // Leader / Personal Cutout Photo Loading (Pop-out above footer)
  let leaderImg: HTMLImageElement | null = null;
  if (profile.leaderPhotoUrl && profile.leaderPhotoUrl.trim() !== '') {
    leaderImg = getCachedImage(profile.leaderPhotoUrl);
    if (!leaderImg) {
      preloadImage(profile.leaderPhotoUrl).catch(() => {});
    }
  }

  const fallbackMonogram = companyName ? companyName.charAt(0) : personalName ? personalName.charAt(0) : '';

  ctx.save();

  // 1. Base Footer Background (Supports Bottom, Top, Floating)
  ctx.fillStyle = customBg;
  if (arrangement === 'floating') {
    roundRect(ctx, frameX, frameY, frameW, footerHeight, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillRect(frameX, frameY, frameW, footerHeight);
  }

  const leftMargin = frameX + 45;
  const rightMargin = (width - (frameX + frameW)) + 45;
  const logoBoxSize = Math.min(footerHeight * 0.72, 160);
  const logoX = frameX + frameW - 45 - logoBoxSize;
  const logoY = frameY + (footerHeight - logoBoxSize) / 2;

  // ----------------------------------------------------
  // SWITCH STATEMENT FOR ALL 27 UNIQUE FRAMES
  // ----------------------------------------------------
  switch (normalizedId) {
    // ==========================================
    // CATEGORY 1: 10 STANDARD FOOTER FRAMES
    // ==========================================

    // 1. FRAME 01 — CLEAN CORPORATE
    case 'footer-01': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(frameX, frameY, frameW, 4);

      // Row 1: Personal Name + Designation (left), Mobile Badge (right)
      const r1Y = frameY + footerHeight * 0.32;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = getFont(34);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = getFont(22, true);
          ctx.fillText(` (${designation})`, leftMargin + nameW + 12, r1Y);
        }
      }

      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, frameX + frameW - 45, r1Y, 'pill', effectiveAccent);
      }

      // Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftMargin, frameY + footerHeight * 0.58);
      ctx.lineTo(frameX + frameW - 45, frameY + footerHeight * 0.58);
      ctx.stroke();

      // Row 2: Company Name (left), Company Work (right)
      const r2Y = frameY + footerHeight * 0.80;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = getFont(26);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, leftMargin, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = getFont(20, true);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork.slice(0, 60), frameX + frameW - 45, r2Y);
      }
      break;
    }

    // 2. FRAME 02 — MODERN SPLIT
    case 'footer-02': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(frameX, frameY, frameW, 5);

      // Left Column: Name & Designation
      const lY1 = frameY + footerHeight * 0.30;
      const lY2 = frameY + footerHeight * 0.52;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = getFont(34);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, lY1);
      }
      if (designation) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = getFont(22, true);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(designation, leftMargin, lY2);
      }

      // Right Column: Company Name & Phone
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = getFont(28);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, frameX + frameW - 45, lY1);
      }
      if (mobileNumber) {
        ctx.fillStyle = '#34d399';
        ctx.font = getFont(24, true);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📞 ${mobileNumber}`, width - rightMargin, lY2);
      }

      // Bottom Row: Company Work centered
      if (companyWork) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.moveTo(leftMargin, frameY + footerHeight * 0.68);
        ctx.lineTo(width - rightMargin, frameY + footerHeight * 0.68);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width / 2, frameY + footerHeight * 0.85);
      }
      break;
    }

    // 3. FRAME 03 — BOLD BUSINESS
    case 'footer-03': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 8);

      const r1Y = frameY + footerHeight * 0.34;
      // Accent bullet dot
      ctx.fillStyle = effectiveAccent;
      ctx.beginPath();
      ctx.arc(leftMargin + 6, r1Y, 7, 0, Math.PI * 2);
      ctx.fill();

      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin + 24, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          const desX = leftMargin + 24 + nameW + 16;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
          roundRect(ctx, desX, r1Y - 14, 180, 28, 6);
          ctx.fill();

          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'bold 20px "Outfit", sans-serif';
          ctx.fillText(designation, desX + 12, r1Y);
        }
      }

      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'solid', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.76;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width - rightMargin, r2Y);
      }
      break;
    }

    // 4. FRAME 04 — ELEGANT LINE
    case 'footer-04': {
      const centerY = frameY + footerHeight * 0.30;
      if (personalName) {
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        const nameW = ctx.measureText(personalName).width;

        // Fading lines
        const gradL = ctx.createLinearGradient(leftMargin, centerY, width / 2 - nameW / 2 - 20, centerY);
        gradL.addColorStop(0, 'rgba(245, 158, 11, 0)');
        gradL.addColorStop(1, effectiveAccent);
        ctx.strokeStyle = gradL;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftMargin, centerY);
        ctx.lineTo(width / 2 - nameW / 2 - 20, centerY);
        ctx.stroke();

        ctx.fillStyle = effectiveAccent;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, width / 2, centerY);

        const gradR = ctx.createLinearGradient(width / 2 + nameW / 2 + 20, centerY, width - rightMargin, centerY);
        gradR.addColorStop(0, effectiveAccent);
        gradR.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.strokeStyle = gradR;
        ctx.beginPath();
        ctx.moveTo(width / 2 + nameW / 2 + 20, centerY);
        ctx.lineTo(width - rightMargin, centerY);
        ctx.stroke();
      }

      // Middle Info Row
      const r2Y = frameY + footerHeight * 0.60;
      ctx.font = 'bold 24px "Outfit", "Noto Sans Devanagari", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const parts = [
        companyName ? `🏢 ${companyName}` : '',
        designation ? designation : '',
        mobileNumber ? `📞 ${mobileNumber}` : '',
      ].filter(Boolean);
      ctx.fillStyle = customText;
      ctx.fillText(parts.join('   •   '), width / 2, r2Y);

      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.fillText(companyWork, width / 2, frameY + footerHeight * 0.85);
      }
      break;
    }

    // 5. FRAME 05 — LEFT ACCENT
    case 'footer-05': {
      // Left vertical bar
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, 14, footerHeight);

      const contentLeft = 55;
      const r1Y = frameY + footerHeight * 0.35;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, contentLeft, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` | ${designation}`, contentLeft + nameW + 10, r1Y);
        }
      }

      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'pill', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.75;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 26px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, contentLeft, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width - rightMargin, r2Y);
      }
      break;
    }

    // 6. FRAME 06 — CENTERED PROFESSIONAL
    case 'footer-06': {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, frameY);
      ctx.lineTo(width, frameY);
      ctx.stroke();

      const r1Y = frameY + footerHeight * 0.30;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 36px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, width / 2, r1Y);
      }

      const r2Y = frameY + footerHeight * 0.60;
      ctx.font = 'bold 24px "Outfit", "Noto Sans Devanagari", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const rowParts: string[] = [];
      if (companyName) rowParts.push(companyName);
      if (designation) rowParts.push(`(${designation})`);
      if (mobileNumber) rowParts.push(`📞 ${mobileNumber}`);
      ctx.fillStyle = effectiveAccent;
      ctx.fillText(rowParts.join('   •   '), width / 2, r2Y);

      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.fillText(companyWork, width / 2, frameY + footerHeight * 0.85);
      }
      break;
    }

    // 7. FRAME 07 — BUSINESS CARD
    case 'footer-07': {
      // Inset business card box
      const cardX = 25;
      const cardY = frameY + 12;
      const cardW = width - 50;
      const cardH = footerHeight - 24;

      ctx.fillStyle = isDarkTheme ? '#0b1120' : '#ffffff';
      roundRect(ctx, cardX, cardY, cardW, cardH, 18);
      ctx.fill();
      ctx.strokeStyle = `${effectiveAccent}80`;
      ctx.lineWidth = 2;
      ctx.stroke();

      const cLeft = cardX + 30;
      const cRight = cardX + cardW - 30;

      // Left Column
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 32px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, cLeft, cardY + cardH * 0.30);
      }
      if (designation) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(designation, cLeft, cardY + cardH * 0.58);
      }
      if (companyWork) {
        ctx.fillStyle = '#64748b';
        ctx.font = 'italic 18px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, cLeft, cardY + cardH * 0.82);
      }

      // Right Column
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, cRight, cardY + cardH * 0.32);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, cRight, cardY + cardH * 0.72, 'outline', effectiveAccent);
      }
      break;
    }

    // 8. FRAME 08 — PREMIUM BORDER
    case 'footer-08': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 4);

      // Inner dashed box
      const boxX = 24;
      const boxY = frameY + 14;
      const boxW = width - 48;
      const boxH = footerHeight - 28;

      ctx.save();
      ctx.strokeStyle = `${effectiveAccent}70`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      roundRect(ctx, boxX, boxY, boxW, boxH, 12);
      ctx.stroke();
      ctx.restore();

      const r1Y = boxY + boxH * 0.35;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 32px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`✨ ${personalName}`, boxX + 24, r1Y);

        if (designation) {
          const nameW = ctx.measureText(`✨ ${personalName}`).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, boxX + 24 + nameW + 10, r1Y);
        }
      }

      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, boxX + boxW - 20, r1Y, 'solid', effectiveAccent);
      }

      const r2Y = boxY + boxH * 0.75;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`★ ${companyName}`, boxX + 24, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, boxX + boxW - 20, r2Y);
      }
      break;
    }

    // 9. FRAME 09 — DOUBLE DIVIDER
    case 'footer-09': {
      // Row 1: Personal Name + Designation badge
      const r1Y = frameY + footerHeight * 0.28;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 32px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);
      }
      if (designation) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        roundRect(ctx, width - rightMargin - 180, r1Y - 16, 180, 32, 8);
        ctx.fill();
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 20px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(designation, width - rightMargin - 90, r1Y);
      }

      // Divider 1
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.beginPath();
      ctx.moveTo(leftMargin, frameY + footerHeight * 0.48);
      ctx.lineTo(width - rightMargin, frameY + footerHeight * 0.48);
      ctx.stroke();

      // Row 2: Company + Mobile
      const r2Y = frameY + footerHeight * 0.68;
      if (companyName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, leftMargin, r2Y);
      }
      if (mobileNumber) {
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 24px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📞 ${mobileNumber}`, width - rightMargin, r2Y);
      }

      // Row 3: Tagline
      if (companyWork) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 18px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, frameY + footerHeight * 0.88);
      }
      break;
    }

    // 10. FRAME 10 — MINIMAL MODERN
    case 'footer-10': {
      const r1Y = frameY + footerHeight * 0.35;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + nameW + 10, r1Y);
        }
      }

      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'pill', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.72;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }
      if (companyWork) {
        const cNameW = companyName ? ctx.measureText(companyName).width + 16 : 0;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`• ${companyWork}`, leftMargin + cNameW, r2Y);
      }
      break;
    }

    // ==========================================
    // CATEGORY 2: 10 RIGHT-SIDE LOGO FOOTER FRAMES
    // ==========================================

    // 11. FRAME 11 — RIGHT SQUARE LOGO
    case 'footer-11': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 5);

      drawStyledLogoContainer(ctx, logoImg, 'square', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.30;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + nameW + 10, r1Y);
        }
      }

      const r2Y = frameY + footerHeight * 0.58;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, logoX - 20, r2Y, 'outline', effectiveAccent);
      }

      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, frameY + footerHeight * 0.84);
      }
      break;
    }

    // 12. FRAME 12 — RIGHT CIRCLE LOGO
    case 'footer-12': {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, frameY);
      ctx.lineTo(width, frameY);
      ctx.stroke();

      drawStyledLogoContainer(ctx, logoImg, 'circle', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.32;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, logoX - 20, r1Y, 'pill', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.62;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }

      const r3Y = frameY + footerHeight * 0.85;
      const metaParts = [designation, companyWork].filter(Boolean);
      if (metaParts.length > 0) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(metaParts.join('   •   '), leftMargin, r3Y);
      }
      break;
    }

    // 13. FRAME 13 — RIGHT ROUNDED LOGO
    case 'footer-13': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 5);

      drawStyledLogoContainer(ctx, logoImg, 'rounded', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.30;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);
      }
      if (designation) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        roundRect(ctx, logoX - 200, r1Y - 14, 180, 28, 6);
        ctx.fill();
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 20px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(designation, logoX - 110, r1Y);
      }

      const r2Y = frameY + footerHeight * 0.58;
      if (companyName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, leftMargin, r2Y);
      }
      if (mobileNumber) {
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 22px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📞 ${mobileNumber}`, logoX - 20, r2Y);
      }

      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, frameY + footerHeight * 0.84);
      }
      break;
    }

    // 14. FRAME 14 — RIGHT HEXAGON LOGO
    case 'footer-14': {
      drawStyledLogoContainer(ctx, logoImg, 'hexagon', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.30;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` | ${designation}`, leftMargin + nameW + 10, r1Y);
        }
      }

      const r2Y = frameY + footerHeight * 0.58;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }

      const r3Y = frameY + footerHeight * 0.84;
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, r3Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, logoX - 20, r3Y, 'solid', effectiveAccent);
      }
      break;
    }

    // 15. FRAME 15 — RIGHT DIAGONAL LOGO
    case 'footer-15': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 5);

      // Diagonal background stripe
      ctx.save();
      ctx.fillStyle = `${effectiveAccent}25`;
      ctx.beginPath();
      ctx.moveTo(width - logoBoxSize - 90, frameY + footerHeight);
      ctx.lineTo(width - logoBoxSize - 20, frameY);
      ctx.lineTo(width, frameY);
      ctx.lineTo(width, frameY + footerHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      drawStyledLogoContainer(ctx, logoImg, 'rounded', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.30;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);
      }

      const r2Y = frameY + footerHeight * 0.58;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);

        if (designation) {
          const compW = ctx.measureText(companyName).width;
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + compW + 10, r2Y);
        }
      }

      const r3Y = frameY + footerHeight * 0.84;
      if (companyWork) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, r3Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, logoX - 40, r3Y, 'pill', effectiveAccent);
      }
      break;
    }

    // 16. FRAME 16 — RIGHT FLOATING LOGO
    case 'footer-16': {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, frameY);
      ctx.lineTo(width, frameY);
      ctx.stroke();

      drawStyledLogoContainer(ctx, logoImg, 'circle', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.30;
      ctx.fillStyle = effectiveAccent;
      ctx.beginPath();
      ctx.arc(leftMargin + 6, r1Y, 6, 0, Math.PI * 2);
      ctx.fill();

      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin + 20, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` • ${designation}`, leftMargin + 20 + nameW + 10, r1Y);
        }
      }

      const r2Y = frameY + footerHeight * 0.58;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }

      const r3Y = frameY + footerHeight * 0.84;
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, r3Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, logoX - 20, r3Y, 'outline', effectiveAccent);
      }
      break;
    }

    // 17. FRAME 17 — RIGHT BADGE LOGO
    case 'footer-17': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 5);

      drawStyledLogoContainer(ctx, logoImg, 'badge', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.32;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, logoX - 20, r1Y, 'solid', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.60;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);

        if (designation) {
          const compW = ctx.measureText(companyName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + compW + 10, r2Y);
        }
      }

      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, frameY + footerHeight * 0.84);
      }
      break;
    }

    // 18. FRAME 18 — RIGHT CUT-CORNER LOGO
    case 'footer-18': {
      drawStyledLogoContainer(ctx, logoImg, 'cut-corner', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.30;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);
      }

      const r2Y = frameY + footerHeight * 0.58;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, leftMargin, r2Y);
      }
      if (mobileNumber) {
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 22px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📞 ${mobileNumber}`, logoX - 20, r2Y);
      }

      const r3Y = frameY + footerHeight * 0.84;
      const meta = [designation, companyWork].filter(Boolean);
      if (meta.length > 0) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(meta.join('   •   '), leftMargin, r3Y);
      }
      break;
    }

    // 19. FRAME 19 — RIGHT CREATIVE LOGO
    case 'footer-19': {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, frameY);
      ctx.lineTo(width, frameY);
      ctx.stroke();

      drawStyledLogoContainer(ctx, logoImg, 'freeform', logoX, logoY, logoBoxSize, effectiveAccent, false, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.30;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`✨ ${personalName}`, leftMargin, r1Y);

        if (designation) {
          const nameW = ctx.measureText(`✨ ${personalName}`).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + nameW + 10, r1Y);
        }
      }

      const r2Y = frameY + footerHeight * 0.58;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }

      const r3Y = frameY + footerHeight * 0.84;
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, r3Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, logoX - 20, r3Y, 'pill', effectiveAccent);
      }
      break;
    }

    // 20. FRAME 20 — RIGHT PREMIUM LOGO
    case 'footer-20': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 5);

      drawStyledLogoContainer(ctx, logoImg, 'circle', logoX, logoY, logoBoxSize, effectiveAccent, true, fallbackMonogram);

      const r1Y = frameY + footerHeight * 0.30;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 32px "Cinzel", "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r1Y);
      }

      const r2Y = frameY + footerHeight * 0.58;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 28px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r2Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + nameW + 10, r2Y);
        }
      }

      const r3Y = frameY + footerHeight * 0.84;
      if (companyWork) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, r3Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, logoX - 20, r3Y, 'solid', effectiveAccent);
      }
      break;
    }

    // ==========================================
    // CATEGORY 3: 7 TOP-RIGHT FLOATING LOGO FOOTER BARS
    // ==========================================

    // 21. FRAME 21 — FLOATING CIRCLE LOGO
    case 'footer-21': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 4);

      const r1Y = frameY + footerHeight * 0.35;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + nameW + 10, r1Y);
        }
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'pill', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.75;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, leftMargin, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width - rightMargin, r2Y);
      }
      break;
    }

    // 22. FRAME 22 — FLOATING SQUARE LOGO
    case 'footer-22': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 6);

      const r1Y = frameY + footerHeight * 0.32;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 30px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, leftMargin, r1Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'outline', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.72;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 28px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r2Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` • ${designation}`, leftMargin + nameW + 10, r2Y);
        }
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width - rightMargin, r2Y);
      }
      break;
    }

    // 23. FRAME 23 — FLOATING ROUNDED LOGO
    case 'footer-23': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 5);

      const r1Y = frameY + footerHeight * 0.32;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);
      }
      if (designation) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        roundRect(ctx, width - rightMargin - 180, r1Y - 14, 180, 28, 6);
        ctx.fill();
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 20px "Outfit", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(designation, width - rightMargin - 90, r1Y);
      }

      const r2Y = frameY + footerHeight * 0.68;
      if (companyName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 26px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, leftMargin, r2Y);
      }
      if (mobileNumber) {
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 22px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(`📞 ${mobileNumber}`, width - rightMargin, r2Y);
      }

      if (companyWork) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 18px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, frameY + footerHeight * 0.88);
      }
      break;
    }

    // 24. FRAME 24 — FLOATING BADGE
    case 'footer-24': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 5);

      const r1Y = frameY + footerHeight * 0.35;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`★ ${personalName}`, leftMargin, r1Y);

        if (designation) {
          const nameW = ctx.measureText(`★ ${personalName}`).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + nameW + 10, r1Y);
        }
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'solid', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.75;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width - rightMargin, r2Y);
      }
      break;
    }

    // 25. FRAME 25 — FLOATING FREEFORM
    case 'footer-25': {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, frameY);
      ctx.lineTo(width, frameY);
      ctx.stroke();

      const r1Y = frameY + footerHeight * 0.35;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`✨ ${personalName}`, leftMargin, r1Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'pill', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.75;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width - rightMargin, r2Y);
      }
      break;
    }

    // 26. FRAME 26 — FLOATING GEOMETRIC
    case 'footer-26': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 4);

      const r1Y = frameY + footerHeight * 0.32;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#94a3b8';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` | ${designation}`, leftMargin + nameW + 10, r1Y);
        }
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'outline', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.72;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width - rightMargin, r2Y);
      }
      break;
    }

    // 27. FRAME 27 — PREMIUM BUSINESS
    case 'footer-27': {
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 5);

      const r1Y = frameY + footerHeight * 0.30;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 32px "Cinzel", "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyName, leftMargin, r1Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'solid', effectiveAccent);
      }

      const r2Y = frameY + footerHeight * 0.65;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 28px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r2Y);

        if (designation) {
          const nameW = ctx.measureText(personalName).width;
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '22px "Outfit", sans-serif';
          ctx.fillText(` (${designation})`, leftMargin + nameW + 10, r2Y);
        }
      }

      if (companyWork) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 18px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, leftMargin, frameY + footerHeight * 0.88);
      }
      break;
    }

    default: {
      // Fallback clean corporate
      ctx.fillStyle = effectiveAccent;
      ctx.fillRect(0, frameY, width, 4);

      const r1Y = frameY + footerHeight * 0.35;
      if (personalName) {
        ctx.fillStyle = customText;
        ctx.font = 'bold 34px "Outfit", "Noto Sans Devanagari", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, leftMargin, r1Y);
      }
      if (mobileNumber) {
        drawMobileBadgePill(ctx, mobileNumber, width - rightMargin, r1Y, 'pill', effectiveAccent);
      }
      const r2Y = frameY + footerHeight * 0.75;
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = 'bold 28px "Outfit", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`🏢 ${companyName}`, leftMargin, r2Y);
      }
      if (companyWork) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'italic 20px "Outfit", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(companyWork, width - rightMargin, r2Y);
      }
      break;
    }

    // ==========================================
    // BANNER PORTRAIT POP-OUT PHOTO FRAMES (28 to 35)
    // Contains ONLY: Marathi Name, Business, Designation, Mobile
    // Pop-out Photo rises 55% above frame height
    // ==========================================
    case 'footer-28':
    case 'footer-29':
    case 'footer-30':
    case 'footer-31':
    case 'footer-32':
    case 'footer-33':
    case 'footer-34':
    case 'footer-35': {
      const isPhotoRight = frameDef.leaderPhotoPosition === 'right';
      const photoH = Math.round(footerHeight * 1.55);
      const photoW = Math.round(footerHeight * 1.2);
      const photoY = frameY - (photoH - footerHeight);
      const photoX = isPhotoRight ? width - rightMargin - photoW : leftMargin;

      // 1. Draw frame background bar
      ctx.fillStyle = customBg || frameDef.backgroundColor || '#090d16';
      ctx.fillRect(frameX, frameY, frameW, footerHeight);

      // 2. Draw accent border
      ctx.strokeStyle = effectiveAccent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(frameX, frameY);
      ctx.lineTo(frameX + frameW, frameY);
      ctx.stroke();

      // 3. Draw Cutout Photo popping out above frame
      if (leaderImg && leaderImg.complete && leaderImg.naturalWidth > 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = -6;
        drawContainImage(ctx, leaderImg, photoX, photoY, photoW, photoH);
        ctx.restore();
      }

      // 4. Content Area
      const textStartX = isPhotoRight ? leftMargin : photoX + photoW + 20;
      const r1Y = frameY + footerHeight * 0.35;
      const r2Y = frameY + footerHeight * 0.72;

      // Marathi Name (Bold font)
      if (personalName) {
        ctx.fillStyle = customText || frameDef.textColor || '#ffffff';
        ctx.font = `bold ${Math.round(footerHeight * 0.22)}px "Noto Sans Devanagari", "Outfit", sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(personalName, textStartX, r1Y);

        // Designation pill/badge
        if (designation) {
          const nameWidth = ctx.measureText(personalName).width;
          const desX = textStartX + nameWidth + 16;
          ctx.font = `bold ${Math.round(footerHeight * 0.14)}px "Noto Sans Devanagari", sans-serif`;
          const desW = ctx.measureText(designation).width + 16;
          const desH = Math.round(footerHeight * 0.22);
          ctx.fillStyle = effectiveAccent;
          roundRect(ctx, desX, r1Y - desH / 2, desW, desH, 6);
          ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.textAlign = 'center';
          ctx.fillText(designation, desX + desW / 2, r1Y + 1);
        }
      }

      // Mobile Badge
      if (mobileNumber) {
        const mobX = isPhotoRight ? photoX - 16 : width - rightMargin;
        drawMobileBadgePill(ctx, mobileNumber, mobX, r1Y, 'pill', effectiveAccent);
      }

      // Row 2: Company / Business Name
      if (companyName) {
        ctx.fillStyle = effectiveAccent;
        ctx.font = `bold ${Math.round(footerHeight * 0.18)}px "Noto Sans Devanagari", "Outfit", sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`★ ${companyName}`, textStartX, r2Y);
      }
      break;
    }
  }

  ctx.restore();
}

/**
 * THE SINGLE CANONICAL POSTER RENDERER
 * Renders the entire Poster Document directly onto a Canvas element.
 * Guaranteed 100% identical composition between Editor Preview and Downloaded Image.
 */
export async function renderPosterDocumentToCanvas(
  doc: PosterRenderDocument,
  existingCanvas?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  await ensureFontsReady();

  // 1. Format & Dimensions Setup
  const format = doc.formatConfig || getPosterFormatByRatio(doc.aspectRatio);
  const width = format.width || 1080;
  const height = format.height || 1080;

  // 2. Strict Dynamic Footer & Content Math (Admin Adjustable: Compact 14%, Regular 18%, Large 24%, Extra Large 28%, or 10-35% Slider)
  const showFooter = doc.showFooter !== false;
  const frameHeightPercent = doc.footerConfig?.frameHeightPercent || (
    doc.footerConfig?.frameSizePreset === 'compact' ? 14 :
    doc.footerConfig?.frameSizePreset === 'regular' ? 18 :
    doc.footerConfig?.frameSizePreset === 'large' ? 24 :
    doc.footerConfig?.frameSizePreset === 'extralarge' ? 28 : 20
  );
  const heightRatio = Math.min(Math.max(frameHeightPercent, 10), 35) / 100;
  const footerHeight = showFooter ? Math.round(height * heightRatio) : 0;
  const contentHeight = height - footerHeight;
  const footerY = contentHeight;

  // 3. Canvas Initialization
  const canvas = existingCanvas || document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) {
    throw new Error('Could not get Canvas 2D rendering context');
  }

  ctx.clearRect(0, 0, width, height);

  // 4. Background Layer
  if (doc.customBgImage) {
    let bgImg = getCachedImage(doc.customBgImage);
    if (!bgImg && doc.customBgImage) {
      try {
        bgImg = await preloadImage(doc.customBgImage);
      } catch {}
    }
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      drawCoverImage(ctx, bgImg, 0, 0, width, height);
    } else {
      drawGradientBackground(
        ctx,
        doc.customBgGradient || doc.template.theme.bgGradient,
        width,
        height
      );
    }
  } else {
    drawGradientBackground(
      ctx,
      doc.customBgGradient || doc.template.theme.bgGradient,
      width,
      height
    );
  }

  // 5. Decorative Ambient Glow
  ctx.save();
  const auraGrad = ctx.createRadialGradient(
    width / 2,
    contentHeight * 0.35,
    50,
    width / 2,
    contentHeight * 0.35,
    width * 0.5
  );
  auraGrad.addColorStop(0, `${doc.template.theme.accentColor || '#f59e0b'}30`);
  auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = auraGrad;
  ctx.fillRect(0, 0, width, contentHeight);
  ctx.restore();

  // 6. User-Controlled Date on Poster (ONLY if showDate is explicitly enabled)
  const isDateEnabled = (doc as any).showDate === true || (doc.dateBadgeStyle as any)?.showDate === true;
  const rawDateText = doc.dateBadgeStyle?.text;
  
  // Filter out automatic UI labels like Trending, Upcoming, Festival Special, etc.
  const isExcludedAutoLabel = (text?: string) => {
    if (!text) return true;
    const lower = text.toLowerCase().trim();
    return (
      lower.includes('trending') ||
      lower.includes('upcoming') ||
      lower.includes('festival special') ||
      lower.includes('special') ||
      lower.includes('date story') ||
      lower.includes('15s') ||
      lower.includes('video')
    );
  };

  const badgeText = isDateEnabled && rawDateText && !isExcludedAutoLabel(rawDateText) ? rawDateText : '';

  if (isDateEnabled && badgeText && badgeText.trim() !== '' && !doc.dateBadgeStyle?.isHidden) {
    const badgeX = ((doc.dateBadgeStyle?.x ?? 50) / 100) * width;
    const badgeY = ((doc.dateBadgeStyle?.y ?? 7) / 100) * contentHeight;
    const badgeFontSize = (doc.dateBadgeStyle?.fontSize || 14) * 1.8;

    ctx.save();
    ctx.font = `bold ${badgeFontSize}px "Noto Sans Devanagari", "Baloo 2", sans-serif`;
    const label = `${badgeText.trim()}`;
    const textMetrics = ctx.measureText(label);
    const badgeW = textMetrics.width + 44;
    const badgeH = badgeFontSize * 2;

    const bX = badgeX - badgeW / 2;
    const bY = badgeY - badgeH / 2;

    ctx.fillStyle = doc.dateBadgeStyle?.bgColor || 'rgba(0, 0, 0, 0.70)';
    roundRect(ctx, bX, bY, badgeW, badgeH, badgeH / 2);
    ctx.fill();

    ctx.strokeStyle = doc.template.theme.accentColor || '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = doc.dateBadgeStyle?.color || doc.template.theme.accentColor || '#fde047';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, badgeX, badgeY + 1);
    ctx.restore();
  }

  // 7. Dedicated Top-Right Company Logo (Inside safe content height)
  const isTopRightCategory = [
    'footer-21',
    'footer-22',
    'footer-23',
    'footer-24',
    'footer-25',
    'footer-26',
    'footer-27',
    'footer-28',
    'footer-30',
    'footer-32',
    'footer-34',
  ].includes(doc.frameId);

  // If user explicitly deleted/removed top logo or company logo, or showCompanyLogo is false, do not show!
  const showCompanyLogo = doc.footerConfig?.showCompanyLogo !== false;
  const isLogoExplicitlyDeleted = doc.companyLogoUrl === '' || (doc.companyLogoUrl === null && doc.footerConfig?.showCompanyLogo === false);
  const topLogoUrl = (!showCompanyLogo || isLogoExplicitlyDeleted)
    ? ''
    : (doc.companyLogoUrl || (isTopRightCategory && doc.profile.logoUrl ? doc.profile.logoUrl : ''));

  if (topLogoUrl && topLogoUrl.trim() !== '') {
    const logoXNorm = doc.companyLogoPosition?.x ?? 86;
    const logoYNorm = Math.max(doc.companyLogoPosition?.y ?? 8.5, 7.5);
    const logoSizeNorm = doc.companyLogoPosition?.size ?? 13;

    const compLogoX = (logoXNorm / 100) * width;
    const compLogoY = (logoYNorm / 100) * contentHeight;
    const compLogoSize = (logoSizeNorm / 100) * width;

    let compImg = getCachedImage(topLogoUrl);
    if (!compImg) {
      try {
        compImg = await preloadImage(topLogoUrl);
      } catch {}
    }

    // Determine shape & styling based on frame ID
    let shape: LogoShape | string = doc.footerConfig?.logoShape || 'rounded';
    let isDoubleGold = false;

    if (doc.frameId === 'footer-21') shape = 'circle';
    else if (doc.frameId === 'footer-22') shape = 'square';
    else if (doc.frameId === 'footer-23') shape = 'rounded';
    else if (doc.frameId === 'footer-24') shape = 'badge';
    else if (doc.frameId === 'footer-25') shape = 'freeform';
    else if (doc.frameId === 'footer-26') shape = 'hexagon';
    else if (doc.frameId === 'footer-27') {
      shape = 'circle';
      isDoubleGold = true;
    }

    const frameDef = FOOTER_FRAMES.find((f) => f.id === doc.frameId);
    const effectiveAccent = doc.footerConfig?.accentColor || frameDef?.accent || doc.template.theme.accentColor || '#f59e0b';
    const fallbackLetter = doc.profile.name ? doc.profile.name.charAt(0) : '';

    drawStyledLogoContainer(
      ctx,
      compImg,
      shape,
      compLogoX - compLogoSize / 2,
      compLogoY - compLogoSize / 2,
      compLogoSize,
      effectiveAccent,
      isDoubleGold,
      fallbackLetter
    );
  }

  // 8. Central Vector Motif / Artwork (Inside safe content height - respects isHidden deletion)
  const isImageAlreadyBg = Boolean(
    doc.customBgImage && (
      doc.customBgImage === doc.template.imageUrl ||
      doc.customBgImage === doc.template.customBgUrl ||
      doc.template.isCustomUpload ||
      doc.template.id.startsWith('tpl-admin-') ||
      doc.template.id.startsWith('tpl-custom-')
    )
  );

  if (!doc.motifStyle?.isHidden && !isImageAlreadyBg) {
    const motifX = ((doc.motifStyle?.x ?? 50) / 100) * width;
    const motifY = ((doc.motifStyle?.y ?? 32) / 100) * contentHeight;
    const motifScale = doc.motifStyle?.scale ?? 1;
    const motifSize = ((doc.motifStyle?.size ?? 38) / 100) * width * motifScale;

    if (doc.template.imageUrl && !isImageAlreadyBg) {
      let artImg = getCachedImage(doc.template.imageUrl);
      if (!artImg) {
        try {
          artImg = await preloadImage(doc.template.imageUrl);
        } catch {}
      }
      if (artImg && artImg.complete && artImg.naturalWidth > 0) {
        ctx.save();
        ctx.translate(motifX, motifY);
        if (doc.motifStyle?.rotation) {
          ctx.rotate((doc.motifStyle.rotation * Math.PI) / 180);
        }
        drawContainImage(
          ctx,
          artImg,
          -motifSize / 2,
          -motifSize / 2,
          motifSize,
          motifSize
        );
        ctx.restore();
      }
    } else if (doc.template.motifType && (doc.template.motifType as string) !== 'none') {
      // Generate Vector SVG motif and render via data URL image
      const motifType = doc.motifStyle?.type || doc.template.motifType;
      const primColor = doc.motifStyle?.primaryColor || doc.template.theme.primaryColor;
      const accColor = doc.motifStyle?.accentColor || doc.template.theme.accentColor;
      const svgXml = getMotifSvgXml(motifType, primColor, accColor);
      const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgXml)}`;

      let motifImg = getCachedImage(dataUri);
      if (!motifImg) {
        try {
          motifImg = await preloadImage(dataUri);
        } catch {}
      }

      if (motifImg && motifImg.complete && motifImg.naturalWidth > 0) {
        ctx.save();
        ctx.translate(motifX, motifY);
        if (doc.motifStyle?.rotation) {
          ctx.rotate((doc.motifStyle.rotation * Math.PI) / 180);
        }
        ctx.drawImage(
          motifImg,
          -motifSize / 2,
          -motifSize / 2,
          motifSize,
          motifSize
        );
        ctx.restore();
      }
    }
  }

  // 9. Main Headline Text (Inside safe content height)
  const headlineText = doc.headlineStyle?.text || doc.customHeadline || doc.template.headline;
  if (headlineText && headlineText.trim() !== '' && !doc.headlineStyle?.isHidden) {
    const hlX = ((doc.headlineStyle?.x ?? 50) / 100) * width;
    const hlY = ((doc.headlineStyle?.y ?? 55) / 100) * contentHeight;
    const hlFontSize = (doc.headlineStyle?.fontSize || 32) * 1.8;
    const hlFontFamily =
      doc.headlineStyle?.fontFamily || "'Yatra One', 'Rozha One', 'Baloo 2', sans-serif";
    const hlBoxWidth = ((doc.headlineStyle?.boxWidth ?? 88) / 100) * width;

    renderFormattedTextBlock(
      ctx,
      headlineText,
      hlX,
      hlY,
      hlBoxWidth,
      {
        fontSize: hlFontSize,
        fontFamily: hlFontFamily,
        isBold: doc.headlineStyle?.isBold ?? doc.headlineStyle?.bold ?? true,
        isItalic: doc.headlineStyle?.isItalic,
        isUnderline: doc.headlineStyle?.isUnderline,
        color: doc.headlineStyle?.color || doc.template.theme.accentColor || '#fde047',
        align: doc.headlineStyle?.align || 'center',
        lineHeightMultiplier: doc.headlineStyle?.lineHeight || 1.25,
        letterSpacing: doc.headlineStyle?.letterSpacing,
        shadow: doc.headlineStyle?.shadow !== false,
        shadowColor: doc.headlineStyle?.shadowColor || 'rgba(0, 0, 0, 0.9)',
        shadowBlur: doc.headlineStyle?.shadowBlur ?? 16,
        maxLines: 4,
      }
    );
  }

  // 10. Subtext / Greeting Wishes (Inside safe content height)
  const subtextText = doc.subtextStyle?.text || doc.customSubtext || doc.template.subtext;
  if (subtextText && subtextText.trim() !== '' && !doc.subtextStyle?.isHidden) {
    const stX = ((doc.subtextStyle?.x ?? 50) / 100) * width;
    const stY = ((doc.subtextStyle?.y ?? 70) / 100) * contentHeight;
    const stFontSize = (doc.subtextStyle?.fontSize || 18) * 1.7;
    const stFontFamily =
      doc.subtextStyle?.fontFamily || "'Baloo 2', 'Noto Sans Devanagari', sans-serif";
    const stBoxWidth = ((doc.subtextStyle?.boxWidth ?? 86) / 100) * width;

    renderFormattedTextBlock(
      ctx,
      subtextText,
      stX,
      stY,
      stBoxWidth,
      {
        fontSize: stFontSize,
        fontFamily: stFontFamily,
        isBold: doc.subtextStyle?.isBold ?? doc.subtextStyle?.bold ?? false,
        isItalic: doc.subtextStyle?.isItalic,
        isUnderline: doc.subtextStyle?.isUnderline,
        color: doc.subtextStyle?.color || doc.template.theme.textColor || '#ffffff',
        align: doc.subtextStyle?.align || 'center',
        lineHeightMultiplier: doc.subtextStyle?.lineHeight || 1.35,
        letterSpacing: doc.subtextStyle?.letterSpacing,
        shadow: doc.subtextStyle?.shadow !== false,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowBlur: 10,
        maxLines: 4,
      }
    );
  }

  // 11. Quote Text (Inside safe content height)
  const quoteText = doc.quoteStyle?.text || doc.customQuote || doc.template.quote;
  if (quoteText && quoteText.trim() !== '' && !doc.quoteStyle?.isHidden) {
    const qtX = ((doc.quoteStyle?.x ?? 50) / 100) * width;
    const qtY = ((doc.quoteStyle?.y ?? 84) / 100) * contentHeight;
    const qtFontSize = (doc.quoteStyle?.fontSize || 14) * 1.6;
    const qtFontFamily =
      doc.quoteStyle?.fontFamily || "'Kalam', 'Noto Sans Devanagari', cursive";
    const qtBoxWidth = ((doc.quoteStyle?.boxWidth ?? 82) / 100) * width;

    renderFormattedTextBlock(
      ctx,
      `“ ${quoteText.trim()} ”`,
      qtX,
      qtY,
      qtBoxWidth,
      {
        fontSize: qtFontSize,
        fontFamily: qtFontFamily,
        isBold: doc.quoteStyle?.isBold,
        isItalic: doc.quoteStyle?.isItalic !== false,
        isUnderline: doc.quoteStyle?.isUnderline,
        color: doc.quoteStyle?.color || '#cbd5e1',
        align: doc.quoteStyle?.align || 'center',
        lineHeightMultiplier: doc.quoteStyle?.lineHeight || 1.35,
        letterSpacing: doc.quoteStyle?.letterSpacing,
        shadow: doc.quoteStyle?.shadow !== false,
        maxLines: 3,
      }
    );
  }

  // 12. Custom Elements (Stickers, Shapes, Text Boxes, Uploaded Photos)
  if (doc.customElements && doc.customElements.length > 0) {
    for (const el of doc.customElements) {
      if (el.isHidden) continue;
      const elX = (el.x / 100) * width;
      const elY = (el.y / 100) * contentHeight;
      const elW = ((el.boxWidth || el.width || 20) / 100) * width;
      const elH = ((el.boxHeight || el.height || 20) / 100) * width;

      ctx.save();
      ctx.translate(elX, elY);
      if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
      if (el.opacity !== undefined) ctx.globalAlpha = el.opacity;

      if (el.type === 'custom-photo' && (el.imageUrl || el.photoUrl)) {
        const photoUrl = el.imageUrl || el.photoUrl;
        let photoImg = getCachedImage(photoUrl);
        if (!photoImg && photoUrl) {
          try {
            photoImg = await preloadImage(photoUrl);
          } catch {}
        }
        if (photoImg && photoImg.complete && photoImg.naturalWidth > 0) {
          drawContainImage(ctx, photoImg, -elW / 2, -elH / 2, elW, elH);
        }
      } else if (el.type === 'shape') {
        ctx.fillStyle = el.fillColor || '#6366f1';
        roundRect(ctx, -elW / 2, -elH / 2, elW, elH, el.cornerRadius || 12);
        ctx.fill();
      } else if (el.type === 'badge' || el.type === 'ribbon') {
        ctx.fillStyle = el.fillColor || '#b91c1c';
        roundRect(ctx, -elW / 2, -elH / 2, elW, elH, 10);
        ctx.fill();
        ctx.fillStyle = el.color || '#ffffff';
        ctx.font = `bold ${(el.fontSize || 18) * 1.8}px "Noto Sans Devanagari", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.content || '', 0, 0);
      } else if (el.type === 'text') {
        const elFontSize = (el.fontSize || 18) * 1.8;
        const elFontFamily = el.fontFamily || "'Baloo 2', 'Noto Sans Devanagari', sans-serif";
        renderFormattedTextBlock(
          ctx,
          el.content || '',
          0,
          0,
          elW,
          {
            fontSize: elFontSize,
            fontFamily: elFontFamily,
            isBold: el.isBold ?? true,
            isItalic: el.isItalic,
            isUnderline: el.isUnderline,
            color: el.color || '#ffffff',
            align: el.align || 'center',
            lineHeightMultiplier: el.lineHeight || 1.3,
            letterSpacing: el.letterSpacing,
            shadow: el.shadow !== false,
            shadowColor: el.shadowColor,
            shadowBlur: el.shadowBlur,
          }
        );
      } else {
        ctx.font = `bold ${(el.fontSize || 22) * 1.8}px "Noto Sans Devanagari", sans-serif`;
        ctx.fillStyle = el.color || '#fde047';
        ctx.textAlign = (el.align as CanvasTextAlign) || 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.content || '', 0, 0);
      }
      ctx.restore();
    }
  }

  // 13. Canonical Business Frame (Strictly at bottom 20% safe zone)
  if (showFooter) {
    await drawCanonicalFooterOnCanvas(
      ctx,
      doc.frameId,
      doc.profile,
      doc.footerConfig || {},
      width,
      height,
      footerHeight,
      doc.template.theme?.accentColor || '#f59e0b'
    );
  }

  // 14. Server-enforced Tamper-resistant Watermark for Free tier (after monthly quota)
  if (doc.watermark?.enabled) {
    drawTamperResistantWatermark(ctx, width, height, doc.watermark);
  }

  return canvas;
}

/**
 * Renders an un-tamperable watermark directly into the canvas bitmap pixels.
 * Cannot be removed via DOM, CSS, or devtools because it is baked into exported images.
 */
function drawTamperResistantWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config?: PosterWatermarkConfig
) {
  ctx.save();

  const brandText = (config?.text || 'GROW VIEW').toUpperCase();

  // 1. Subtle diagonal repeating pattern across the canvas
  ctx.save();
  ctx.rotate((-25 * Math.PI) / 180);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  const stepX = Math.max(300, width * 0.36);
  const stepY = Math.max(160, height * 0.2);
  const startX = -width * 1.5;
  const endX = width * 2;
  const startY = -height * 1.5;
  const endY = height * 2;

  const patternFontSize = Math.max(22, Math.round(width * 0.028));
  ctx.font = `900 ${patternFontSize}px "Baloo 2", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let py = startY; py < endY; py += stepY) {
    for (let px = startX; px < endX; px += stepX) {
      ctx.strokeText(brandText, px, py);
      ctx.fillText(brandText, px, py);
    }
  }
  ctx.restore();

  // 2. High-visibility tamper-resistant Badge at Center/Bottom Center
  const badgeWidth = Math.min(width * 0.74, 580);
  const badgeHeight = Math.max(68, Math.round(height * 0.07));
  const badgeX = (width - badgeWidth) / 2;
  const badgeY = height * 0.48; // Centered overlay

  // Dark frosted backdrop
  ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
  roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 16);
  ctx.fill();

  // Outer border with accent
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.9)';
  ctx.lineWidth = 2.5;
  roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 16);
  ctx.stroke();

  // Header
  const textX = width / 2;
  ctx.fillStyle = '#f59e0b';
  const headerFontSize = Math.max(18, Math.round(badgeHeight * 0.36));
  ctx.font = `900 ${headerFontSize}px "Baloo 2", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`★ ${brandText} • FREE PLAN WATERMARK ★`, textX, badgeY + badgeHeight * 0.33);

  // Subtext
  ctx.fillStyle = '#f8fafc';
  const subFontSize = Math.max(12, Math.round(badgeHeight * 0.24));
  ctx.font = `600 ${subFontSize}px "Noto Sans Devanagari", sans-serif`;
  ctx.fillText(`अमर्यादित वॉटरमार्क-फ्री साठी अपग्रेड करा • Upgrade to Remove Watermark`, textX, badgeY + badgeHeight * 0.72);

  // 3. Bottom-Right Official Corner Badge (above footer)
  const cornerW = Math.min(230, width * 0.28);
  const cornerH = 36;
  const cornerX = width - cornerW - 20;
  const cornerY = height * 0.75;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  roundRect(ctx, cornerX, cornerY, cornerW, cornerH, 8);
  ctx.fill();

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, cornerX, cornerY, cornerW, cornerH, 8);
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px "Baloo 2", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Created on ${brandText}`, cornerX + cornerW / 2, cornerY + cornerH / 2);

  ctx.restore();
}

/**
 * HIGH PERFORMANCE EXPORT UTILITY (<50ms)
 * Directly renders the poster document or reuses the existing canvas to export PNG/JPG.
 */
export async function exportPosterImage(
  doc: PosterRenderDocument,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.95
): Promise<ExportResult> {
  const canvas = await renderPosterDocumentToCanvas(doc);
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const dataUrl = canvas.toDataURL(mimeType, quality);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas blob export failed'));
      },
      mimeType,
      quality
    );
  });

  const safeTitle = (doc.template.titleNative || doc.template.title || 'poster')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-');
  const safeBrand = (doc.profile.name || 'brand')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '-');
  const filename = `${safeTitle}-${safeBrand}.${format}`;

  return { dataUrl, blob, filename };
}
