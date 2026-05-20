import React, { useState } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { vecAdd, vecSub, vecScale, vecMagnitude, vecUnit, vecDot, vecCross, vecAngle, vecToString } from '../../engine/math/vector';
import type { Vector, Vector3D } from '../../engine/math/vector';

type VecOp = 'add' | 'sub' | 'dot' | 'cross' | 'scale' | 'magnitude' | 'unit' | 'angle';

export function VectorApp() {
  const { vectors, setVector, angleUnit } = useCalcStore();
  const [active, setActive] = useState<'VctA'|'VctB'|'VctC'>('VctA');
  const [dim, setDim] = useState<2 | 3>(3);
  const [op, setOp] = useState<VecOp>('dot');
  const [scalarVal, setScalarVal] = useState('2');
  const [result, setResult] = useState('');

  const vec = vectors[active] as Vector;

  const setComp = (i: number, v: string) => {
    const arr = [...vec] as number[];
    arr[i] = parseFloat(v) || 0;
    setVector(active, arr as Vector);
  };

  const execute = () => {
    try {
      const A = vectors['VctA'] as Vector;
      const B = vectors['VctB'] as Vector;
      let res: string;
      switch (op) {
        case 'add':       res = vecToString(vecAdd(A, B)); break;
        case 'sub':       res = vecToString(vecSub(A, B)); break;
        case 'dot':       res = `A·B = ${vecDot(A, B).toPrecision(10)}`; break;
        case 'cross':     res = vecToString(vecCross(A as Vector3D, B as Vector3D)); break;
        case 'scale':     res = vecToString(vecScale(vec, parseFloat(scalarVal))); break;
        case 'magnitude': res = `|${active}| = ${vecMagnitude(vec).toPrecision(10)}`; break;
        case 'unit':      res = `û = ${vecToString(vecUnit(vec))}`; break;
        case 'angle':     res = `θ = ${vecAngle(A, B, angleUnit).toPrecision(10)} ${angleUnit}`; break;
        default:          res = '';
      }
      setResult(res);
    } catch (e: any) { setResult(`Error: ${e.message}`); }
  };

  const compLabels = dim === 2 ? ['x','y'] : ['x','y','z'];
  const ops: VecOp[] = ['add','sub','dot','cross','scale','magnitude','unit','angle'];

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Vector selector */}
      <div className="flex gap-1 mb-1">
        {(['VctA','VctB','VctC'] as const).map(name => (
          <button key={name}
            className={`flex-1 py-0.5 rounded text-[10px] ${active===name ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-500'}`}
            onClick={() => setActive(name)}>{name}</button>
        ))}
        <button
          className={`px-2 py-0.5 rounded text-[10px] ml-auto ${dim===2 ? 'text-[var(--lcd-text)]' : 'text-gray-500'}`}
          onClick={() => setDim(dim === 2 ? 3 : 2)}>
          {dim}D
        </button>
      </div>

      {/* Component inputs */}
      <div className="flex gap-1 mb-2">
        {compLabels.map((lbl, i) => (
          <div key={lbl} className="flex-1 flex flex-col items-center">
            <span style={{ color: 'var(--lcd-dim)' }}>{lbl}</span>
            <input
              className="data-cell border border-[rgba(100,200,50,0.2)] rounded px-1 w-full text-center"
              type="number" value={vec[i] ?? 0}
              onChange={e => setComp(i, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Op picker */}
      <div className="flex flex-wrap gap-0.5 mb-1">
        {ops.map(o => (
          <button key={o}
            className={`px-1.5 py-0.5 rounded text-[9px] ${op===o ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-600 hover:text-gray-400'}`}
            onClick={() => setOp(o)}>{o}</button>
        ))}
      </div>

      {op === 'scale' && (
        <input className="data-cell border border-[rgba(100,200,50,0.2)] rounded px-1 mb-1 w-16" type="number" value={scalarVal} onChange={e => setScalarVal(e.target.value)} placeholder="k" />
      )}

      <button
        className="py-0.5 rounded text-[10px] font-bold mb-2"
        style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
        onClick={execute}>COMPUTE</button>

      {result && (
        <div className="rounded px-2 py-1 text-[11px] text-center" style={{ background: 'rgba(100,200,50,0.08)', border: '1px solid rgba(100,200,50,0.2)', color: 'var(--lcd-text)' }}>
          {result}
        </div>
      )}
    </div>
  );
}
