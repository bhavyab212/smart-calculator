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
    <div className="w-full flex flex-col justify-end">
      {/* Previous answer line */}
      <div className="text-right min-h-[18px]">
        {lastResult && !expression && (
          <span className="font-display-input text-xs text-primary-fixed-dim opacity-60">
            Ans = {lastResult.result}
          </span>
        )}
      </div>

      {/* Expression input line */}
      <div
        ref={exprRef}
        className="font-display-input text-[28px] leading-none mb-4 lcd-glow text-primary-fixed tracking-tight overflow-x-auto whitespace-nowrap py-1 min-h-[36px] flex items-center"
        style={{ scrollbarWidth: 'none' }}
      >
        {renderExpression()}
      </div>

      {/* Result line */}
      <div
        className={`font-display-result text-[36px] font-medium tracking-tight min-h-[40px] flex items-center justify-end transition-all duration-150 ${
          isError ? 'text-error lcd-glow' : 'text-primary lcd-glow'
        }`}
      >
        {result && (
          <span>
            {result}
          </span>
        )}
      </div>
    </div>
  );
}
