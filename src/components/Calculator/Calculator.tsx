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
    <div className="w-full max-w-[480px] mx-auto bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Subtle Hardware Texture Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-container-high/20 to-transparent pointer-events-none"></div>
      
      {/* Top App Bar (Re-imagined as Hardware Branding/Status) */}
      <div className="flex justify-between items-center mb-6 relative z-10 border-b border-outline-variant/30 pb-2">
        <div className="font-display-input text-[24px] font-bold text-primary-fixed tracking-tighter">CASIO</div>
        <div className="flex items-center gap-4">
          <span className="font-label-status text-label-status uppercase tracking-widest text-primary-fixed-dim">fx-991CW</span>
          <div className="flex gap-2">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">settings</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">info</span>
          </div>
        </div>
      </div>

      {/* LCD Panel */}
      <div className="lcd-screen bg-gradient-to-b from-[#1a2e30] to-[#0d1415] rounded-xl border border-[#3a494b]/50 p-display-padding mb-6 relative shadow-inner overflow-hidden flex flex-col min-h-[220px]">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-lcd-grid" style={{ backgroundSize: '4px 4px' }}></div>
        
        {/* Status Indicators */}
        <div className="relative z-10 w-full mb-2">
          <StatusBar />
        </div>
        
        {/* App-specific content inside LCD */}
        <div className="relative z-10 flex-1 w-full text-primary-fixed">
          <ActiveApp />
        </div>
        
        {/* Expression + Result display */}
        <div className="relative z-10 w-full mt-2">
          <Display />
        </div>
      </div>

      {/* Keypad */}
      <div className="relative z-10">
        <KeypadLayout />
      </div>

      {/* Bottom label strip */}
      <div className="relative z-10 text-center pt-4 pb-1">
        <span className="text-outline-variant text-[10px] font-display-input tracking-widest">
          NATURAL-VPAM • CLASSWIZ
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
