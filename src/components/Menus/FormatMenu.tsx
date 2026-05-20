import React from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import type { DisplayFormat } from '../../engine/math/arithmetic';

// ── Format Settings Menu ──────────────────────────────────────────────────────

const FORMAT_OPTIONS: { value: DisplayFormat; label: string; desc: string }[] = [
  { value: 'std',   label: 'Standard',    desc: 'Auto (no trailing zeros)' },
  { value: 'dec',   label: 'Decimal',     desc: 'Fixed decimal notation' },
  { value: 'sci',   label: 'Scientific',  desc: '1.23×10^4 format' },
  { value: 'eng',   label: 'Engineering', desc: 'Exponent in multiples of 3' },
  { value: 'fix',   label: 'Fix',         desc: 'Fixed decimal places' },
  { value: 'norm1', label: 'Norm 1',      desc: 'Sci below 0.1 or above 10^9' },
  { value: 'norm2', label: 'Norm 2',      desc: 'Sci below 0.01 or above 10^9' },
];

const FIX_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function FormatMenu() {
  const { setActiveMenu, displayFormat, setDisplayFormat, fixDigits, setFixDigits } = useCalcStore();

  return (
    <div className="menu-overlay" onClick={() => setActiveMenu(null)}>
      <div className="menu-panel" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base">Display Format</h2>
          <button className="text-gray-400 hover:text-white text-lg p-1" onClick={() => setActiveMenu(null)}>✕</button>
        </div>

        {/* Format options */}
        <div className="space-y-1 mb-4">
          {FORMAT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`w-full menu-item ${displayFormat === opt.value ? 'focused' : ''}`}
              onClick={() => setDisplayFormat(opt.value)}
            >
              <div
                className="w-3 h-3 rounded-full border-2 mr-2 shrink-0"
                style={{
                  borderColor: 'var(--lcd-text)',
                  background: displayFormat === opt.value ? 'var(--lcd-text)' : 'transparent',
                }}
              />
              <span className="font-mono text-sm w-24 shrink-0">{opt.label}</span>
              <span className="text-gray-500 text-xs">{opt.desc}</span>
            </button>
          ))}
        </div>

        {/* Digits selector (for Fix/Sci/Eng) */}
        <div className="border-t border-[rgba(255,255,255,0.08)] pt-3">
          <div className="text-gray-400 text-xs mb-2">Decimal places / significant digits:</div>
          <div className="flex gap-1 flex-wrap">
            {FIX_DIGITS.map(n => (
              <button
                key={n}
                className={`w-8 h-8 rounded font-mono text-sm transition-colors ${
                  fixDigits === n
                    ? 'bg-[rgba(100,200,50,0.3)] border border-[rgba(100,200,50,0.5)]'
                    : 'bg-[rgba(255,255,255,0.05)] border border-transparent hover:border-[rgba(100,200,50,0.2)]'
                }`}
                style={{ color: fixDigits === n ? 'var(--lcd-text)' : '#888' }}
                onClick={() => setFixDigits(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
