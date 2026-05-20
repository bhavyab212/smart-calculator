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
  let bgClass = "bg-surface-container-high/50 hover:bg-surface-container-highest border-outline-variant/30 text-on-surface";
  let radiusClass = "rounded-[16px]";
  let extraClasses = "";
  
  if (type === 'op' || type === 'fn') {
    bgClass = "bg-surface-variant/70 hover:bg-surface-container-high border-outline-variant/50 text-primary-fixed-dim";
  } else if (type === 'shift') {
    bgClass = "bg-surface-variant/70 hover:bg-surface-container-high border-outline-variant/50 text-[#bf00ff]"; // Electric Purple
    radiusClass = "rounded-full";
  } else if (type === 'alpha') {
    bgClass = "bg-surface-variant/70 hover:bg-surface-container-high border-outline-variant/50 text-primary-fixed";
    radiusClass = "rounded-full";
  } else if (type === 'del' || type === 'system') {
    bgClass = "bg-[#3a1b1b] hover:bg-[#4a2222] border-[#5a2a2a]/50 text-[#ff8080]";
    radiusClass = "rounded-full";
  } else if (type === 'exe') {
    bgClass = "bg-primary-container hover:bg-primary-fixed border-primary/50 text-on-primary-container";
    extraClasses = "shadow-glow-primary font-bold";
  }

  const heightClass = tall ? 'h-[76px]' : 'h-[46px]';
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
      {/* SHIFT/ALPHA label row */}
      {(shift || alpha) && (
        <div className="absolute top-[-16px] left-0 right-0 flex justify-center gap-2 px-[4px]">
          {shift && (
            <span
              className={`font-keypad-secondary text-[9px] tracking-wide transition-opacity duration-100 ${shiftState === 'shift' ? 'opacity-100 font-bold' : 'opacity-70'}`}
              style={{ color: '#bf00ff' }}
            >
              {shift}
            </span>
          )}
          {alpha && (
            <span
              className={`font-keypad-secondary text-[9px] tracking-wide transition-opacity duration-100 ${shiftState === 'alpha' ? 'opacity-100 font-bold' : 'opacity-70'}`}
              style={{ color: '#00f2ff' }}
            >
              {alpha}
            </span>
          )}
        </div>
      )}

      {/* Main label */}
      <span className={`font-keypad-primary pointer-events-none ${mainSize === 'xs' ? 'text-[12px]' : mainSize === 'sm' ? 'text-[16px]' : mainSize === 'lg' ? 'text-[22px]' : 'text-[18px]'}`}>
        {main}
      </span>
    </div>
  );
}
