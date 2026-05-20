import React from 'react';
import { useCalcStore } from '../../state/useCalcStore';

// ── Status Bar ────────────────────────────────────────────────────────────────

const APP_LABELS: Record<string, string> = {
  calculate: 'CALCULATE', statistics: 'STAT', distribution: 'DIST',
  spreadsheet: 'SHEET', table: 'TABLE', equation: 'EQN',
  inequality: 'INEQ', complex: 'CMPLX', 'base-n': 'BASE-N',
  matrix: 'MAT', vector: 'VCT', ratio: 'RATIO', mathbox: 'MATHBOX',
};

export function StatusBar() {
  const { angleUnit, shiftState, memory, activeApp, displayFormat } = useCalcStore();

  return (
    <div className="flex items-center justify-between px-2 py-1 text-xs font-mono select-none"
         style={{ color: 'var(--lcd-dim)', borderBottom: '1px solid rgba(100,200,50,0.15)' }}>
      {/* Left: mode indicators */}
      <div className="flex items-center gap-1">
        <span className={`status-indicator ${shiftState === 'shift' ? 'active' : ''}`}>S</span>
        <span className={`status-indicator ${shiftState === 'alpha' ? 'active' : ''}`}>A</span>
        <span className={`status-indicator ${memory !== 0 ? 'active' : ''}`}>M</span>
      </div>

      {/* Center: app name */}
      <span className="lcd-text-dim font-bold tracking-widest text-[10px]">
        {APP_LABELS[activeApp] || 'CALCULATE'}
      </span>

      {/* Right: angle + format */}
      <div className="flex items-center gap-1">
        <span className="status-indicator active">{angleUnit}</span>
        {displayFormat !== 'std' && (
          <span className="status-indicator">{displayFormat.toUpperCase()}</span>
        )}
      </div>
    </div>
  );
}
