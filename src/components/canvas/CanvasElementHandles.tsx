import React from 'react';
import { Edit3, Copy, Trash2, Plus, Minus } from 'lucide-react';
import { CanvasSelectedTarget } from './CanvasFloatingToolbar';

export interface CanvasElementHandlesProps {
  target: CanvasSelectedTarget;
  isText?: boolean;
  canEditInline?: boolean;
  onStartInlineEdit?: () => void;
  onStartResize: (
    e: React.MouseEvent | React.TouchEvent,
    target: CanvasSelectedTarget,
    handle: 'nw' | 'ne' | 'se' | 'sw' | 'e' | 'w',
    currentProps: {
      width?: number;
      height?: number;
      fontSize?: number;
      scale?: number;
      size?: number;
      boxWidth?: number;
    }
  ) => void;
  currentDimensions: {
    width?: number;
    height?: number;
    fontSize?: number;
    scale?: number;
    size?: number;
    boxWidth?: number;
  };
  onDelete?: () => void;
  onCopy?: () => void;
  onNudgeSize?: (increment: boolean) => void;
}

export const CanvasElementHandles: React.FC<CanvasElementHandlesProps> = ({
  target,
  isText = false,
  canEditInline = false,
  onStartInlineEdit,
  onStartResize,
  currentDimensions,
  onDelete,
  onCopy,
  onNudgeSize,
}) => {
  return (
    <>
      {/* 1. Quick Floating Action Mini-Bar on Top of Element */}
      <div
        className="absolute -top-9 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-cyan-400 text-white rounded-full px-2 py-0.5 flex items-center gap-1 shadow-2xl backdrop-blur-md pointer-events-auto whitespace-nowrap animate-in fade-in zoom-in-95"
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
            className="px-2 py-0.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black flex items-center gap-1 transition-all active:scale-95 shadow-sm"
            title="मजकूर टाईप करा / बदला"
          >
            <Edit3 className="w-3 h-3" />
            <span>टाईप करा</span>
          </button>
        )}

        {onNudgeSize && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNudgeSize(false);
              }}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
              title="छोटा करा (Resize smaller)"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNudgeSize(true);
              }}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white"
              title="मोठा करा (Resize larger)"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </>
        )}

        {onCopy && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            className="p-1 rounded-full hover:bg-slate-800 text-cyan-300 hover:text-cyan-200"
            title="कॉपी करा (Copy - Ctrl+C)"
          >
            <Copy className="w-2.5 h-2.5" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded-full hover:bg-rose-950/80 text-rose-400 hover:text-rose-300"
            title="हटवा / डिलीट करा"
          >
            <Trash2 className="w-2.5 h-2.5" />
          </button>
        )}
      </div>

      {/* 2. Four Interactive Corner Handles (Drag to Resize) */}
      {/* Top-Left */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'nw', currentDimensions)}
        onTouchStart={(e) => onStartResize(e, target, 'nw', currentDimensions)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform z-30 pointer-events-auto touch-none"
        title="ड्रॅग करून छोटा-मोठा करा (Drag to resize)"
      />

      {/* Top-Right */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'ne', currentDimensions)}
        onTouchStart={(e) => onStartResize(e, target, 'ne', currentDimensions)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform z-30 pointer-events-auto touch-none"
        title="ड्रॅग करून छोटा-मोठा करा (Drag to resize)"
      />

      {/* Bottom-Left */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'sw', currentDimensions)}
        onTouchStart={(e) => onStartResize(e, target, 'sw', currentDimensions)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform z-30 pointer-events-auto touch-none"
        title="ड्रॅग करून छोटा-मोठा करा (Drag to resize)"
      />

      {/* Bottom-Right */}
      <div
        onMouseDown={(e) => onStartResize(e, target, 'se', currentDimensions)}
        onTouchStart={(e) => onStartResize(e, target, 'se', currentDimensions)}
        onClick={(e) => e.stopPropagation()}
        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-cyan-500 rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform z-30 pointer-events-auto touch-none"
        title="ड्रॅग करून छोटा-मोठा करा (Drag to resize)"
      />

      {/* 3. Middle Edge Handles (For Text Box Width) */}
      {isText && (
        <>
          <div
            onMouseDown={(e) => onStartResize(e, target, 'w', currentDimensions)}
            onTouchStart={(e) => onStartResize(e, target, 'w', currentDimensions)}
            onClick={(e) => e.stopPropagation()}
            className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4.5 bg-cyan-400 border border-white rounded-full cursor-ew-resize shadow hover:scale-125 transition-transform z-30 pointer-events-auto touch-none"
            title="रुंदी बदला (Adjust width)"
          />
          <div
            onMouseDown={(e) => onStartResize(e, target, 'e', currentDimensions)}
            onTouchStart={(e) => onStartResize(e, target, 'e', currentDimensions)}
            onClick={(e) => e.stopPropagation()}
            className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-4.5 bg-cyan-400 border border-white rounded-full cursor-ew-resize shadow hover:scale-125 transition-transform z-30 pointer-events-auto touch-none"
            title="रुंदी बदला (Adjust width)"
          />
        </>
      )}
    </>
  );
};
