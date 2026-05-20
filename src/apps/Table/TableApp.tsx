import React, { useState } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { evaluate } from '../../engine/evaluator';

export function TableApp() {
  const { angleUnit, displayFormat, fixDigits, variables, ans, preAns } = useCalcStore();
  const [fExpr, setFExpr] = useState('');
  const [gExpr, setGExpr] = useState('');
  const [start, setStart] = useState('1');
  const [end, setEnd] = useState('5');
  const [step, setStep] = useState('1');
  
  const [table, setTable] = useState<{ x: number, f: string, g: string }[] | null>(null);
  const [error, setError] = useState('');

  const generate = () => {
    try {
      const s = parseFloat(start) || 1;
      const e = parseFloat(end) || 5;
      const st = parseFloat(step) || 1;
      
      if (st === 0) throw new Error('Step cannot be 0');
      if (Math.abs((e - s) / st) > 45) throw new Error('Too many rows (max 45)');

      const results = [];
      const dir = st > 0 ? 1 : -1;
      for (let x = s; (dir > 0 ? x <= e : x >= e); x += st) {
        let fRes = '', gRes = '';
        if (fExpr) {
           const r = evaluate(fExpr, { angleUnit, variables: { ...variables, x }, ans, preAns, displayFormat, fixDigits });
           fRes = r.isError ? 'Error' : r.display;
        }
        if (gExpr) {
           const r = evaluate(gExpr, { angleUnit, variables: { ...variables, x }, ans, preAns, displayFormat, fixDigits });
           gRes = r.isError ? 'Error' : r.display;
        }
        results.push({ x, f: fRes, g: gRes });
      }
      setTable(results);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Function definitions */}
      <div className="flex flex-col gap-1 mb-2">
        <div className="flex items-center gap-1">
          <span className="w-8 text-right" style={{ color: 'var(--lcd-dim)' }}>f(x)=</span>
          <input className="data-cell flex-1 border border-[rgba(100,200,50,0.2)] rounded px-1" value={fExpr} onChange={e=>setFExpr(e.target.value)} />
        </div>
        <div className="flex items-center gap-1">
          <span className="w-8 text-right" style={{ color: 'var(--lcd-dim)' }}>g(x)=</span>
          <input className="data-cell flex-1 border border-[rgba(100,200,50,0.2)] rounded px-1" value={gExpr} onChange={e=>setGExpr(e.target.value)} />
        </div>
      </div>

      {/* Range definitions */}
      <div className="flex gap-1 mb-2">
         <div className="flex-1 flex flex-col items-center">
            <span style={{ color: 'var(--lcd-dim)' }}>Start</span>
            <input className="data-cell w-full border border-[rgba(100,200,50,0.2)] rounded px-1 text-center" value={start} onChange={e=>setStart(e.target.value)} />
         </div>
         <div className="flex-1 flex flex-col items-center">
            <span style={{ color: 'var(--lcd-dim)' }}>End</span>
            <input className="data-cell w-full border border-[rgba(100,200,50,0.2)] rounded px-1 text-center" value={end} onChange={e=>setEnd(e.target.value)} />
         </div>
         <div className="flex-1 flex flex-col items-center">
            <span style={{ color: 'var(--lcd-dim)' }}>Step</span>
            <input className="data-cell w-full border border-[rgba(100,200,50,0.2)] rounded px-1 text-center" value={step} onChange={e=>setStep(e.target.value)} />
         </div>
      </div>

      <button 
        className="py-1 rounded font-bold text-[11px] mb-2"
        style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
        onClick={generate}
      >EXECUTE</button>

      {error && <div className="text-red-400 text-center">{error}</div>}

      {/* Result table */}
      {table && !error && (
        <div className="flex-1 overflow-auto border border-[rgba(100,200,50,0.2)] rounded">
          <table className="w-full border-collapse">
            <thead className="bg-[rgba(100,200,50,0.1)] sticky top-0">
              <tr style={{ color: 'var(--lcd-dim)' }}>
                <th className="font-normal w-8 text-center border-r border-[rgba(100,200,50,0.2)]">x</th>
                {fExpr && <th className="font-normal text-right px-1 border-r border-[rgba(100,200,50,0.2)]">f(x)</th>}
                {gExpr && <th className="font-normal text-right px-1">g(x)</th>}
              </tr>
            </thead>
            <tbody>
              {table.map((r, i) => (
                <tr key={i} className="border-t border-[rgba(100,200,50,0.1)]">
                  <td className="text-center border-r border-[rgba(100,200,50,0.2)] text-gray-400">{r.x.toPrecision(6)}</td>
                  {fExpr && <td className="text-right px-1 border-r border-[rgba(100,200,50,0.2)]">{r.f}</td>}
                  {gExpr && <td className="text-right px-1">{r.g}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
