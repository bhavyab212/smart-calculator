import { useEffect } from 'react';
import { useCalcStore } from '../state/useCalcStore';
import { evaluate } from '../engine/evaluator';

// ── Global keyboard handler ───────────────────────────────────────────────────

export function useKeyboard() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const store = useCalcStore.getState();
      const { key, shiftKey, ctrlKey, altKey } = e;

      switch (key) {
        case 'Escape':
          e.preventDefault();
          if (store.activeMenu) { store.setActiveMenu(null); return; }
          store.clearExpression();
          return;
        case 'Enter':
          e.preventDefault();
          if (store.activeApp === 'calculate') handleExecute();
          return;
        case 'Backspace':
          e.preventDefault();
          store.deleteAtCursor();
          return;
        case 'Delete':
          e.preventDefault();
          store.clearExpression();
          return;
        case 'ArrowLeft':
          e.preventDefault();
          store.setCursorPos(Math.max(0, store.cursorPos - 1));
          return;
        case 'ArrowRight':
          e.preventDefault();
          store.setCursorPos(Math.min(store.expression.length, store.cursorPos + 1));
          return;
        case 'ArrowUp':
          e.preventDefault();
          navigateHistory(-1);
          return;
        case 'ArrowDown':
          e.preventDefault();
          navigateHistory(1);
          return;
      }

      if (key === 'Shift' && !e.repeat) { store.toggleShift(); return; }

      if (!ctrlKey && !altKey) {
        const mapped = mapKey(key, shiftKey, store.shiftState);
        if (mapped) {
          e.preventDefault();
          if (mapped === '__HOME__') { store.setActiveMenu('home'); return; }
          if (mapped === '__CATALOG__') { store.setActiveMenu('catalog'); return; }
          if (mapped === '__FORMAT__') { store.setActiveMenu('format'); return; }
          if (mapped === '__SETTINGS__') { store.setActiveMenu('settings'); return; }
          store.insertAtCursor(mapped);
          if (store.shiftState !== 'none') store.setShiftState('none');
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []); // empty deps — always reads fresh via getState()
}

function navigateHistory(dir: -1 | 1) {
  const { history, historyIndex, setHistoryIndex, setExpression } = useCalcStore.getState();
  if (history.length === 0) return;
  const newIdx = Math.max(-1, Math.min(history.length - 1, historyIndex + dir));
  setHistoryIndex(newIdx);
  setExpression(newIdx >= 0 ? history[newIdx].expression : '');
}

function handleExecute() {
  const store = useCalcStore.getState();
  const { expression, angleUnit, variables, ans, preAns, displayFormat, fixDigits } = store;
  if (!expression.trim()) return;

  const result = evaluate(expression, { angleUnit, variables, ans, preAns, displayFormat, fixDigits });
  store.setResult(result.display);
  store.setIsError(result.isError);
  if (!result.isError) {
    const numVal = typeof result.value === 'number' ? result.value : 0;
    store.setAns(numVal);
    store.addToHistory(expression, result.display);
  }
}

function mapKey(key: string, shiftKey: boolean, shiftState: string): string | null {
  // Number keys
  if (/^[0-9]$/.test(key)) return key;
  if (key === '.') return '.';

  // Operators
  const opMap: Record<string, string> = {
    '+': '+', '-': '-', '*': '×', '/': '÷',
    '(': '(', ')': ')',
    '%': '%',
  };
  if (opMap[key]) return opMap[key];

  // Function shortcuts (no modifiers)
  const fnMap: Record<string, string> = {
    'h': '__HOME__',
    'c': '__CATALOG__',
    'f': '__FORMAT__',
  };
  if (fnMap[key] && !shiftKey) return fnMap[key];

  return null;
}
