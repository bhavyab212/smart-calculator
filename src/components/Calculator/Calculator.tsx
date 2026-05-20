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
    <div className="relative" style={{ width: '340px' }}>
      {/* Calculator body */}
      <div className="calc-body flex flex-col" style={{ minHeight: '580px' }}>
        {/* Top brand strip */}
        <div
          className="flex items-center justify-between px-3 py-1.5 rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div>
            <div className="text-white font-bold text-[10px] tracking-[0.2em] uppercase">CASIO</div>
            <div className="text-blue-400 font-mono text-[8px] tracking-widest">fx-991CW</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-[8px]">ClassWiz</div>
            <div className="text-gray-600 text-[7px]">Advanced</div>
          </div>
        </div>

        {/* LCD Panel */}
        <div className="relative mx-2 mt-2">
          <StatusBar />
          {/* App-specific content inside LCD */}
          <div className="lcd-screen rounded-b-none border-t-0 px-1 pb-1 min-h-[90px]">
            <ActiveApp />
          </div>
          {/* Expression + Result display */}
          <Display />
        </div>

        {/* Keypad */}
        <div className="mt-1 flex-1">
          <KeypadLayout />
        </div>

        {/* Bottom label strip */}
        <div
          className="text-center py-1 rounded-b-2xl"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <span className="text-gray-700 text-[8px] font-mono tracking-widest">
            NATURAL-VPAM • NON-PROG
          </span>
        </div>
      </div>

      {/* Menus (absolute overlays) */}
      {activeMenu === 'home'     && <HomeMenu />}
      {activeMenu === 'catalog'  && <CatalogMenu />}
      {activeMenu === 'format'   && <FormatMenu />}
      {activeMenu === 'settings' && <SettingsMenu />}
    </div>
  );
}
