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
  const { angleUnit, shiftState, memory, displayFormat } = useCalcStore();

  return (
    <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-mono select-none text-[#4b5e4d] border-b border-[#4b5e4d]/20">
      {/* Left: mode indicators */}
      <div className="flex items-center gap-2">
        <span className={`px-0.5 rounded font-bold border transition-colors ${
          shiftState === 'shift' ? 'bg-[#121c12] text-white border-[#121c12]' : 'border-transparent opacity-30'
        }`}>S</span>
        <span className={`px-0.5 rounded font-bold border transition-colors ${
          shiftState === 'alpha' ? 'bg-[#121c12] text-white border-[#121c12]' : 'border-transparent opacity-30'
        }`}>A</span>
        <span className={`px-0.5 rounded font-bold border transition-colors ${
          memory !== 0 ? 'bg-[#121c12] text-white border-[#121c12]' : 'border-transparent opacity-30'
        }`}>M</span>
        
        {/* QR Code and App grid icon simulator */}
        <span className="material-symbols-outlined text-[10px] opacity-70">qr_code_2</span>
        <span className="material-symbols-outlined text-[10px] opacity-70">grid_view</span>
      </div>

      {/* Right: angle + display mode format */}
      <div className="flex items-center gap-2 font-bold">
        <span>{angleUnit}</span>
        <span className="opacity-90">Math</span>
        <span className="text-[8px]">▲</span>
      </div>
    </div>
  );
}
