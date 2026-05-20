import React from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import type { AngleUnit } from '../../engine/math/types';

// ── Settings Menu ─────────────────────────────────────────────────────────────

export function SettingsMenu() {
  const {
    setActiveMenu, angleUnit, setAngleUnit,
    theme, toggleTheme, soundEnabled, toggleSound,
    memory, variables, resetAll,
  } = useCalcStore();

  const angleUnits: AngleUnit[] = ['DEG', 'RAD', 'GRAD'];
  const angleDesc = { DEG: 'Degrees (0–360)', RAD: 'Radians (0–2π)', GRAD: 'Gradians (0–400)' };

  return (
    <div className="menu-overlay" onClick={() => setActiveMenu(null)}>
      <div className="menu-panel" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-base">Settings</h2>
          <button className="text-gray-400 hover:text-white text-lg p-1" onClick={() => setActiveMenu(null)}>✕</button>
        </div>

        {/* Angle Unit */}
        <div className="mb-4">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Angle Unit</div>
          <div className="flex gap-2">
            {angleUnits.map(u => (
              <button
                key={u}
                className={`flex-1 py-2 rounded-lg font-mono text-sm transition-all ${
                  angleUnit === u
                    ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.5)] text-[var(--lcd-text)]'
                    : 'bg-[rgba(255,255,255,0.04)] border border-transparent text-gray-400 hover:border-[rgba(100,200,50,0.2)]'
                }`}
                onClick={() => setAngleUnit(u)}
                title={angleDesc[u]}
              >
                {u}
              </button>
            ))}
          </div>
          <div className="text-gray-500 text-xs mt-1">{angleDesc[angleUnit]}</div>
        </div>

        {/* Display Preferences */}
        <div className="mb-4 space-y-2">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Display</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Theme</span>
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.1)] text-sm"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#ccc' }}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Key Sound</span>
            <button
              className={`w-10 h-5 rounded-full transition-colors relative ${soundEnabled ? 'bg-[rgba(100,200,50,0.4)]' : 'bg-gray-700'}`}
              onClick={toggleSound}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Memory & Variables */}
        <div className="mb-4">
          <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">Memory</div>
          <div className="bg-[#0a0a14] rounded-lg p-2 font-mono text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">M (Memory)</span>
              <span style={{ color: 'var(--lcd-text)' }}>{memory}</span>
            </div>
            {Object.entries(variables).filter(([k]) => k !== 'M').map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-600">{k}</span>
                <span className="text-gray-500">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reset */}
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-3">
          <button
            className="w-full py-2 rounded-lg text-sm font-medium text-red-400 border border-red-900 hover:bg-red-900/20 transition-colors"
            onClick={() => { if (confirm('Reset all calculator memory and settings?')) { resetAll(); setActiveMenu(null); } }}
          >
            Factory Reset
          </button>
        </div>
      </div>
    </div>
  );
}
