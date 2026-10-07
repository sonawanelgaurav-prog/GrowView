import React from 'react';
import { 
  Edit3, 
  Copy, 
  Trash2, 
  Plus, 
  Minus, 
  RotateCw, 
  Move, 
  Sliders, 
  Maximize2 
} from 'lucide-react';
import { CanvasSelectedTarget } from './CanvasFloatingToolbar';

export interface ElementCoordinates {
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  width?: number; // percentage
  height?: number; // percentage
  rotation?: number; // degrees
  fontSize?: number;
  scale?: number;
  size?: number;
  boxWidth?: number;
}

export interface CanvasBoundingBoxProps {
  target: CanvasSelectedTarget;
  coordinates: ElementCoordinates;
  isText?: boolean;
  isImage?: boolean;
  canEditInline?: boolean;
  onStartInlineEdit?: () => void;
  onStartResize: (
    e: React.MouseEvent | React.TouchEvent,
    target: CanvasSelectedTarget,
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'e' | 'w' | 'n' | 's',
    currentProps: {
      width?: number;
      height?: number;
      fontSize?: number;
      scale?: number;
      size?: number;
      boxWidth?: number;
    }
  ) => void;
  onStartRotate?: (e: React.MouseEvent | React.TouchEvent) => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onNudgeSize?: (increment: boolean) => void;
  onOpenProperties?: () => void;
}

export const CanvasBoundingBox: React.FC<CanvasBoundingBoxProps> = ({
  target,
  coordinates,
  isText = false,
  isImage = false,
  canEditInline = false,
  onStartInlineEdit,
  onStartResize,
  onStartRotate,
  onDelete,
  onCopy,
  onNudgeSize,
  onOpenProperties,
}) => {
  const {
    x = 50,
    y = 50,
    width = coordinates.boxWidth || coordinates.size || 25,
    height = coordinates.size || 25,
    rotation = 0,
    fontSize,
    scale,
  } = coordinates;

  // Format coordinates cleanly for the live HUD badge
  const displayX = Math.round(x);
  const displayY = Math.round(y);
  const displayW = Math.round(coordinates.boxWidth || width || (scale ? scale * 25 : 25));
  const displayH = Math.round(height || (fontSize ? fontSize * 1.5 : (scale ? scale * 25 : 25)));
  const displayRot = Math.round(rotation);

  const resizeProps = {
    width: coordinates.width,
    height: coordinates.height,
    fontSize: coordinates.fontSize,
    scale: coordinates.scale,
    size: coordinates.size,
    boxWidth: coordinates.boxWidth,
  };

  return (
    <>
      {/* 1. SELECTION BOUNDING BOX FRAME WITH SUBTLE GLOW */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-sm border-2 border-[#635BFF] shadow-[0_0_0_1px_rgba(255,255,255,0.7),0_0_12px_rgba(99,91,255,0.35)] z-30" 
      />

      {/* 2. FLOATING REAL-TIME COORDINATES & DIMENSIONS HUD BADGE */}
      <div
        className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 bg-[#18181B]/95 text-white px-2 py-0.5 rounded-md border border-[#635BFF]/60 shadow-xl flex items-center gap-1.5 text-[10px] font-mono tracking-tight pointer-events-none select-none whitespace-nowrap backdrop-blur-md"
      >
        <span className="text-[#635BFF] font-bold">X:</span>
        <span className="text-white font-semibold">{displayX}%</span>
        <span className="text-slate-500">•</span>
        <span className="text-[#635BFF] font-bold">Y:</span>
        <span className="text-white font-semibold">{displayY}%</span>
        <span className="text-slate-500">•</span>
        <span className="text-emerald-400 font-bold">W:</span>
        <span className="text-white font-semibold">{displayW}%</span>
        {displayRot !== 0 && (
          <>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-bold">∠</span>
            <span className="text-white font-semibold">{displayRot}°</span>
          </>
        )}
      </div>

      {/* 3. QUICK FLOATING ACTION PILL ON TOP OF BOUNDING BOX */}
      <div
        className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 bg-white/95 text-[#18181B] border border-[#E7E7EE] rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg backdrop-blur-md pointer-events-auto whitespace-nowrap animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {canEditInline && onStartInlineEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onStartInlineEdit();
            }}
            className="px-2 py-0.5 rounded-full bg-[#635BFF] hover:bg-[#5148E5] text-white text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer"
            title="मजकूर संपादित करा (Edit text)"
          >
            <Edit3 className="w-3 h-3" />
            <span>टाईप करा</span>
          </button>
        )}

        {onNudgeSize && (
          <div className="flex items-center bg-slate-100 rounded-full px-1 py-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNudgeSize(false);
              }}
              className="p-0.5 rounded-full hover:bg-slate-200 text-slate-700"
              title="छोटा करा (Scale down)"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            <span className="text-[9px] font-bold text-slate-600 px-1">आकार</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNudgeSize(true);
              }}
              className="p-0.5 rounded-full hover:bg-slate-200 text-slate-700"
              title="मोठा करा (Scale up)"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>
        )}

        {onCopy && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#635BFF] transition-colors"
            title="कॉपी करा (Copy - Ctrl+C)"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}

        {onOpenProperties && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenProperties();
            }}
            className="p-1 rounded-full hover:bg-indigo-50 text-[#635BFF] transition-colors"
            title="प्रॉपर्टीज पॅनेल उघडा (Inspect properties)"
          >
            <Sliders className="w-3 h-3" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded-full hover:bg-rose-50 text-rose-500 hover:text-rose-600 transition-colors"
            title="हटवा / डिलीट करा (Delete - Backspace)"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 4. ROTATION HANDLE (Top center stalk with circular grip) */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
        <div className="w-[1.5px] h-3 bg-[#635BFF]" />
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            if (onStartRotate) onStartRotate(e);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            if (onStartRotate) onStartRotate(e);
          }}
          className="w-3.5 h-3.5 bg-white border-2 border-[#635BFF] rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-125 transition-transform flex items-center justify-center"
          title="फिरवा (Drag to rotate)"
        >
          <div className="w-1 h-1 bg-[#635BFF] rounded-full" />
        </div>
      </div>

      {/* 5. FOUR CORNER RESIZE HANDLES (Solid white circles with primary border) */}
      {/* Top-Left (NW) */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'nw', resizeProps)}
        onTouchStart={(e) => onStartResize(e, target, 'nw', resizeProps)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#635BFF] rounded-full cursor-nwse-resize shadow-md hover:scale-125 hover:bg-indigo-50 transition-transform z-35 pointer-events-auto touch-none"
        title="आकार बदला (Resize)"
      />

      {/* Top-Right (NE) */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'ne', resizeProps)}
        onTouchStart={(e) => onStartResize(e, target, 'ne', resizeProps)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#635BFF] rounded-full cursor-nesw-resize shadow-md hover:scale-125 hover:bg-indigo-50 transition-transform z-35 pointer-events-auto touch-none"
        title="आकार बदला (Resize)"
      />

      {/* Bottom-Left (SW) */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'sw', resizeProps)}
        onTouchStart={(e) => onStartResize(e, target, 'sw', resizeProps)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#635BFF] rounded-full cursor-nesw-resize shadow-md hover:scale-125 hover:bg-indigo-50 transition-transform z-35 pointer-events-auto touch-none"
        title="आकार बदला (Resize)"
      />

      {/* Bottom-Right (SE) */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'se', resizeProps)}
        onTouchStart={(e) => onStartResize(e, target, 'se', resizeProps)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#635BFF] rounded-full cursor-nwse-resize shadow-md hover:scale-125 hover:bg-indigo-50 transition-transform z-35 pointer-events-auto touch-none"
        title="आकार बदला (Resize)"
      />

      {/* 6. EDGE MIDPOINT HANDLES (E / W for text box width, N / S for height) */}
      {/* West handle (Width) */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'w', resizeProps)}
        onTouchStart={(e) => onStartResize(e, target, 'w', resizeProps)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4.5 bg-white border-2 border-[#635BFF] rounded-full cursor-ew-resize shadow-sm hover:scale-125 transition-transform z-35 pointer-events-auto touch-none"
        title="रुंदी बदला (Adjust width)"
      />

      {/* East handle (Width) */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'e', resizeProps)}
        onTouchStart={(e) => onStartResize(e, target, 'e', resizeProps)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4.5 bg-white border-2 border-[#635BFF] rounded-full cursor-ew-resize shadow-sm hover:scale-125 transition-transform z-35 pointer-events-auto touch-none"
        title="रुंदी बदला (Adjust width)"
      />
    </>
  );
};
