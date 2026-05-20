import React, { useState } from 'react';

const ROWS = 45;
const COLS = 5;

export function SpreadsheetApp() {
  const [data, setData] = useState<Record<string, string>>({});
  const [sel, setSel] = useState<[number, number]>([0, 0]);

  const setCell = (r: number, c: number, v: string) => {
    setData(prev => ({ ...prev, [`${r},${c}`]: v }));
  };

  const getCell = (r: number, c: number) => {
    return data[`${r},${c}`] || '';
  };

  // 5 cols A-E
  const colLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="flex flex-col h-full text-xs font-mono" style={{ color: 'var(--lcd-text)' }}>
      {/* Top bar */}
      <div className="flex items-center gap-2 p-1 border-b border-[rgba(100,200,50,0.1)]">
        <span className="font-bold text-[10px]" style={{ color: 'var(--lcd-dim)' }}>
          {colLabels[sel[1]]}{sel[0] + 1}
        </span>
        <input 
          className="data-cell flex-1 px-1 h-5 text-[10px]"
          value={getCell(sel[0], sel[1])}
          onChange={e => setCell(sel[0], sel[1], e.target.value)}
          placeholder="Value or formula"
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto">
        <table className="border-collapse w-full relative">
          <thead className="sticky top-0 bg-[#1a2e0a] z-10 shadow-sm border-b border-[rgba(100,200,50,0.2)]">
            <tr>
              <th className="w-6 text-[9px] text-gray-500 font-normal"></th>
              {colLabels.map(l => (
                <th key={l} className="w-12 text-[10px] font-normal" style={{ color: 'var(--lcd-dim)' }}>{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }).map((_, r) => (
              <tr key={r}>
                <td className="text-center text-[9px] text-gray-500 border-r border-[rgba(100,200,50,0.1)]">{r + 1}</td>
                {colLabels.map((_, c) => {
                  const isSel = sel[0] === r && sel[1] === c;
                  return (
                    <td key={c} 
                      className={`border border-[rgba(100,200,50,0.05)] h-5 text-right px-1 truncate max-w-[48px] ${isSel ? 'bg-[rgba(100,200,50,0.2)]' : ''}`}
                      onClick={() => setSel([r, c])}
                    >
                      {getCell(r, c)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
