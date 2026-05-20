import React, { useState } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { oneVarStats, twoVarStats, regression } from '../../engine/math/statistics';
import type { RegressionType } from '../../engine/math/statistics';

type StatMode = '1-var' | '2-var';
const REG_TYPES: { value: RegressionType; label: string }[] = [
  { value: 'linear',      label: 'Lin  y=a+bx' },
  { value: 'quadratic',   label: 'Quad y=a+bx+cx²' },
  { value: 'logarithmic', label: 'Log  y=a+b·ln(x)' },
  { value: 'expE',        label: 'Exp  y=a·e^(bx)' },
  { value: 'expAB',       label: 'Exp  y=a·b^x' },
  { value: 'power',       label: 'Pwr  y=a·x^b' },
  { value: 'inverse',     label: 'Inv  y=a+b/x' },
];

export function StatisticsApp() {
  const { statsData, setStatsData } = useCalcStore();
  const [mode, setMode] = useState<StatMode>('1-var');
  const [regType, setRegType] = useState<RegressionType>('linear');
  const [view, setView] = useState<'data' | 'result'>('data');
  const [result, setResult] = useState<string[]>([]);
  const [rows, setRows] = useState(10);

  const { x, y, freq } = statsData;

  const updateCell = (col: 'x' | 'y' | 'freq', idx: number, val: string) => {
    const arr = [...(statsData[col] ?? [])];
    arr[idx] = parseFloat(val) || 0;
    setStatsData({ ...statsData, [col]: arr });
  };

  const calculate = () => {
    try {
      const xs = x.filter((_, i) => x[i] !== undefined).slice(0, rows);
      const fs = freq.length ? freq.slice(0, rows) : undefined;
      if (mode === '1-var') {
        const s = oneVarStats(xs, fs);
        setResult([
          `n = ${s.n}`, `Σx = ${s.sumX.toPrecision(10)}`,
          `Σx² = ${s.sumX2.toPrecision(10)}`, `x̄ = ${s.mean.toPrecision(10)}`,
          `σx = ${s.sigmaX.toPrecision(10)}`, `sx = ${s.sX.toPrecision(10)}`,
          `Min = ${s.minX}`, `Q1 = ${s.q1}`, `Med = ${s.median}`,
          `Q3 = ${s.q3}`, `Max = ${s.maxX}`,
        ]);
      } else {
        const ys = y.slice(0, rows);
        const s = twoVarStats(xs, ys, fs);
        const reg = regression(xs, ys, regType);
        setResult([
          `n = ${s.n}`,
          `x̄ = ${s.mean.toPrecision(8)}`,  `ȳ = ${s.meanY.toPrecision(8)}`,
          `σx = ${s.sigmaX.toPrecision(8)}`, `σy = ${s.sigmaY.toPrecision(8)}`,
          `sx = ${s.sX.toPrecision(8)}`,    `sy = ${s.sY.toPrecision(8)}`,
          `Σx = ${s.sumX.toPrecision(8)}`,  `Σy = ${s.sumY.toPrecision(8)}`,
          `Σxy = ${s.sumXY.toPrecision(8)}`,
          `── Regression ──`,
          `a = ${reg.a.toPrecision(8)}`, `b = ${reg.b.toPrecision(8)}`,
          reg.c !== undefined ? `c = ${reg.c.toPrecision(8)}` : '',
          `r = ${reg.r.toPrecision(8)}`, `r² = ${reg.r2.toPrecision(8)}`,
        ].filter(Boolean));
      }
      setView('result');
    } catch (e: any) {
      setResult([e.message]);
      setView('result');
    }
  };

  const dataRows = Array.from({ length: rows });

  return (
    <div className="flex flex-col h-full text-xs font-mono" style={{ color: 'var(--lcd-text)' }}>
      {/* Toolbar */}
      <div className="flex gap-1 p-1 border-b border-[rgba(100,200,50,0.1)]">
        {(['1-var', '2-var'] as StatMode[]).map(m => (
          <button key={m} className={`px-2 py-0.5 rounded text-[10px] transition-colors ${mode===m ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-500'}`}
            onClick={() => setMode(m)}>{m}</button>
        ))}
        {mode === '2-var' && <select
          className="ml-auto text-[9px] bg-transparent border-none outline-none"
          style={{ color: 'var(--lcd-dim)' }}
          value={regType}
          onChange={e => setRegType(e.target.value as RegressionType)}
        >
          {REG_TYPES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>}
        <button className={`px-2 py-0.5 rounded text-[10px] ml-auto ${view==='data'?'text-[var(--lcd-text)]':'text-gray-500'}`} onClick={()=>setView('data')}>DATA</button>
        <button className={`px-2 py-0.5 rounded text-[10px] ${view==='result'?'text-[var(--lcd-text)]':'text-gray-500'}`} onClick={calculate}>CALC</button>
      </div>

      {view === 'data' ? (
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ color: 'var(--lcd-dim)' }}>
                <th className="data-cell-header w-8">#</th>
                <th className="data-cell-header">x</th>
                {mode === '2-var' && <th className="data-cell-header">y</th>}
                <th className="data-cell-header">freq</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((_, i) => (
                <tr key={i} className="border-t border-[rgba(100,200,50,0.06)]">
                  <td className="data-cell-header">{i+1}</td>
                  <td><input className="data-cell w-full" type="number" value={x[i]??''} onChange={e=>updateCell('x',i,e.target.value)} /></td>
                  {mode === '2-var' && <td><input className="data-cell w-full" type="number" value={y[i]??''} onChange={e=>updateCell('y',i,e.target.value)} /></td>}
                  <td><input className="data-cell w-full" type="number" value={freq[i]??''} placeholder="1" onChange={e=>updateCell('freq',i,e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-1 px-2 py-0.5 text-[10px] text-gray-500 hover:text-gray-300" onClick={()=>setRows(r=>r+5)}>+ 5 rows</button>
        </div>
      ) : (
        <div className="overflow-auto flex-1 p-1 space-y-0.5">
          {result.map((line, i) => (
            <div key={i} className={`flex justify-between ${line.startsWith('──') ? 'text-gray-500 border-t border-[rgba(100,200,50,0.1)] pt-1 mt-1' : ''}`}>
              {line.includes('=') ? (
                <>
                  <span style={{ color: 'var(--lcd-dim)' }}>{line.split('=')[0]}=</span>
                  <span style={{ color: 'var(--lcd-text)' }}>{line.split('=').slice(1).join('=')}</span>
                </>
              ) : <span style={{ color: 'var(--lcd-dim)' }}>{line}</span>}
            </div>
          ))}
          <button className="mt-2 text-[10px] text-gray-500 hover:text-gray-300" onClick={()=>setView('data')}>← Back to Data</button>
        </div>
      )}
    </div>
  );
}
