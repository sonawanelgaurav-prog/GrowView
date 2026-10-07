import React from 'react';
import { LogoShape } from '../../types';

interface TopRightLogoRendererProps {
  logoUrl?: string | null;
  shape?: LogoShape;
  size?: number; // size in percentage or relative units
  position?: { x: number; y: number }; // percentage 0-100
  accentColor?: string;
  onClick?: (e: React.MouseEvent) => void;
  isSelected?: boolean;
  className?: string;
}

export const TopRightLogoRenderer: React.FC<TopRightLogoRendererProps> = ({
  logoUrl,
  shape = 'circle',
  size = 14,
  position = { x: 88, y: 8 },
  accentColor = '#f59e0b',
  onClick,
  isSelected = false,
  className = '',
}) => {
  // CRITICAL REQUIREMENT: If no logo is uploaded or string is empty, DO NOT render placeholder or container!
  if (!logoUrl || logoUrl.trim() === '') {
    return null;
  }

  // Clip-path / Shape styling
  const getShapeClasses = (s: LogoShape) => {
    switch (s) {
      case 'circle':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-2xl';
      case 'square':
        return 'rounded-none';
      case 'hexagon':
        return 'rounded-xl';
      case 'badge':
        return 'rounded-b-3xl rounded-t-xl';
      case 'cut-corner':
        return 'rounded-tr-none rounded-bl-none rounded-tl-2xl rounded-br-2xl';
      case 'freeform':
        return 'rounded-[40%_60%_70%_30%/40%_50%_60%_50%]';
      default:
        return 'rounded-2xl';
    }
  };

  const getCustomClipPath = (s: LogoShape) => {
    if (s === 'hexagon') {
      return 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)';
    }
    if (s === 'cut-corner') {
      return 'polygon(15% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%, 0% 15%)';
    }
    return undefined;
  };

  const effectiveShape: LogoShape = (shape as LogoShape) || 'circle';
  const clipPath = getCustomClipPath(effectiveShape);

  // Ensure safe margin from top edge (थोडी वरती जागा मोकळी पाहीजे)
  const safeTopY = Math.max(position.y || 8.5, 7);

  return (
    <div
      onClick={onClick}
      className={`absolute z-30 transition-all select-none cursor-pointer group ${className} ${
        isSelected
          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 shadow-2xl scale-105 rounded-xl'
          : 'hover:ring-1 hover:ring-dashed hover:ring-amber-300'
      }`}
      style={{
        left: `${position.x}%`,
        top: `${safeTopY}%`,
        transform: 'translate(-50%, -50%)',
        width: `${size}%`,
        maxWidth: '130px',
        maxHeight: '130px',
        aspectRatio: '1/1',
      }}
      title="ब्रँड लोगो (Top-Right Transparent Floating Brand Logo)"
    >
      {/* Transparent container without dark/white background box (बॅग्राउंड ला काही नको) */}
      <div className="w-full h-full p-1 flex items-center justify-center bg-transparent transition-transform">
        <img
          src={logoUrl}
          alt="Brand Logo"
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
          onError={(e) => {
            // Hide image if broken
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {isSelected && (
        <>
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white" />
        </>
      )}
    </div>
  );
};
