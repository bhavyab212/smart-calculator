import React, { useState } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { toAllBases, fromBase, bitwiseArithmetic } from '../../engine/math/baseN';

type BaseType = 2 | 8 | 10 | 16;
type BitOp = 'AND' | 'OR' | 'XOR' | 'XNOR' | 'XAND';

export function BaseNApp() {
  const { baseNMode, setBaseNMode } = useCalcStore();
  const [input, setInput] = useState('');
  const [val, setVal] = useState(0);
  const [op, setOp] = useState<BitOp | null>(null);
  const [operand, setOperand] = useState(0);

  const bases: { b: BaseType; label: string }[] = [
    { b: 10, label: 'DEC' },
    { b: 16, label: 'HEX' },
    { b: 2,  label: 'BIN' },
    { b: 8,  label: 'OCT' },
  ];

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.toUpperCase();
    // Validate based on mode
    let valid = true;
    if (baseNMode === 2) valid = /^[01-]*$/.test(v);
    else if (baseNMode === 8) valid = /^[0-7-]*$/.test(v);
    else if (baseNMode === 10) valid = /^[0-9-]*$/.test(v);
    else if (baseNMode === 16) valid = /^[0-9A-F-]*$/.test(v);
    
    if (valid || v === '') {
      setInput(v);
      try {
        const n = v ? fromBase(v, baseNMode) : 0;
        setVal(n);
      } catch {}
    }
  };

  const executeOp = () => {
    if (op) {
      const res = bitwiseArithmetic(operand, val, op);
      setVal(res);
      setInput(Math.abs(res).toString(baseNMode).toUpperCase());
      if (res < 0) setInput('-' + Math.abs(res).toString(baseNMode).toUpperCase());
      setOp(null);
    }
  };

  const selectOp = (o: BitOp) => {
    setOp(o);
    setOperand(val);
    setInput('');
  };

  const negate = () => {
    const res = -val; // Use simple negation instead of bitwiseNeg to avoid 32-bit truncation if user just wants minus
    setVal(res);
    setInput(Math.abs(res).toString(baseNMode).toUpperCase());
    if (res < 0) setInput('-' + Math.abs(res).toString(baseNMode).toUpperCase());
  };
  
  const notOp = () => {
    const res = ~val;
    setVal(res);
    setInput(Math.abs(res).toString(baseNMode).toUpperCase());
    if (res < 0) setInput('-' + Math.abs(res).toString(baseNMode).toUpperCase());
  }

  const allBases = toAllBases(val);

  return (
    <div className="flex flex-col h-full text-xs font-mono p-1" style={{ color: 'var(--lcd-text)' }}>
      {/* Base picker */}
      <div className="flex gap-1 mb-2">
        {bases.map(({ b, label }) => (
          <button key={b}
            className={`flex-1 py-0.5 rounded text-[10px] font-bold transition-colors ${baseNMode === b ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)] text-[var(--lcd-text)]' : 'text-gray-500 hover:text-gray-400'}`}
            onClick={() => {
              setBaseNMode(b);
              setInput(val < 0 ? '-' + Math.abs(val).toString(b).toUpperCase() : val.toString(b).toUpperCase());
            }}>{label}</button>
        ))}
      </div>

      {/* Bitwise operations */}
      <div className="flex flex-wrap gap-0.5 mb-2">
        {(['AND', 'OR', 'XOR', 'XNOR', 'XAND'] as BitOp[]).map(o => (
          <button key={o}
            className={`px-1 py-0.5 rounded text-[9px] ${op===o ? 'bg-[rgba(100,200,50,0.25)] border border-[rgba(100,200,50,0.4)]' : 'text-gray-600 hover:text-gray-400'}`}
            onClick={() => selectOp(o)}>{o}</button>
        ))}
        <button className="px-1 py-0.5 rounded text-[9px] text-gray-600 hover:text-gray-400" onClick={notOp}>Not</button>
        <button className="px-1 py-0.5 rounded text-[9px] text-gray-600 hover:text-gray-400" onClick={negate}>Neg</button>
      </div>

      {/* Input / Display */}
      <div className="flex items-center gap-1 mb-2">
        <span className="w-8 text-right font-bold" style={{ color: 'var(--lcd-dim)' }}>
          {baseNMode===10?'DEC':baseNMode===16?'HEX':baseNMode===2?'BIN':'OCT'}
        </span>
        <input
          className="data-cell flex-1 border border-[rgba(100,200,50,0.2)] rounded px-1 text-right text-sm"
          value={input}
          onChange={handleInput}
          placeholder="0"
        />
        {op && (
          <button className="px-2 py-0.5 rounded text-[10px] font-bold bg-[rgba(100,200,50,0.2)]" onClick={executeOp}>=</button>
        )}
      </div>

      {/* All bases readout */}
      <div className="flex-1 bg-[rgba(0,0,0,0.2)] rounded p-1 space-y-0.5">
        <div className="flex"><span className="w-8 text-[10px] text-gray-500">DEC</span><span className="flex-1 text-right truncate">{allBases.dec}</span></div>
        <div className="flex"><span className="w-8 text-[10px] text-gray-500">HEX</span><span className="flex-1 text-right truncate">{allBases.hex}</span></div>
        <div className="flex"><span className="w-8 text-[10px] text-gray-500">BIN</span><span className="flex-1 text-right truncate text-[9px]">{allBases.bin}</span></div>
        <div className="flex"><span className="w-8 text-[10px] text-gray-500">OCT</span><span className="flex-1 text-right truncate">{allBases.oct}</span></div>
      </div>
    </div>
  );
}
