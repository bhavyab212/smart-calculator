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
    <div className="w-full flex flex-col justify-end select-none font-sans">
      {/* Previous answer line */}
      <div className="text-right min-h-[16px] text-[10px] text-[#4b5e4d]/80 font-mono">
        {lastResult && !expression && (
          <span>
            Ans = {lastResult.result}
          </span>
        )}
      </div>

      {/* Expression input line */}
      <div
        ref={exprRef}
        className="font-mono text-lg font-bold leading-none mb-3 text-[#121c12] tracking-wide overflow-x-auto whitespace-nowrap py-1 min-h-[28px] flex items-center"
        style={{ scrollbarWidth: 'none' }}
      >
        {renderExpression()}
      </div>

      {/* Result line */}
      <div
        className={`font-mono text-2xl font-bold tracking-wide min-h-[36px] flex items-center justify-end transition-all duration-150 text-[#121c12]`}
      >
        {result && (
          <span>
            {result}
          </span>
        )}
      </div>

      {/* LCD Bottom Soft Keys */}
      <div className="grid grid-cols-4 gap-1.5 mt-3 pt-1 border-t border-[#4b5e4d]/20 text-[9px] font-bold text-white tracking-wider select-none font-mono">
        <div className="bg-[#121c12] rounded px-1 py-0.5 text-center text-gray-300">JUMP</div>
        <div className="bg-[#121c12] rounded px-1 py-0.5 text-center text-gray-300">DELETE</div>
        <div className="bg-[#121c12] rounded px-1 py-0.5 text-center text-gray-300">MAT/VCT</div>
        <div className="bg-[#121c12] rounded px-1 py-0.5 text-center text-gray-300">MATH</div>
      </div>
    </div>
  );
}
