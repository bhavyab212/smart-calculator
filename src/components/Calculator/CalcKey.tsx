import React, { useState, useCallback } from 'react';
import { useCalcStore } from '../../state/useCalcStore';

// ── Single Calculator Key ─────────────────────────────────────────────────────

export interface CalcKeyProps {
  /** Primary label (white) */
  main: string;
  /** SHIFT label (amber, top-left) */
  shift?: string;
  /** ALPHA label (purple, top-right) */
  alpha?: string;
  /** Key type determines background colour */
  type?: 'num' | 'op' | 'fn' | 'shift' | 'alpha' | 'exe' | 'system' | 'del';
  /** Width multiplier (default 1) */
  wide?: boolean;
  /** Height multiplier (default 1) */
  tall?: boolean;
  /** Override the action (defaults to inserting `main`) */
  onPress?: () => void;
  /** Font size override for main label */
  mainSize?: 'xs' | 'sm' | 'base' | 'lg';
  disabled?: boolean;
}

export function CalcKey({
  main, shift, alpha, type = 'num', wide, tall, onPress, mainSize = 'sm', disabled,
}: CalcKeyProps) {
  const [pressed, setPressed] = useState(false);
  const { shiftState, insertAtCursor, setShiftState } = useCalcStore();

  const handlePress = useCallback(() => {
    if (disabled) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 100);

    if (onPress) {
      onPress();
    } else {
      if (shiftState === 'shift' && shift) {
        insertAtCursor(shift);
        setShiftState('none');
      } else if (shiftState === 'alpha' && alpha) {
        insertAtCursor(alpha);
        setShiftState('none');
      } else {
        insertAtCursor(main);
      }
    }
  }, [disabled, onPress, shiftState, shift, alpha, main, insertAtCursor, setShiftState]);

  // Determine styles based on key type
  let bgClass = "bg-[#242b35] hover:bg-[#2d3642] border-[#384352]/50 text-white shadow-md";
  let radiusClass = "rounded-[8px]";
  let extraClasses = "transition-all duration-100";
  
  const isShiftActive = shiftState === 'shift' && !!shift;
  const isAlphaActive = shiftState === 'alpha' && !!alpha;

  if (isShiftActive) {
    bgClass = "bg-[#171c24] border-[#d97706] text-[#d97706]";
    extraClasses = "shadow-[0_0_12px_rgba(217,119,6,0.4)] scale-[1.04] z-10 font-bold";
  } else if (isAlphaActive) {
    bgClass = "bg-[#171c24] border-[#d946ef] text-[#d946ef]";
    extraClasses = "shadow-[0_0_12px_rgba(217,70,239,0.4)] scale-[1.04] z-10 font-bold";
  } else {
    if (type === 'num') {
      bgClass = "bg-[#242b35] hover:bg-[#2d3642] border-[#384352]/50 text-white";
    } else if (type === 'op') {
      bgClass = "bg-[#131d2a] hover:bg-[#1b2737] border-[#253549]/50 text-white";
    } else if (type === 'fn') {
      bgClass = "bg-[#1a202a] hover:bg-[#222a37] border-[#2b3545]/50 text-[#e2e8f0]";
    } else if (type === 'shift') {
      bgClass = "bg-[#0b0f17] hover:bg-[#171c24] border-[#d97706]/70 text-[#d97706]";
      radiusClass = "rounded-full";
      if (shiftState === 'shift') {
        extraClasses = "shadow-[0_0_12px_rgba(217,119,6,0.6)] border-[#d97706] scale-[1.04]";
      }
    } else if (type === 'alpha') {
      bgClass = "bg-[#0b0f17] hover:bg-[#171c24] border-[#d946ef]/70 text-[#d946ef]";
      radiusClass = "rounded-full";
      if (shiftState === 'alpha') {
        extraClasses = "shadow-[0_0_12px_rgba(217,70,239,0.6)] border-[#d946ef] scale-[1.04]";
      }
    } else if (type === 'del') {
      if (main === 'AC') {
        bgClass = "bg-[#881313] hover:bg-[#a81a1a] border-[#b91c1c]/40 text-white";
      } else {
        bgClass = "bg-[#1e293b] hover:bg-[#334155] border-[#475569]/40 text-white";
      }
      radiusClass = "rounded-[8px]";
    } else if (type === 'system') {
      bgClass = "bg-[#171c24] hover:bg-[#202732] border-[#293240]/40 text-gray-300";
      radiusClass = "rounded-full";
    } else if (type === 'exe') {
      bgClass = "bg-[#0f243c] hover:bg-[#1b3b60] border-[#0088cc]/60 text-[#00f2ff]";
      extraClasses = "shadow-[0_0_12px_rgba(0,136,204,0.3)] font-bold";
    }
  }

  const heightClass = tall ? 'h-[76px]' : 'h-[36px]';
  const widthClass = wide ? 'flex-[2]' : 'flex-[1]';

  return (
    <div
      className={`btn-glass ${bgClass} ${radiusClass} ${extraClasses} border shadow-inner-glass flex items-center justify-center relative cursor-pointer select-none ${heightClass} ${widthClass} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      onMouseDown={handlePress}
      onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
      role="button"
      aria-label={`${shift ? `SHIFT: ${shift}, ` : ''}${main}${alpha ? `, ALPHA: ${alpha}` : ''}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => e.key === 'Enter' && handlePress()}
    >
      {/* Main label */}
      <span className={`font-keypad-primary pointer-events-none transition-all duration-200 ${isShiftActive || isAlphaActive ? 'opacity-30 scale-90' : 'opacity-100'} ${mainSize === 'xs' ? 'text-[12px]' : mainSize === 'sm' ? 'text-[16px]' : mainSize === 'lg' ? 'text-[22px]' : 'text-[18px]'}`}>
        {main}
      </span>
    </div>
  );
}
