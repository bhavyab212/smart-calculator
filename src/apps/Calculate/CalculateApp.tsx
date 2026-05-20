import React, { useEffect, useRef } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { evaluate } from '../../engine/evaluator';

// ── Calculate App ─────────────────────────────────────────────────────────────

export function CalculateApp() {
  return (
    <div className="flex-1 text-sm" style={{ color: 'var(--lcd-dim)' }}>
      {/* Nothing extra — the shared Display + Keypad handle everything */}
      {/* This component holds the history panel visible in the LCD area */}
      <HistoryPanel />
    </div>
  );
}

function HistoryPanel() {
  const { history, setExpression, setResult, setIsError, ans } = useCalcStore();
  const listRef = useRef<HTMLDivElement>(null);

  if (history.length === 0) return null;

  const handleRecall = (entry: typeof history[number]) => {
    setExpression(entry.expression);
    setResult(entry.result);
    setIsError(false);
  };

  return (
    <div
      ref={listRef}
      className="max-h-[80px] overflow-y-auto px-2"
      style={{ scrollbarWidth: 'thin' }}
    >
      {history.slice(0, 5).map((h, i) => (
        <div
          key={h.timestamp + i}
          className="flex justify-between items-baseline py-0.5 cursor-pointer group"
          onClick={() => handleRecall(h)}
          title="Tap to recall"
        >
          <span
            className="font-mono text-[10px] truncate max-w-[55%] group-hover:opacity-80"
            style={{ color: 'var(--lcd-dim)' }}
          >
            {h.expression}
          </span>
          <span
            className="font-mono text-xs font-bold ml-2 group-hover:opacity-80"
            style={{ color: i === 0 ? 'var(--lcd-text)' : 'var(--lcd-dim)' }}
          >
            {h.result}
          </span>
        </div>
      ))}
    </div>
  );
}
