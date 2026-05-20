import React from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import type { AppMode } from '../../state/useCalcStore';

// ── 13-App Home Menu ──────────────────────────────────────────────────────────

interface AppDef {
  id: AppMode;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
}

const APPS: AppDef[] = [
  { id: 'calculate',    label: 'Calculate',    sublabel: 'Basic & Scientific', icon: '∫',  color: '#4a9eff' },
  { id: 'statistics',   label: 'Statistics',   sublabel: '1-Var / 2-Var',      icon: 'σ',  color: '#34d399' },
  { id: 'distribution', label: 'Dist.',        sublabel: 'Normal·Binom·Pois',  icon: '⌔',  color: '#a78bfa' },
  { id: 'spreadsheet',  label: 'Spreadsheet',  sublabel: '5 × 45 Grid',        icon: '⊞',  color: '#f59e0b' },
  { id: 'table',        label: 'Table',        sublabel: 'f(x) Table',         icon: '≡',  color: '#ec4899' },
  { id: 'equation',     label: 'Equation',     sublabel: 'Simult · Poly',      icon: '=',  color: '#f97316' },
  { id: 'inequality',   label: 'Inequality',   sublabel: 'Poly ≤ ≥ < >',       icon: '≠',  color: '#ef4444' },
  { id: 'complex',      label: 'Complex',      sublabel: 'a + bi',             icon: 'ℂ',  color: '#06b6d4' },
  { id: 'base-n',       label: 'Base-N',       sublabel: 'BIN·OCT·HEX',        icon: '₂',  color: '#84cc16' },
  { id: 'matrix',       label: 'Matrix',       sublabel: 'Up to 4 × 4',        icon: '⊡',  color: '#8b5cf6' },
  { id: 'vector',       label: 'Vector',       sublabel: '2D / 3D',            icon: '→',  color: '#14b8a6' },
  { id: 'ratio',        label: 'Ratio',        sublabel: 'a : b = c : ?',      icon: '∷',  color: '#d946ef' },
  { id: 'mathbox',      label: 'Math Box',     sublabel: 'Simulations',        icon: '⬡',  color: '#fb923c' },
];

export function HomeMenu() {
  const { setActiveApp, setActiveMenu, activeApp } = useCalcStore();

  const handleSelect = (appId: AppMode) => {
    setActiveApp(appId);
    setActiveMenu(null);
  };

  return (
    <div className="menu-overlay" onClick={() => setActiveMenu(null)}>
      <div className="menu-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-bold text-base tracking-wide">Calculator Apps</h2>
          <button
            className="text-gray-400 hover:text-white text-lg leading-none p-1"
            onClick={() => setActiveMenu(null)}
          >
            ✕
          </button>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-4 gap-2">
          {APPS.map((app, idx) => (
            <button
              key={app.id}
              className={`app-icon flex-col ${activeApp === app.id ? 'focused' : ''}`}
              onClick={() => handleSelect(app.id)}
              aria-label={`Open ${app.label} app`}
            >
              {/* Number badge */}
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-mono text-gray-500">{idx + 1}</span>
                <span
                  className="text-lg font-bold leading-none"
                  style={{ color: app.color }}
                >
                  {app.icon}
                </span>
              </div>
              <span className="text-white text-[10px] font-semibold mt-1 text-center leading-tight">
                {app.label}
              </span>
              <span className="text-gray-500 text-[8px] text-center leading-tight mt-0.5">
                {app.sublabel}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
