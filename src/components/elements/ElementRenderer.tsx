import React from 'react';
import { CanvasCustomElement } from '../../types';
import {
  Briefcase,
  Store,
  TrendingUp,
  ShoppingCart,
  Target,
  Award,
  MessageSquare,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  PhoneCall,
  Mail,
  Globe,
  MapPin,
  Clock,
  Flame,
  Sun,
  Home,
  Utensils,
  Coffee,
  Pizza,
  Cake,
  GraduationCap,
  BookOpen,
  HeartPulse,
  Pill,
  Key,
  Laptop,
  Sparkles,
  Cloud,
  Plus,
  Minus,
  Check,
  Star,
  Heart,
  Shield,
  Zap,
  Tag,
  DollarSign,
  Percent,
  Smile,
  Truck,
  Building,
} from 'lucide-react';

interface ElementRendererProps {
  element: CanvasCustomElement;
  isSelected?: boolean;
  onSelect?: () => void;
  scale?: number;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  scale = 1,
}) => {
  const {
    id,
    type,
    subType,
    content,
    width = 20,
    height = 20,
    color = '#fde047',
    fillColor = '#6366f1',
    strokeColor = '#4338ca',
    strokeWidth = 2,
    strokeStyle = 'solid',
    cornerRadius = 8,
    opacity = 1,
    shadow = false,
    shadowBlur = 8,
    shadowColor = 'rgba(0,0,0,0.5)',
    iconName,
    iconBgColor,
    iconBorderColor,
    iconShape = 'none',
    frameShape = 'square',
    photoUrl,
    photoZoom = 1,
    photoOffsetX = 0,
    photoOffsetY = 0,
    photoRotation = 0,
    photoFilter = 'none',
    polaroidLabel,
    isCurved,
    arrowStartStyle,
    arrowEndStyle,
    fontSize = 16,
    isBold = true,
  } = element;

  const shadowStyle = shadow
    ? { filter: `drop-shadow(0px 4px ${shadowBlur}px ${shadowColor})` }
    : {};

  const getFilterCSS = (f?: string) => {
    switch (f) {
      case 'warm':
        return 'sepia(30%) saturate(140%) brightness(105%)';
      case 'cool':
        return 'hue-rotate(180deg) saturate(110%)';
      case 'vintage':
        return 'sepia(60%) contrast(110%) brightness(90%)';
      case 'bw':
        return 'grayscale(100%) contrast(120%)';
      case 'festive':
        return 'saturate(160%) contrast(110%) brightness(105%)';
      default:
        return 'none';
    }
  };

  // Helper for Lucide icon mapping
  const renderLucideIcon = (name?: string, c?: string, sw: number = 2) => {
    const iconProps = {
      className: 'w-full h-full object-contain',
      style: { color: c || color },
      strokeWidth: sw,
    };

    switch (name?.toLowerCase()) {
      case 'briefcase':
        return <Briefcase {...iconProps} />;
      case 'store':
        return <Store {...iconProps} />;
      case 'trendingup':
      case 'trending-up':
        return <TrendingUp {...iconProps} />;
      case 'shoppingcart':
      case 'shopping-cart':
        return <ShoppingCart {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      case 'award':
        return <Award {...iconProps} />;
      case 'messagesquare':
      case 'whatsapp':
        return <MessageSquare {...iconProps} />;
      case 'instagram':
        return <Instagram {...iconProps} />;
      case 'facebook':
        return <Facebook {...iconProps} />;
      case 'youtube':
        return <Youtube {...iconProps} />;
      case 'linkedin':
        return <Linkedin {...iconProps} />;
      case 'twitter':
      case 'x':
        return <Twitter {...iconProps} />;
      case 'phonecall':
      case 'phone':
        return <PhoneCall {...iconProps} />;
      case 'mail':
        return <Mail {...iconProps} />;
      case 'globe':
        return <Globe {...iconProps} />;
      case 'mappin':
      case 'map-pin':
        return <MapPin {...iconProps} />;
      case 'clock':
        return <Clock {...iconProps} />;
      case 'flame':
        return <Flame {...iconProps} />;
      case 'sun':
        return <Sun {...iconProps} />;
      case 'home':
        return <Home {...iconProps} />;
      case 'utensils':
        return <Utensils {...iconProps} />;
      case 'coffee':
        return <Coffee {...iconProps} />;
      case 'pizza':
        return <Pizza {...iconProps} />;
      case 'cake':
        return <Cake {...iconProps} />;
      case 'graduationcap':
      case 'graduation-cap':
        return <GraduationCap {...iconProps} />;
      case 'bookopen':
      case 'book-open':
        return <BookOpen {...iconProps} />;
      case 'heartpulse':
      case 'heart-pulse':
        return <HeartPulse {...iconProps} />;
      case 'pill':
        return <Pill {...iconProps} />;
      case 'key':
        return <Key {...iconProps} />;
      case 'laptop':
        return <Laptop {...iconProps} />;
      case 'sparkles':
        return <Sparkles {...iconProps} />;
      case 'cloud':
        return <Cloud {...iconProps} />;
      case 'tag':
        return <Tag {...iconProps} />;
      case 'dollarsign':
        return <DollarSign {...iconProps} />;
      case 'percent':
        return <Percent {...iconProps} />;
      case 'truck':
        return <Truck {...iconProps} />;
      case 'building':
        return <Building {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  // 0. TEXT BOX ELEMENT
  if (type === 'text') {
    return (
      <div
        className="w-full h-full flex items-center break-words px-1.5 select-none"
        style={{
          color: color || '#ffffff',
          fontFamily: element.fontFamily || "'Baloo 2', sans-serif",
          fontSize: fontSize ? `${fontSize}px` : '16px',
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: element.isItalic ? 'italic' : 'normal',
          textDecoration: element.isUnderline ? 'underline' : 'none',
          textAlign: element.align || 'center',
          justifyContent: element.align === 'left' ? 'flex-start' : element.align === 'right' ? 'flex-end' : 'center',
          whiteSpace: 'pre-line',
          lineHeight: element.lineHeight || 1.35,
          opacity,
          ...shadowStyle,
        }}
      >
        <span className="leading-snug select-none w-full">{content || 'मजकूर'}</span>
      </div>
    );
  }

  // 0.1 CUSTOM PHOTO / PNG / JPEG / STICKER ELEMENT
  if (type === 'custom-photo' || type === 'sticker' || (element.imageUrl && type !== 'photo-frame') || (element.photoUrl && type !== 'photo-frame')) {
    const imgSrc = element.imageUrl || element.photoUrl || content;
    const transformStyles = [
      element.isFlippedX ? 'scaleX(-1)' : '',
      element.isFlippedY ? 'scaleY(-1)' : '',
      photoZoom && photoZoom !== 1 ? `scale(${photoZoom})` : '',
    ].filter(Boolean).join(' ');

    return (
      <div
        className="w-full h-full flex items-center justify-center relative select-none"
        style={{
          opacity,
          ...shadowStyle,
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={element.name || 'Custom Element'}
            className="w-full h-full object-contain pointer-events-none select-none"
            style={{
              transform: transformStyles || undefined,
              filter: getFilterCSS(photoFilter),
            }}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full border border-dashed border-cyan-400/60 rounded-xl flex items-center justify-center bg-slate-900/60 text-cyan-300 text-xs font-bold p-2 text-center">
            + फोटो निवडा
          </div>
        )}
      </div>
    );
  }

  // 1. ICONS (including custom Indian / Festival SVGs)
  if (type === 'icon') {
    // Custom Indian SVGs
    if (subType === 'om') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={shadowStyle}>
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke={color} strokeWidth={strokeWidth}>
            <path
              d="M 30,35 C 20,25 20,10 35,10 C 50,10 55,25 50,38 C 45,50 30,55 25,65 C 20,75 30,90 50,90 C 65,90 75,78 75,65 C 75,50 60,45 50,45 M 50,45 C 65,45 80,55 85,75 M 55,20 C 65,15 80,20 85,32 M 85,12 A 3,3 0 1 1 85,18 A 3,3 0 1 1 85,12 M 72,22 C 78,28 88,28 94,22"
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth + 2}
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    if (subType === 'swastik') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={shadowStyle}>
          <svg viewBox="0 0 100 100" className="w-full h-full" stroke={color} strokeWidth={strokeWidth + 3} strokeLinecap="round">
            <line x1="50" y1="10" x2="50" y2="90" />
            <line x1="10" y1="50" x2="90" y2="50" />
            <line x1="50" y1="10" x2="85" y2="10" />
            <line x1="90" y1="50" x2="90" y2="85" />
            <line x1="50" y1="90" x2="15" y2="90" />
            <line x1="10" y1="50" x2="10" y2="15" />
            {/* 4 Auspicious dots */}
            <circle cx="30" cy="30" r="4" fill={color} stroke="none" />
            <circle cx="70" cy="30" r="4" fill={color} stroke="none" />
            <circle cx="30" cy="70" r="4" fill={color} stroke="none" />
            <circle cx="70" cy="70" r="4" fill={color} stroke="none" />
          </svg>
        </div>
      );
    }

    if (subType === 'diya') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={shadowStyle}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Flame */}
            <path
              d="M 50,8 C 45,22 36,32 36,44 C 36,54 42,62 50,62 C 58,62 64,54 64,44 C 64,32 55,22 50,8 Z"
              fill="#fbbf24"
            />
            <path
              d="M 50,20 C 47,30 42,36 42,44 C 42,50 46,55 50,55 C 54,55 58,50 58,44 C 58,36 53,30 50,20 Z"
              fill="#ef4444"
            />
            {/* Clay Diya Pot */}
            <path
              d="M 15,55 C 20,82 80,82 85,55 C 80,62 68,66 50,66 C 32,66 20,62 15,55 Z"
              fill={color}
              stroke={strokeColor || '#b45309'}
              strokeWidth={strokeWidth}
            />
            <ellipse cx="50" cy="55" rx="35" ry="8" fill="#d97706" />
            <path
              d="M 22,82 L 78,82 L 72,92 L 28,92 Z"
              fill={color}
              opacity="0.9"
            />
          </svg>
        </div>
      );
    }

    if (subType === 'kalash') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={shadowStyle}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Coconut */}
            <circle cx="50" cy="30" r="16" fill="#78350f" />
            {/* Mango Leaves */}
            <path d="M 50,30 C 35,15 20,25 20,38 C 35,35 45,35 50,30 Z" fill="#16a34a" />
            <path d="M 50,30 C 65,15 80,25 80,38 C 65,35 55,35 50,30 Z" fill="#16a34a" />
            <path d="M 50,30 C 50,10 50,8 50,4 C 50,8 50,10 50,30 Z" stroke="#16a34a" strokeWidth="4" />
            {/* Pot Neck & Body */}
            <ellipse cx="50" cy="42" rx="20" ry="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <path
              d="M 32,42 C 20,55 20,85 50,88 C 80,85 80,55 68,42 Z"
              fill={color}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Sacred thread / Swastik on pot */}
            <path d="M 38,62 L 62,62 M 50,52 L 50,72" stroke="#dc2626" strokeWidth="3" />
            {/* Base */}
            <ellipse cx="50" cy="88" rx="16" ry="4" fill="#b45309" />
          </svg>
        </div>
      );
    }

    if (subType === 'temple') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={shadowStyle}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Flag / Dhwaja */}
            <path d="M 50,5 L 50,22 M 50,6 L 68,14 L 50,22 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
            {/* Shikhar / Dome */}
            <path d="M 50,20 C 35,38 32,50 30,55 L 70,55 C 68,50 65,38 50,20 Z" fill={color} stroke={strokeColor} strokeWidth={strokeWidth} />
            {/* Temple Pillars */}
            <rect x="25" y="55" width="50" height="8" fill="#f59e0b" rx="2" />
            <rect x="28" y="63" width="8" height="24" fill={color} />
            <rect x="64" y="63" width="8" height="24" fill={color} />
            <path d="M 44,70 C 44,64 56,64 56,70 L 56,87 L 44,87 Z" fill="#78350f" />
            <rect x="20" y="87" width="60" height="8" fill="#f59e0b" rx="2" />
          </svg>
        </div>
      );
    }

    // Standard Lucide Icon with customizable shape background
    let shapeWrapperClass = 'w-full h-full flex items-center justify-center p-2';
    let wrapperStyle: React.CSSProperties = { ...shadowStyle, opacity };
    if (iconShape === 'circle') {
      shapeWrapperClass += ' rounded-full';
      wrapperStyle.backgroundColor = iconBgColor || 'transparent';
      if (iconBorderColor) {
        wrapperStyle.border = `${element.iconBorderSize || 2}px solid ${iconBorderColor}`;
      }
    } else if (iconShape === 'square') {
      wrapperStyle.backgroundColor = iconBgColor || 'transparent';
      if (iconBorderColor) {
        wrapperStyle.border = `${element.iconBorderSize || 2}px solid ${iconBorderColor}`;
      }
    } else if (iconShape === 'rounded') {
      shapeWrapperClass += ' rounded-xl';
      wrapperStyle.backgroundColor = iconBgColor || 'transparent';
      if (iconBorderColor) {
        wrapperStyle.border = `${element.iconBorderSize || 2}px solid ${iconBorderColor}`;
      }
    }

    return (
      <div className={shapeWrapperClass} style={wrapperStyle}>
        {renderLucideIcon(iconName, color, strokeWidth)}
      </div>
    );
  }

  // 2. SHAPES
  if (type === 'shape') {
    const dashArray = strokeStyle === 'dashed' ? '8 4' : strokeStyle === 'dotted' ? '3 3' : 'none';

    return (
      <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {subType === 'square' && (
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
              rx={cornerRadius}
            />
          )}

          {subType === 'rounded-rect' && (
            <rect
              x="5"
              y="10"
              width="90"
              height="80"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
              rx={cornerRadius || 16}
            />
          )}

          {subType === 'circle' && (
            <circle
              cx="50"
              cy="50"
              r="44"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          )}

          {subType === 'oval' && (
            <ellipse
              cx="50"
              cy="50"
              rx="46"
              ry="30"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          )}

          {subType === 'triangle' && (
            <polygon
              points="50,6 94,92 6,92"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          )}

          {subType === 'diamond' && (
            <polygon
              points="50,5 95,50 50,95 5,50"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          )}

          {subType === 'hexagon' && (
            <polygon
              points="50,5 92,27 92,73 50,95 8,73 8,27"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          )}

          {subType === 'octagon' && (
            <polygon
              points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          )}

          {subType === 'star' && (
            <polygon
              points="50,5 63,35 95,38 71,60 78,92 50,75 22,92 29,60 5,38 37,35"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          )}

          {subType === 'heart' && (
            <path
              d="M 50,25 C 50,10 35,2 22,2 C 9,2 0,14 0,30 C 0,55 50,85 50,96 C 50,85 100,55 100,30 C 100,14 91,2 78,2 C 65,2 50,10 50,25 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          )}

          {subType === 'burst' && (
            <path
              d="M 50,2 L 60,18 L 78,8 L 80,28 L 98,28 L 90,46 L 100,60 L 84,68 L 86,88 L 68,84 L 60,100 L 46,88 L 32,98 L 30,78 L 12,82 L 18,64 L 2,52 L 16,40 L 4,24 L 22,22 L 24,4 L 40,14 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
            />
          )}

          {subType === 'speech-bubble' && (
            <path
              d="M 10,10 L 90,10 C 95,10 98,14 98,20 L 98,70 C 98,76 95,80 90,80 L 40,80 L 20,96 L 25,80 L 10,80 C 5,80 2,76 2,70 L 2,20 C 2,14 5,10 10,10 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
            />
          )}

          {subType === 'shield' && (
            <path
              d="M 10,15 Q 50,5 90,15 L 90,55 C 90,75 50,95 50,95 C 50,95 10,75 10,55 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
            />
          )}

          {subType === 'blob' && (
            <path
              d="M 40,10 C 65,5 92,20 95,45 C 98,70 75,92 50,95 C 25,98 8,82 6,55 C 4,28 15,15 40,10 Z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 2}
            />
          )}
        </svg>
      </div>
    );
  }

  // 3. LINES & DIVIDERS
  if (type === 'line') {
    const dashArray = strokeStyle === 'dashed' ? '8 4' : strokeStyle === 'dotted' ? '3 3' : 'none';

    if (isCurved) {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 30" className="w-full h-full">
            <path
              d="M 5,15 Q 50,-5 95,15"
              fill="none"
              stroke={strokeColor || color}
              strokeWidth={strokeWidth * 2}
              strokeDasharray={dashArray}
            />
          </svg>
        </div>
      );
    }

    if (subType === 'ornate') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 20" className="w-full h-full">
            <line x1="5" y1="10" x2="42" y2="10" stroke={strokeColor || color} strokeWidth={strokeWidth * 2} />
            <polygon points="50,3 57,10 50,17 43,10" fill={strokeColor || color} />
            <circle cx="50" cy="10" r="2" fill="#ffffff" />
            <line x1="58" y1="10" x2="95" y2="10" stroke={strokeColor || color} strokeWidth={strokeWidth * 2} />
          </svg>
        </div>
      );
    }

    if (strokeStyle === 'double') {
      return (
        <div className="w-full h-full flex flex-col justify-center gap-1" style={{ ...shadowStyle, opacity }}>
          <div className="w-full h-[2px]" style={{ backgroundColor: strokeColor || color }} />
          <div className="w-full h-[2px]" style={{ backgroundColor: strokeColor || color }} />
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
        <svg viewBox="0 0 100 10" className="w-full h-full">
          <line
            x1="2"
            y1="5"
            x2="98"
            y2="5"
            stroke={strokeColor || color}
            strokeWidth={strokeWidth * 2}
            strokeDasharray={dashArray}
          />
        </svg>
      </div>
    );
  }

  // 4. ARROWS
  if (type === 'arrow') {
    if (subType === 'circular') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path
              d="M 50,15 A 35,35 0 1 1 20,40"
              fill="none"
              stroke={strokeColor || color}
              strokeWidth={strokeWidth * 2.5}
              strokeLinecap="round"
            />
            <polygon points="12,28 32,38 20,52" fill={strokeColor || color} />
          </svg>
        </div>
      );
    }

    if (isCurved) {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <path
              d="M 8,50 Q 50,5 82,25"
              fill="none"
              stroke={strokeColor || color}
              strokeWidth={strokeWidth * 2.5}
              strokeLinecap="round"
            />
            <polygon points="76,14 96,28 82,42" fill={strokeColor || color} />
          </svg>
        </div>
      );
    }

    if (subType === 'double') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 30" className="w-full h-full">
            <polygon points="16,6 4,15 16,24" fill={strokeColor || color} />
            <line x1="12" y1="15" x2="88" y2="15" stroke={strokeColor || color} strokeWidth={strokeWidth * 2.5} />
            <polygon points="84,6 96,15 84,24" fill={strokeColor || color} />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
        <svg viewBox="0 0 100 30" className="w-full h-full">
          <line x1="5" y1="15" x2="82" y2="15" stroke={strokeColor || color} strokeWidth={strokeWidth * 2.5} strokeLinecap="round" />
          <polygon points="75,5 95,15 75,25" fill={strokeColor || color} />
        </svg>
      </div>
    );
  }

  // 5. PHOTO FRAMES / PHOTO BOXES
  if (type === 'photo-frame') {
    const clipId = `clip-${id}`;

    const renderClipShape = () => {
      switch (frameShape) {
        case 'circle':
          return <circle cx="50" cy="50" r="48" />;
        case 'oval':
          return <ellipse cx="50" cy="50" rx="48" ry="36" />;
        case 'rounded':
          return <rect x="2" y="2" width="96" height="96" rx="16" />;
        case 'polaroid':
          return <rect x="6" y="6" width="88" height="68" rx="4" />;
        case 'arch':
          return <path d="M 4,96 L 4,40 A 46,46 0 0 1 96,40 L 96,96 Z" />;
        case 'hexagon':
          return <polygon points="50,3 95,26 95,74 50,97 5,74 5,26" />;
        case 'diamond':
          return <polygon points="50,3 97,50 50,97 3,50" />;
        case 'heart':
          return (
            <path d="M 50,25 C 50,10 35,2 22,2 C 9,2 0,14 0,30 C 0,55 50,85 50,96 C 50,85 100,55 100,30 C 100,14 91,2 78,2 C 65,2 50,10 50,25 Z" />
          );
        case 'star':
          return <polygon points="50,3 63,33 97,36 72,59 79,93 50,76 21,93 28,59 3,36 37,33" />;
        case 'blob':
          return <path d="M 40,10 C 65,5 92,20 95,45 C 98,70 75,92 50,95 C 25,98 8,82 6,55 C 4,28 15,15 40,10 Z" />;
        case 'decorative':
          return <rect x="10" y="10" width="80" height="80" rx="12" />;
        case 'square':
        default:
          return <rect x="2" y="2" width="96" height="96" />;
      }
    };

    const renderOuterFrameBorder = () => {
      const sw = strokeWidth * 2;
      const sc = strokeColor || '#fbbf24';

      switch (frameShape) {
        case 'circle':
          return <circle cx="50" cy="50" r="48" fill="none" stroke={sc} strokeWidth={sw} />;
        case 'oval':
          return <ellipse cx="50" cy="50" rx="48" ry="36" fill="none" stroke={sc} strokeWidth={sw} />;
        case 'rounded':
          return <rect x="2" y="2" width="96" height="96" rx="16" fill="none" stroke={sc} strokeWidth={sw} />;
        case 'polaroid':
          return (
            <>
              <rect x="2" y="2" width="96" height="96" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <rect x="6" y="6" width="88" height="68" rx="4" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
              {polaroidLabel && (
                <text
                  x="50"
                  y="88"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="'Gotu', 'Playfair Display', serif"
                >
                  {polaroidLabel}
                </text>
              )}
            </>
          );
        case 'arch':
          return <path d="M 4,96 L 4,40 A 46,46 0 0 1 96,40 L 96,96 Z" fill="none" stroke={sc} strokeWidth={sw} />;
        case 'hexagon':
          return <polygon points="50,3 95,26 95,74 50,97 5,74 5,26" fill="none" stroke={sc} strokeWidth={sw} />;
        case 'heart':
          return (
            <path
              d="M 50,25 C 50,10 35,2 22,2 C 9,2 0,14 0,30 C 0,55 50,85 50,96 C 50,85 100,55 100,30 C 100,14 91,2 78,2 C 65,2 50,10 50,25 Z"
              fill="none"
              stroke={sc}
              strokeWidth={sw}
            />
          );
        case 'star':
          return (
            <polygon
              points="50,3 63,33 97,36 72,59 79,93 50,76 21,93 28,59 3,36 37,33"
              fill="none"
              stroke={sc}
              strokeWidth={sw}
            />
          );
        case 'decorative':
          return (
            <>
              <rect x="4" y="4" width="92" height="92" rx="16" fill="none" stroke="#ffd700" strokeWidth="4" />
              <rect x="10" y="10" width="80" height="80" rx="12" fill="none" stroke="#ca8a04" strokeWidth="2" />
              {/* Golden Corner Flourishes */}
              <circle cx="10" cy="10" r="4" fill="#ffd700" />
              <circle cx="90" cy="10" r="4" fill="#ffd700" />
              <circle cx="10" cy="90" r="4" fill="#ffd700" />
              <circle cx="90" cy="90" r="4" fill="#ffd700" />
            </>
          );
        case 'square':
        default:
          return <rect x="2" y="2" width="96" height="96" fill="none" stroke={sc} strokeWidth={sw} />;
      }
    };

    return (
      <div className="w-full h-full relative select-none" style={{ ...shadowStyle, opacity }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <clipPath id={clipId}>{renderClipShape()}</clipPath>
          </defs>

          {/* Underlay for polaroid background */}
          {frameShape === 'polaroid' && (
            <rect x="2" y="2" width="96" height="96" rx="6" fill="#ffffff" />
          )}

          {/* Masked Photo Container */}
          <g clipPath={`url(#${clipId})`}>
            {photoUrl ? (
              <image
                href={photoUrl}
                x={`${photoOffsetX}%`}
                y={`${photoOffsetY}%`}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid slice"
                style={{
                  transformOrigin: '50% 50%',
                  transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`,
                  filter: getFilterCSS(photoFilter),
                }}
              />
            ) : (
              <g>
                <rect x="0" y="0" width="100" height="100" fill="#e2e8f0" />
                <text x="50" y="48" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="bold">
                  + Add Photo
                </text>
                <text x="50" y="58" textAnchor="middle" fill="#94a3b8" fontSize="6">
                  (Click to Insert)
                </text>
              </g>
            )}
          </g>

          {/* Outer Border / Frame */}
          {renderOuterFrameBorder()}
        </svg>
      </div>
    );
  }

  // 6. DECORATIONS & MANDALAS
  if (type === 'decoration') {
    if (subType === 'mandala') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 100" className="w-full h-full" stroke={strokeColor || '#ffd700'} strokeWidth={strokeWidth}>
            <circle cx="50" cy="50" r="46" fill="none" />
            <circle cx="50" cy="50" r="38" fill="none" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="28" fill="none" />
            <circle cx="50" cy="50" r="16" fill="none" />
            <circle cx="50" cy="50" r="6" fill={strokeColor || '#ffd700'} />
            {/* 8-Petal Geometry */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 50 50)`}>
                <path d="M 50,22 C 42,32 50,42 50,42 C 50,42 58,32 50,22 Z" fill="none" />
                <circle cx="50" cy="10" r="2" fill={strokeColor || '#ffd700'} />
              </g>
            ))}
          </svg>
        </div>
      );
    }

    if (subType === 'rangoli') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 100" className="w-full h-full" stroke={strokeColor || '#f59e0b'} strokeWidth={strokeWidth}>
            <circle cx="50" cy="50" r="12" fill={fillColor || '#ef4444'} stroke="none" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 50 50)`}>
                <path d="M 50,15 C 35,28 50,40 50,40 C 50,40 65,28 50,15 Z" fill={fillColor || '#fde047'} opacity="0.85" />
                <circle cx="50" cy="8" r="3" fill="#ea580c" stroke="none" />
              </g>
            ))}
          </svg>
        </div>
      );
    }

    if (subType === 'floral-corner') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 100" className="w-full h-full" stroke={strokeColor || '#fbbf24'} strokeWidth={strokeWidth} fill="none">
            <path d="M 8,8 L 8,60 C 8,40 40,8 60,8 L 8,8 Z" fill={fillColor || 'rgba(251, 191, 36, 0.15)'} />
            <path d="M 8,8 Q 50,12 80,8" />
            <path d="M 8,8 Q 12,50 8,80" />
            <circle cx="24" cy="24" r="8" fill={strokeColor || '#fbbf24'} />
            <circle cx="48" cy="18" r="5" fill={strokeColor || '#fbbf24'} />
            <circle cx="18" cy="48" r="5" fill={strokeColor || '#fbbf24'} />
          </svg>
        </div>
      );
    }

    if (subType === 'toran') {
      return (
        <div className="w-full h-full flex items-center justify-center" style={{ ...shadowStyle, opacity }}>
          <svg viewBox="0 0 100 30" className="w-full h-full">
            {/* Garland String */}
            <line x1="0" y1="4" x2="100" y2="4" stroke="#15803d" strokeWidth="2" />
            {/* Hanging Mango Leaves & Marigolds */}
            {[10, 26, 42, 58, 74, 90].map((x, i) => (
              <g key={i}>
                <path d={`M ${x},4 C ${x - 5},12 ${x},26 ${x},26 C ${x},26 ${x + 5},12 ${x},4 Z`} fill="#16a34a" />
                <circle cx={x} cy="7" r="3" fill="#f59e0b" />
              </g>
            ))}
          </svg>
        </div>
      );
    }
  }

  // 7. BADGES & LABELS
  if (type === 'badge') {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center px-3 py-1 text-center select-none"
        style={{
          backgroundColor: fillColor || '#b91c1c',
          border: `${strokeWidth}px solid ${strokeColor || '#fde047'}`,
          borderRadius: cornerRadius ? `${cornerRadius}px` : '8px',
          color: color || '#ffffff',
          ...shadowStyle,
          opacity,
        }}
      >
        <span
          className={`${isBold ? 'font-extrabold' : 'font-semibold'} leading-tight tracking-wide`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {content}
        </span>
        {element.badgeSubtext && (
          <span className="text-[10px] opacity-90 font-medium tracking-normal mt-0.5">
            {element.badgeSubtext}
          </span>
        )}
      </div>
    );
  }

  // 8. RIBBONS & BANNERS
  if (type === 'ribbon') {
    if (subType === 'rosette') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center relative select-none" style={{ ...shadowStyle, opacity }}>
          {/* Rosette Head */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xs z-10 shadow-md"
            style={{
              backgroundColor: fillColor || '#eab308',
              border: `2px solid ${strokeColor || '#ca8a04'}`,
              color: color || '#ffffff',
            }}
          >
            {content}
          </div>
          {/* Hanging tails */}
          <div className="flex gap-1 -mt-2 z-0">
            <div className="w-3 h-8 bg-amber-600 rotate-12 rounded-b-xs" />
            <div className="w-3 h-8 bg-amber-600 -rotate-12 rounded-b-xs" />
          </div>
        </div>
      );
    }

    return (
      <div
        className="w-full h-full flex items-center justify-center px-3 py-1 font-bold text-center select-none"
        style={{
          backgroundColor: fillColor || '#dc2626',
          border: `${strokeWidth}px solid ${strokeColor || '#991b1b'}`,
          color: color || '#ffffff',
          borderRadius: cornerRadius ? `${cornerRadius}px` : '4px',
          fontSize: `${fontSize}px`,
          ...shadowStyle,
          opacity,
        }}
      >
        {content}
      </div>
    );
  }

  // 9. BORDERS
  if (type === 'border') {
    return (
      <div
        className="w-full h-full pointer-events-none"
        style={{
          border: `${strokeWidth * 2}px solid ${strokeColor || '#ffd700'}`,
          borderRadius: cornerRadius ? `${cornerRadius}px` : '0px',
          backgroundColor: 'transparent',
          ...shadowStyle,
          opacity,
        }}
      />
    );
  }

  // Default Fallback
  return (
    <div
      className="w-full h-full flex items-center justify-center font-bold text-xs p-1"
      style={{ color, opacity, ...shadowStyle }}
    >
      {content}
    </div>
  );
};
