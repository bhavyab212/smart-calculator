import React, { useState } from 'react';

type RatioMode = 'A/B=X/D' | 'A/B=C/X';

export function RatioApp() {
  const [mode, setMode] = useState<RatioMode>('A/B=X/D');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState(''); // Used as D in X/D mode
  
  const [result, setResult] = useState('');

  const calculate = () => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    const nc = parseFloat(c);

    if (isNaN(na) || isNaN(nb) || isNaN(nc)) {
      setResult('Invalid inputs');
      return;
    }
    if (nb === 0 || (mode === 'A/B=X/D' && na === 0)) {
      setResult('Math ERROR (div by 0)');
      return;
    }

    if (mode === 'A/B=X/D') {
      // a/b = X/d -> X = (a * d) / b  (where 'c' var holds d)
      const x = (na * nc) / nb;
      setResult(`X = ${x.toPrecision(10)}`);
    } else {
      // a/b = c/X -> X = (b * c) / a
      if (na === 0) {
        setResult('Math ERROR (div by 0)');
        return;
      }
      const x = (nb * nc) / na;
      setResult(`X = ${x.toPrecision(10)}`);
    }
  };

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Mode picker */}
      <div className="flex gap-1 mb-4">
        {(['A/B=X/D', 'A/B=C/X'] as RatioMode[]).map(m => (
          <button key={m}
            className={`flex-1 py-1 rounded text-[10px] ${mode===m ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-500'}`}
            onClick={() => { setMode(m); setResult(''); }}
          >{m}</button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mb-4 text-lg">
        <div className="flex flex-col items-center gap-1 w-16">
           <input className="data-cell w-full border border-[rgba(100,200,50,0.2)] rounded text-center" value={a} onChange={e=>setA(e.target.value)} placeholder="A" />
           <div className="w-full h-px bg-[rgba(100,200,50,0.4)]" />
           <input className="data-cell w-full border border-[rgba(100,200,50,0.2)] rounded text-center" value={b} onChange={e=>setB(e.target.value)} placeholder="B" />
        </div>
        <span>=</span>
        <div className="flex flex-col items-center gap-1 w-16">
           {mode === 'A/B=X/D' ? (
              <>
                 <div className="w-full text-center font-bold">X</div>
                 <div className="w-full h-px bg-[rgba(100,200,50,0.4)]" />
                 <input className="data-cell w-full border border-[rgba(100,200,50,0.2)] rounded text-center" value={c} onChange={e=>setC(e.target.value)} placeholder="D" />
              </>
           ) : (
              <>
                 <input className="data-cell w-full border border-[rgba(100,200,50,0.2)] rounded text-center" value={c} onChange={e=>setC(e.target.value)} placeholder="C" />
                 <div className="w-full h-px bg-[rgba(100,200,50,0.4)]" />
                 <div className="w-full text-center font-bold">X</div>
              </>
           )}
        </div>
      </div>

      <button 
        className="py-1 rounded font-bold text-[11px] mb-4"
        style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
        onClick={calculate}
      >EXECUTE</button>

      {result && (
        <div className="text-center text-xl font-bold rounded p-2 bg-[rgba(100,200,50,0.1)]">
          {result}
        </div>
      )}
    </div>
  );
}
