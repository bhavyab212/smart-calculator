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
      // Determine what to insert based on modifier state
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

  const typeClass = `key-${type}`;
  const heightClass = tall ? 'h-10' : 'h-8';
  const widthClass = wide ? 'flex-[2]' : 'flex-1';

  return (
    <div
      className={`calc-key ${typeClass} ${heightClass} ${widthClass} ${pressed ? 'pressed' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      onMouseDown={handlePress}
      onTouchStart={(e) => { e.preventDefault(); handlePress(); }}
      role="button"
      aria-label={`${shift ? `SHIFT: ${shift}, ` : ''}${main}${alpha ? `, ALPHA: ${alpha}` : ''}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => e.key === 'Enter' && handlePress()}
    >
      {/* SHIFT label row */}
      {(shift || alpha) && (
        <div className="absolute top-[2px] left-0 right-0 flex justify-between px-[3px]">
          {shift ? (
            <span
              className={`key-label-shift leading-none transition-opacity duration-100 ${shiftState === 'shift' ? 'opacity-100' : 'opacity-50'}`}
              style={{ fontSize: '7px' }}
            >
              {shift}
            </span>
          ) : <span />}
          {alpha ? (
            <span
              className={`key-label-alpha leading-none transition-opacity duration-100 ${shiftState === 'alpha' ? 'opacity-100' : 'opacity-50'}`}
              style={{ fontSize: '7px' }}
            >
              {alpha}
            </span>
          ) : <span />}
        </div>
      )}

      {/* Main label */}
      <span className={`key-label-main text-${mainSize}`}>
        {main}
      </span>
    </div>
  );
}
