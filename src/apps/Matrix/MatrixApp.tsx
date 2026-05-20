import React, { useState } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { matAdd, matSub, matMul, matTranspose, matDet, matInverse, matPow, matTrace, matScalar, createMatrix } from '../../engine/math/matrix';
import type { Matrix } from '../../engine/math/matrix';

type MatOp = 'add' | 'sub' | 'mul' | 'transpose' | 'det' | 'inv' | 'pow' | 'trace' | 'scalar';

export function MatrixApp() {
  const { matrices, setMatrix } = useCalcStore();
  const [activeMatrix, setActiveMatrix] = useState<'MatA'|'MatB'|'MatC'>('MatA');
  const [op, setOp] = useState<MatOp>('det');
  const [scalarVal, setScalarVal] = useState('2');
  const [powVal, setPowVal] = useState('2');
  const [result, setResult] = useState<string>('');
  const [editSize, setEditSize] = useState<[number,number]>([2,2]);

  const mat = matrices[activeMatrix] as Matrix;

  const setCell = (r: number, c: number, v: string) => {
    const m = mat.map(row => [...row]);
    m[r][c] = parseFloat(v) || 0;
    setMatrix(activeMatrix, m);
  };

  const resizeMatrix = (rows: number, cols: number) => {
    setEditSize([rows, cols]);
    setMatrix(activeMatrix, createMatrix(rows, cols));
  };

  const format = (m: Matrix) =>
    '[\n' + m.map(row => '  [' + row.map(v => v.toPrecision(6)).join(', ') + ']').join('\n') + '\n]';

  const execute = () => {
    try {
      const A = matrices['MatA'] as Matrix;
      const B = matrices['MatB'] as Matrix;
      let res: string;
      switch (op) {
        case 'add':       res = format(matAdd(A, B)); break;
        case 'sub':       res = format(matSub(A, B)); break;
        case 'mul':       res = format(matMul(A, B)); break;
        case 'transpose': res = format(matTranspose(mat)); break;
        case 'det':       res = `det = ${matDet(mat).toPrecision(10)}`; break;
        case 'inv':       res = format(matInverse(mat)); break;
        case 'pow':       res = format(matPow(mat, parseInt(powVal))); break;
        case 'trace':     res = `tr = ${matTrace(mat).toPrecision(10)}`; break;
        case 'scalar':    res = format(matScalar(mat, parseFloat(scalarVal))); break;
        default:          res = '';
      }
      setResult(res);
    } catch (e: any) { setResult(`Error: ${e.message}`); }
  };

  const singleMatOps: MatOp[] = ['det','trace','transpose','inv','pow','scalar'];
  const dualMatOps: MatOp[] = ['add','sub','mul'];

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Matrix selector */}
      <div className="flex gap-1 mb-1">
        {(['MatA','MatB','MatC'] as const).map(name => (
          <button key={name}
            className={`flex-1 py-0.5 rounded text-[10px] ${activeMatrix===name ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-500'}`}
            onClick={() => setActiveMatrix(name)}>{name}</button>
        ))}
      </div>

      {/* Size controls */}
      <div className="flex gap-2 mb-1 items-center">
        <span style={{ color: 'var(--lcd-dim)' }}>Size:</span>
        {[2,3,4].map(r => [2,3,4].map(c => (
          <button key={`${r}x${c}`}
            className={`px-1 py-0 rounded text-[9px] ${editSize[0]===r && editSize[1]===c ? 'bg-[rgba(100,200,50,0.2)] border border-[rgba(100,200,50,0.3)]' : 'text-gray-600'}`}
            onClick={() => resizeMatrix(r, c)}>{r}×{c}</button>
        )))}
      </div>

      {/* Matrix grid */}
      <div className="overflow-auto mb-1">
        <table className="border-collapse">
          <tbody>
            {mat.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c}>
                    <input
                      className="data-cell border border-[rgba(100,200,50,0.15)] rounded text-center"
                      style={{ width: '48px' }}
                      type="number" value={cell}
                      onChange={e => setCell(r, c, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Operation picker */}
      <div className="flex flex-wrap gap-0.5 mb-1">
        {[...singleMatOps, ...dualMatOps].map(o => (
          <button key={o}
            className={`px-1.5 py-0.5 rounded text-[9px] ${op===o ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-600 hover:text-gray-400'}`}
            onClick={() => setOp(o)}>{o}</button>
        ))}
      </div>

      {op === 'pow' && <input className="data-cell border border-[rgba(100,200,50,0.2)] rounded px-1 mb-1 w-16" type="number" value={powVal} onChange={e=>setPowVal(e.target.value)} placeholder="exp" />}
      {op === 'scalar' && <input className="data-cell border border-[rgba(100,200,50,0.2)] rounded px-1 mb-1 w-16" type="number" value={scalarVal} onChange={e=>setScalarVal(e.target.value)} placeholder="k" />}

      <button
        className="py-0.5 rounded text-[10px] font-bold mb-1"
        style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
        onClick={execute}
      >{['add','sub','mul'].includes(op) ? `MatA ${op} MatB` : `${op.toUpperCase()} (${activeMatrix})`}</button>

      {result && (
        <pre className="text-[9px] overflow-auto rounded p-1" style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--lcd-text)', maxHeight: '60px' }}>
          {result}
        </pre>
      )}
    </div>
  );
}
