import React, { useState } from 'react';
import { solveInequality } from '../../engine/math/equations';

type Sign = '>' | '<' | '>=' | '<=';
type Degree = 2 | 3 | 4;

export function InequalityApp() {
  const [degree, setDegree] = useState<Degree>(2);
  const [sign, setSign] = useState<Sign>('>');
  const [coeffs, setCoeffs] = useState<string[]>(['','','']);
  const [result, setResult] = useState('');

  const handleDegree = (d: Degree) => {
    setDegree(d);
    setCoeffs(Array(d + 1).fill(''));
    setResult('');
  };

  const labels = degree === 2 ? ['a','b','c'] : degree === 3 ? ['a','b','c','d'] : ['a','b','c','d','e'];
  const exps   = degree === 2 ? ['x²','x',''] : degree === 3 ? ['x³','x²','x',''] : ['x⁴','x³','x²','x',''];

  const solve = () => {
    try {
      const c = coeffs.map(Number);
      const res = solveInequality(c, sign);
      setResult(res);
    } catch (e: any) { setResult(e.message); }
  };

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Degree tabs */}
      <div className="flex gap-1 mb-2">
        {([2,3,4] as Degree[]).map(d => (
          <button key={d}
            className={`flex-1 py-0.5 rounded text-[10px] ${degree===d ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-500'}`}
            onClick={() => handleDegree(d)}>Degree {d}</button>
        ))}
      </div>

      {/* Sign selector */}
      <div className="flex gap-1 mb-3">
        {(['>', '<', '>=', '<='] as Sign[]).map(s => (
          <button key={s}
            className={`flex-1 py-0.5 rounded text-[11px] font-bold ${sign===s ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)] text-[var(--lcd-text)]' : 'text-gray-500'}`}
            onClick={() => setSign(s)}>{s}</button>
        ))}
      </div>

      {/* Coefficient inputs */}
      <div className="flex flex-col gap-1.5 flex-1">
        {labels.map((lbl, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="w-4 text-right" style={{ color: 'var(--lcd-dim)' }}>{lbl}</span>
            <input
              className="data-cell flex-1 border border-[rgba(100,200,50,0.2)] rounded px-1"
              type="number" value={coeffs[i] ?? ''}
              onChange={e => { const c=[...coeffs]; c[i]=e.target.value; setCoeffs(c); }}
            />
            <span className="text-gray-600 w-8">{exps[i]}</span>
          </div>
        ))}
      </div>

      <button
        className="mt-2 py-1 rounded font-bold text-[11px] mb-2"
        style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
        onClick={solve}
      >SOLVE</button>

      {result && (
        <div className="rounded p-2 text-center text-[11px]" style={{ background: 'rgba(100,200,50,0.08)', border: '1px solid rgba(100,200,50,0.2)', color: 'var(--lcd-text)' }}>
          {result}
        </div>
      )}
    </div>
  );
}
