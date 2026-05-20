import React, { useState } from 'react';

type BoxTool = 'dice' | 'coin';

export function MathBoxApp() {
  const [tool, setTool] = useState<BoxTool>('dice');
  const [rolls, setRolls] = useState<number[]>([]);
  const [count, setCount] = useState(1);
  const [sides, setSides] = useState(6); // for dice

  const execute = () => {
    const res = [];
    for (let i = 0; i < count; i++) {
      if (tool === 'dice') {
        res.push(Math.floor(Math.random() * sides) + 1);
      } else {
        res.push(Math.random() < 0.5 ? 1 : 0); // 1=Heads, 0=Tails
      }
    }
    setRolls(res);
  };

  const sums = rolls.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Tool picker */}
      <div className="flex gap-1 mb-2">
        {(['dice', 'coin'] as BoxTool[]).map(t => (
          <button key={t}
            className={`flex-1 py-1 rounded text-[10px] capitalize ${tool===t ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-500'}`}
            onClick={() => { setTool(t); setRolls([]); }}
          >{t === 'dice' ? 'Dice Roll' : 'Coin Toss'}</button>
        ))}
      </div>

      <div className="flex gap-2 mb-2">
        <div className="flex items-center gap-1">
           <span style={{ color: 'var(--lcd-dim)' }}>Attempts:</span>
           <input className="data-cell w-12 border border-[rgba(100,200,50,0.2)] rounded text-center" type="number" value={count} onChange={e=>setCount(Math.min(100, Math.max(1, parseInt(e.target.value)||1)))} />
        </div>
        {tool === 'dice' && (
          <div className="flex items-center gap-1">
             <span style={{ color: 'var(--lcd-dim)' }}>Sides:</span>
             <input className="data-cell w-12 border border-[rgba(100,200,50,0.2)] rounded text-center" type="number" value={sides} onChange={e=>setSides(Math.min(100, Math.max(2, parseInt(e.target.value)||6)))} />
          </div>
        )}
      </div>

      <button 
        className="py-1 rounded font-bold text-[11px] mb-2"
        style={{ background: 'rgba(100,200,50,0.2)', border: '1px solid rgba(100,200,50,0.4)', color: 'var(--lcd-text)' }}
        onClick={execute}
      >EXECUTE</button>

      {rolls.length > 0 && (
        <div className="flex-1 overflow-auto border border-[rgba(100,200,50,0.2)] rounded p-1 bg-[rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap gap-1 mb-2">
            {rolls.map((r, i) => (
              <span key={i} className="inline-flex items-center justify-center w-6 h-6 rounded bg-[rgba(100,200,50,0.1)] border border-[rgba(100,200,50,0.2)] font-bold">
                {tool === 'dice' ? r : (r === 1 ? 'H' : 'T')}
              </span>
            ))}
          </div>
          <div className="border-t border-[rgba(100,200,50,0.2)] pt-1 text-gray-400">
            {tool === 'dice' ? (
              <>Sum = <span className="text-white">{sums}</span>, Avg = <span className="text-white">{(sums/rolls.length).toFixed(2)}</span></>
            ) : (
              <>Heads = <span className="text-white">{sums}</span>, Tails = <span className="text-white">{rolls.length - sums}</span></>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
