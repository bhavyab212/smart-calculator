import React, { Suspense, lazy } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { StatusBar } from './StatusBar';
import { Display } from './Display';
import { KeypadLayout } from './KeypadLayout';
import { HomeMenu } from '../Menus/HomeMenu';
import { CatalogMenu } from '../Menus/CatalogMenu';
import { FormatMenu } from '../Menus/FormatMenu';
import { SettingsMenu } from '../Menus/SettingsMenu';
import { CalculateApp } from '../../apps/Calculate/CalculateApp';

// Lazy-load heavy apps
const StatisticsApp   = lazy(() => import('../../apps/Statistics/StatisticsApp').then(m => ({ default: m.StatisticsApp })));
const DistributionApp = lazy(() => import('../../apps/Distribution/DistributionApp').then(m => ({ default: m.DistributionApp })));
const EquationApp     = lazy(() => import('../../apps/Equation/EquationApp').then(m => ({ default: m.EquationApp })));
const InequalityApp   = lazy(() => import('../../apps/Inequality/InequalityApp').then(m => ({ default: m.InequalityApp })));
const MatrixApp       = lazy(() => import('../../apps/Matrix/MatrixApp').then(m => ({ default: m.MatrixApp })));
const VectorApp       = lazy(() => import('../../apps/Vector/VectorApp').then(m => ({ default: m.VectorApp })));
const BaseNApp        = lazy(() => import('../../apps/BaseN/BaseNApp').then(m => ({ default: m.BaseNApp })));
const ComplexApp      = lazy(() => import('../../apps/Complex/ComplexApp').then(m => ({ default: m.ComplexApp })));
const SpreadsheetApp  = lazy(() => import('../../apps/Spreadsheet/SpreadsheetApp').then(m => ({ default: m.SpreadsheetApp })));
const TableApp        = lazy(() => import('../../apps/Table/TableApp').then(m => ({ default: m.TableApp })));
const RatioApp        = lazy(() => import('../../apps/Ratio/RatioApp').then(m => ({ default: m.RatioApp })));
const MathBoxApp      = lazy(() => import('../../apps/MathBox/MathBoxApp').then(m => ({ default: m.MathBoxApp })));

function AppFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-4" style={{ color: 'var(--lcd-dim)' }}>
      <div className="text-xs font-mono animate-pulse">Loading...</div>
    </div>
  );
}

// Map appMode → component
function ActiveApp() {
  const { activeApp } = useCalcStore();
  return (
    <Suspense fallback={<AppFallback />}>
      {activeApp === 'calculate'    && <CalculateApp />}
      {activeApp === 'statistics'   && <StatisticsApp />}
      {activeApp === 'distribution' && <DistributionApp />}
      {activeApp === 'equation'     && <EquationApp />}
      {activeApp === 'inequality'   && <InequalityApp />}
      {activeApp === 'matrix'       && <MatrixApp />}
      {activeApp === 'vector'       && <VectorApp />}
      {activeApp === 'base-n'       && <BaseNApp />}
      {activeApp === 'complex'      && <ComplexApp />}
      {activeApp === 'spreadsheet'  && <SpreadsheetApp />}
      {activeApp === 'table'        && <TableApp />}
      {activeApp === 'ratio'        && <RatioApp />}
      {activeApp === 'mathbox'      && <MathBoxApp />}
    </Suspense>
  );
}

// ── Main Calculator Shell ─────────────────────────────────────────────────────

export function Calculator() {
  const { activeMenu } = useCalcStore();

  return (
    <div className="w-full max-w-[480px] mx-auto bg-[#171c24] rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-[#2e3745]">
      {/* Subtle Hardware Texture Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none"></div>
      
      {/* Top App Bar (Re-imagined as Hardware Branding/Status) */}
      <div className="flex justify-between items-center mb-4 relative z-10 border-b border-[#2e3745] pb-2 select-none font-sans">
        <div className="flex flex-col">
          <div className="text-white text-[14px] font-extrabold tracking-widest leading-none">CASIO</div>
          <span className="text-[6px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">CLASSWIZ</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-wider text-gray-400 font-semibold">fx-991CW</span>
        </div>
      </div>

      {/* LCD Panel */}
      <div className="lcd-screen bg-[var(--lcd-bg)] rounded-lg border border-[#2e3745] p-3 mb-4 relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col min-h-[190px]">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-lcd-grid" style={{ backgroundSize: '4px 4px', opacity: 0.1 }}></div>
        
        {/* Status Indicators */}
        <div className="relative z-10 w-full mb-1">
          <StatusBar />
        </div>
        
        {/* App-specific content inside LCD */}
        <div className="relative z-10 flex-1 w-full text-[var(--lcd-text)]">
          <ActiveApp />
        </div>
        
        {/* Expression + Result display */}
        <div className="relative z-10 w-full mt-1">
          <Display />
        </div>
      </div>

      {/* Keypad */}
      <div className="relative z-10">
        <KeypadLayout />
      </div>

      {/* Bottom label strip */}
      <div className="relative z-10 text-center pt-2 pb-0">
        <span className="text-gray-600 text-[8px] font-mono tracking-widest uppercase">
          Natural-V.P.A.M.
        </span>
      </div>

      {/* Menus (absolute overlays) */}
      {activeMenu === 'home'     && <HomeMenu />}
      {activeMenu === 'catalog'  && <CatalogMenu />}
      {activeMenu === 'format'   && <FormatMenu />}
      {activeMenu === 'settings' && <SettingsMenu />}
    </div>
  );
}
