import React, { useState } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { evaluate } from '../../engine/evaluator';

export function ComplexApp() {
  const { angleUnit, displayFormat, fixDigits } = useCalcStore();
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('');
  
  const handleCalc = () => {
    try {
      if (!expr.trim()) return;
      // We evaluate with a special context that supports 'i'
      // The evaluator already handles 'i' properly if parsed as complex
      // For this app, we'll let math.js native complex numbers handle it.
      const res = evaluate(expr.replace(/i/g, 'i'), { angleUnit, variables: { i: {re:0, im:1} }, ans: 0, preAns: 0, displayFormat, fixDigits });
      setResult(res.display);
    } catch (e: any) {
      setResult('Error');
    }
  };

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      <div className="text-gray-500 mb-2">Complex Mode: a + bi</div>
      
      <div className="flex flex-col flex-1 gap-2">
        <input 
          className="data-cell border border-[rgba(100,200,50,0.2)] rounded px-2 py-1 text-base w-full"
          value={expr}
          onChange={e => setExpr(e.target.value)}
          placeholder="e.g. (2+3i)*(4-i)"
        />
        
        <div className="flex gap-1 flex-wrap">
          <button className="px-2 py-1 rounded text-[10px] bg-[rgba(100,200,50,0.1)] border border-[rgba(100,200,50,0.2)]" onClick={() => setExpr(e => e + 'i')}>i</button>
          <button className="px-2 py-1 rounded text-[10px] bg-[rgba(100,200,50,0.1)] border border-[rgba(100,200,50,0.2)]" onClick={() => setExpr(e => e + 'arg(')}>arg(</button>
          <button className="px-2 py-1 rounded text-[10px] bg-[rgba(100,200,50,0.1)] border border-[rgba(100,200,50,0.2)]" onClick={() => setExpr(e => e + 'abs(')}>abs(</button>
          <button className="px-2 py-1 rounded text-[10px] bg-[rgba(100,200,50,0.1)] border border-[rgba(100,200,50,0.2)]" onClick={() => setExpr(e => e + 'conj(')}>conj(</button>
        </div>

        <button 
          className="mt-auto py-1 rounded font-bold text-[11px]"
          style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
          onClick={handleCalc}
        >CALCULATE</button>

        {result && (
           <div className="text-right text-lg mt-1 font-bold">
             {result}
           </div>
        )}
      </div>
    </div>
  );
}
