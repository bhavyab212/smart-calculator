import React, { useState } from 'react';
import { solveSimultaneous } from '../../engine/math/equations';
import { solveQuadratic, solveCubic, solveQuartic } from '../../engine/math/equations';
import type { Root } from '../../engine/math/equations';

type EqnMode = 'simult-2' | 'simult-3' | 'simult-4' | 'poly-2' | 'poly-3' | 'poly-4';

function emptyMatrix(r: number, c: number) {
  return Array.from({ length: r }, () => Array(c).fill(''));
}

export function EquationApp() {
  const [mode, setMode] = useState<EqnMode>('simult-2');
  const [matrix, setMatrix] = useState<string[][]>(emptyMatrix(2, 3));
  const [coeffs, setCoeffs] = useState<string[]>(['', '', '']);
  const [result, setResult] = useState<string[]>([]);

  const isSimult = mode.startsWith('simult');
  const vars = mode === 'simult-2' ? 2 : mode === 'simult-3' ? 3 : mode === 'simult-4' ? 4
    : mode === 'poly-2' ? 3 : mode === 'poly-3' ? 4 : 5;

  const handleModeChange = (m: EqnMode) => {
    setMode(m);
    setResult([]);
    if (m.startsWith('simult')) {
      const n = m === 'simult-2' ? 2 : m === 'simult-3' ? 3 : 4;
      setMatrix(emptyMatrix(n, n + 1));
    } else {
      const n = m === 'poly-2' ? 3 : m === 'poly-3' ? 4 : 5;
      setCoeffs(Array(n).fill(''));
    }
  };

  const setCell = (r: number, c: number, v: string) => {
    const m = matrix.map(row => [...row]);
    m[r][c] = v;
    setMatrix(m);
  };

  const setCoeff = (i: number, v: string) => {
    const c = [...coeffs]; c[i] = v; setCoeffs(c);
  };

  const calculate = () => {
    try {
      if (isSimult) {
        const n = matrix.length;
        const cm = matrix.map(row => row.slice(0, n).map(Number));
        const rhs = matrix.map(row => Number(row[n]));
        const sol = solveSimultaneous(cm, rhs);
        setResult(sol.map((v, i) => `x${i+1} = ${v.toPrecision(10)}`));
      } else {
        const c = coeffs.map(Number);
        let roots: Root[] = [];
        if (mode === 'poly-2') roots = solveQuadratic(c[0], c[1], c[2]);
        else if (mode === 'poly-3') roots = solveCubic(c[0], c[1], c[2], c[3]);
        else roots = solveQuartic(c[0], c[1], c[2], c[3], c[4]);
        setResult(roots.map((r, i) =>
          r.isComplex
            ? `x${i+1} = ${r.re.toPrecision(6)} ${r.im >= 0 ? '+' : '-'} ${Math.abs(r.im).toPrecision(6)}i`
            : `x${i+1} = ${r.re.toPrecision(10)}`
        ));
      }
    } catch (e: any) { setResult([e.message]); }
  };

  const varLabels = ['x₁','x₂','x₃','x₄'];
  const polyLabels = mode === 'poly-2' ? ['a','b','c'] : mode === 'poly-3' ? ['a','b','c','d'] : ['a','b','c','d','e'];
  const polyExp    = mode === 'poly-2' ? ['x²','x',''] : mode === 'poly-3' ? ['x³','x²','x',''] : ['x⁴','x³','x²','x',''];

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Mode picker */}
      <div className="flex gap-0.5 mb-2 flex-wrap">
        {(['simult-2','simult-3','simult-4','poly-2','poly-3','poly-4'] as EqnMode[]).map(m => (
          <button key={m}
            className={`px-1.5 py-0.5 rounded text-[9px] ${mode===m ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-500'}`}
            onClick={() => handleModeChange(m)}>
            {m.startsWith('simult') ? `${m.split('-')[1]}×${m.split('-')[1]}` : `deg${m.split('-')[1]}`}
          </button>
        ))}
      </div>

      {isSimult ? (
        /* Simultaneous grid */
        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ color: 'var(--lcd-dim)' }}>
                {varLabels.slice(0, matrix.length).map(v => <th key={v} className="data-cell-header">{v}</th>)}
                <th className="data-cell-header">=</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, r) => (
                <tr key={r} className="border-t border-[rgba(100,200,50,0.06)]">
                  {row.map((cell, c) => (
                    <td key={c}>
                      <input className="data-cell w-full text-center" type="number" value={cell}
                        onChange={e => setCell(r, c, e.target.value)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Polynomial coefficients */
        <div className="flex flex-col gap-1 flex-1">
          {polyLabels.map((lbl, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="w-4 text-right" style={{ color: 'var(--lcd-dim)' }}>{lbl}</span>
              <input className="data-cell flex-1 border border-[rgba(100,200,50,0.2)] rounded px-1" type="number"
                value={coeffs[i]} onChange={e => setCoeff(i, e.target.value)} />
              <span className="text-gray-600 w-8">{polyExp[i]}</span>
            </div>
          ))}
        </div>
      )}

      <button
        className="mt-2 py-1 rounded font-bold text-[11px] mb-2"
        style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
        onClick={calculate}
      >SOLVE</button>

      <div className="space-y-0.5">
        {result.map((r, i) => (
          <div key={i} className="flex justify-between">
            <span style={{ color: 'var(--lcd-dim)' }}>{r.split('=')[0]}=</span>
            <span style={{ color: 'var(--lcd-text)' }}>{r.split('=').slice(1).join('=')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
