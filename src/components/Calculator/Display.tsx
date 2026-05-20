import React, { useRef, useEffect } from 'react';
import { useCalcStore } from '../../state/useCalcStore';

// ── LCD Display with cursor and expression rendering ─────────────────────────

export function Display() {
  const { expression, result, isError, cursorPos, history } = useCalcStore();
  const exprRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression container to keep cursor visible
  useEffect(() => {
    if (exprRef.current) {
      exprRef.current.scrollLeft = exprRef.current.scrollWidth;
    }
  }, [expression, cursorPos]);

  // Build expression with blinking cursor injected at cursorPos
  const renderExpression = () => {
    if (!expression) {
      return <span className="cursor-block" />;
    }
    const before = expression.slice(0, cursorPos);
    const after = expression.slice(cursorPos);
    return (
      <>
        <span>{renderSymbols(before)}</span>
        <span className="cursor-block" />
        <span className="opacity-80">{renderSymbols(after)}</span>
      </>
    );
  };

  // Replace raw symbols with nicer Unicode display
  function renderSymbols(s: string) {
    return s
      .replace(/\*/g, '×')
      .replace(/\//g, '÷')
      .replace(/sqrt\(([^)]*)\)/g, '√($1)')
      .replace(/\*\*/g, '^');
  }

  const lastResult = history[0];

  return (
    <div className="lcd-screen rounded-lg p-3 mx-2 mb-2 min-h-[110px] flex flex-col justify-between relative z-10">
      {/* Previous answer line */}
      <div className="text-right min-h-[18px]">
        {lastResult && !expression && (
          <span className="lcd-text-dim text-xs font-mono opacity-60">
            Ans = {lastResult.result}
          </span>
        )}
      </div>

      {/* Expression input line */}
      <div
        ref={exprRef}
        className="expr-display overflow-x-auto whitespace-nowrap py-1 min-h-[28px] flex items-center"
        style={{ scrollbarWidth: 'none' }}
      >
        {renderExpression()}
      </div>

      {/* Result line */}
      <div
        className={`expr-result min-h-[32px] flex items-center justify-end transition-all duration-150 ${
          isError ? 'text-red-400' : ''
        }`}
        style={isError ? { color: '#ff6b6b', textShadow: '0 0 8px rgba(255,100,100,0.4)' } : {}}
      >
        {result && (
          <span className={`${isError ? 'text-base' : 'text-2xl'}`}>
            {result}
          </span>
        )}
      </div>
    </div>
  );
}
