import React from 'react';
import { CalcKey } from './CalcKey';
import { useCalcStore } from '../../state/useCalcStore';
import { evaluate } from '../../engine/evaluator';

// ── Full FX-991CW Keypad Layout ───────────────────────────────────────────────
// 5 rows of function keys + 5 rows of main keys
// Each row is a flex container with gap

export function KeypadLayout() {
  const store = useCalcStore();

  // ── Actions ──────────────────────────────────────────────────────────────────

  const executeCalc = () => {
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
  };

  const openMenu = (menu: 'home' | 'catalog' | 'format' | 'settings') =>
    () => store.setActiveMenu(menu);

  const insertFn = (fn: string) => () => store.insertAtCursor(fn);
  const insertStr = (s: string) => () => store.insertAtCursor(s);

  const toggleAngle = () => {
    const units = ['DEG', 'RAD', 'GRAD'] as const;
    const idx = units.indexOf(store.angleUnit);
    store.setAngleUnit(units[(idx + 1) % 3]);
  };

  const memStore = () => {
    const val = parseFloat(store.result) || 0;
    store.setMemory(val);
    store.setVariable('M', val);
  };
  const memRecall = () => store.insertAtCursor('M');
  const memPlus = () => {
    const val = parseFloat(store.result) || 0;
    store.memoryAdd(val);
  };
  const memMinus = () => {
    const val = parseFloat(store.result) || 0;
    store.memorySub(val);
  };

  const ansKey = () => store.insertAtCursor('Ans');
  const preAnsKey = () => store.insertAtCursor('PreAns');

  const delKey = () => store.deleteAtCursor();
  const acKey = () => store.clearExpression();

  // ── Key Row helper ───────────────────────────────────────────────────────────
  const row = (keys: React.ReactNode) => (
    <div className="flex gap-3">{keys}</div>
  );

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* ── ROW 1: Special / Menu row ── */}
      {row(<>
        <CalcKey main="MENU" type="system" mainSize="xs" onPress={openMenu('home')} />
        <CalcKey main="TOOLS" type="system" mainSize="xs" onPress={openMenu('settings')} />
        <CalcKey main="CAT" type="fn" shift="i" alpha="A" mainSize="xs" onPress={openMenu('catalog')} />
        <CalcKey main="CALC" type="fn" shift="∫dx" alpha="B" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('∫(') : undefined} />
        <CalcKey main="d/dx" type="fn" shift="Σ" alpha="C" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('Σ(') : insertFn('d/dx(')} />
        <CalcKey main="OPTN" type="fn" mainSize="xs" onPress={openMenu('format')} />
      </>)}

      {/* ── ROW 2: Trig / Hyp row ── */}
      {row(<>
        <CalcKey main="sin" type="fn" shift="sin⁻¹" alpha="D" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('asin(') : insertFn('sin(')} />
        <CalcKey main="cos" type="fn" shift="cos⁻¹" alpha="E" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('acos(') : insertFn('cos(')} />
        <CalcKey main="tan" type="fn" shift="tan⁻¹" alpha="F" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('atan(') : insertFn('tan(')} />
        <CalcKey main="ANGLE" type="system" mainSize="xs" onPress={toggleAngle} />
        <CalcKey main="hyp" type="fn" shift="π" alpha="G" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('π') : insertFn('sinh(')} />
        <CalcKey main="%" type="fn" shift="e" alpha="H" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('e') : insertStr('%')} />
      </>)}

      {/* ── ROW 3: Log / Exp row ── */}
      {row(<>
        <CalcKey main="log" type="fn" shift="10^x" alpha="I" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('10^(') : insertFn('log(')} />
        <CalcKey main="ln" type="fn" shift="e^x" alpha="J" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('exp(') : insertFn('ln(')} />
        <CalcKey main="√" type="fn" shift="x²" alpha="K" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('^2') : insertFn('sqrt(')} />
        <CalcKey main="x^y" type="fn" shift="ˣ√" alpha="L" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('nthRoot(') : insertStr('^')} />
        <CalcKey main="x⁻¹" type="fn" shift="x!" alpha="M" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('!') : insertFn('^(-1)')} />
        <CalcKey main="FRAC" type="fn" shift="a b/c" alpha="N" mainSize="xs"
          onPress={insertFn('(')} />
      </>)}

      {/* ── ROW 4: Memory / Stat row ── */}
      {row(<>
        <CalcKey main="STO→" type="fn" shift="RCL" alpha="O" mainSize="xs"
          onPress={store.shiftState === 'shift' ? memRecall : memStore} />
        <CalcKey main="M+" type="fn" shift="M-" alpha="P" mainSize="xs"
          onPress={store.shiftState === 'shift' ? memMinus : memPlus} />
        <CalcKey main="nPr" type="fn" shift="nCr" alpha="Q" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn(' nCr ') : insertFn(' nPr ')} />
        <CalcKey main="Pol" type="fn" shift="Rec" alpha="R" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('Rec(') : insertFn('Pol(')} />
        <CalcKey main="GCD" type="fn" shift="LCM" alpha="S" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('lcm(') : insertFn('gcd(')} />
        <CalcKey main="Rnd" type="fn" shift="Ran#" alpha="T" mainSize="xs"
          onPress={store.shiftState === 'shift' ? insertFn('Ran#') : insertFn('round(')} />
      </>)}

      {/* ── ROW 5: SHIFT / ALPHA / Control ── */}
      {row(<>
        <CalcKey main="SHIFT" type="shift" mainSize="xs"
          onPress={() => store.toggleShift()} />
        <CalcKey main="ALPHA" type="alpha" mainSize="xs"
          onPress={() => store.toggleAlpha()} />
        <CalcKey main="←" type="system" mainSize="sm"
          onPress={() => store.setCursorPos(Math.max(0, store.cursorPos - 1))} />
        <CalcKey main="→" type="system" mainSize="sm"
          onPress={() => store.setCursorPos(Math.min(store.expression.length, store.cursorPos + 1))} />
        <CalcKey main="DEL" type="del" mainSize="xs" onPress={delKey} />
        <CalcKey main="AC" type="del" shift="OFF" mainSize="xs" onPress={acKey} />
      </>)}

      {/* ── ROW 6: Number row 7–8–9 + Operators ── */}
      {row(<>
        <CalcKey main="7" type="num" shift="[" alpha="U" />
        <CalcKey main="8" type="num" shift="]" alpha="V" />
        <CalcKey main="9" type="num" shift="{" alpha="W" />
        <CalcKey main="DEL" type="del" mainSize="xs" onPress={delKey} />
        <CalcKey main="Ans" type="fn" shift="PreAns" mainSize="xs"
          onPress={store.shiftState === 'shift' ? preAnsKey : ansKey} />
      </>)}

      {/* ── ROW 7: Number row 4–5–6 + Operators ── */}
      {row(<>
        <CalcKey main="4" type="num" shift=";" alpha="X" />
        <CalcKey main="5" type="num" shift="'" alpha="Y" />
        <CalcKey main="6" type="num" shift='"' alpha="Z" />
        <CalcKey main="×" type="op" onPress={insertStr('*')} />
        <CalcKey main="÷" type="op" onPress={insertStr('/')} />
      </>)}

      {/* ── ROW 8: Number row 1–2–3 + Operators ── */}
      {row(<>
        <CalcKey main="1" type="num" shift="→" alpha=":" />
        <CalcKey main="2" type="num" shift="°" alpha=";" />
        <CalcKey main="3" type="num" shift="∠" alpha="=" />
        <CalcKey main="+" type="op" />
        <CalcKey main="−" type="op" onPress={insertStr('-')} />
      </>)}

      {/* ── ROW 9: 0 / . / EXP / EXE ── */}
      {row(<>
        <CalcKey main="0" type="num" shift="∞" alpha=" " />
        <CalcKey main="." type="num" shift="," />
        <CalcKey main="×10^" type="fn" mainSize="xs" onPress={insertFn('*10^(')} />
        <CalcKey main="(" type="op" shift="[" />
        <CalcKey main=")" type="op" shift="]" />
        <CalcKey main="EXE" type="exe" mainSize="xs" tall onPress={executeCalc} wide />
      </>)}
    </div>
  );
}
