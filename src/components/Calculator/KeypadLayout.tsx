import React from 'react';
import { CalcKey } from './CalcKey';
import { useCalcStore } from '../../state/useCalcStore';
import { evaluate } from '../../engine/evaluator';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

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

  const openMenu = (menu: 'home' | 'catalog' | 'format' | 'settings' | 'tools') =>
    () => store.setActiveMenu(store.activeMenu === menu ? null : menu as any);

  const insertFn = (fn: string) => () => store.insertAtCursor(fn);
  const insertStr = (s: string) => () => store.insertAtCursor(s);

  const delKey = () => store.deleteAtCursor();
  const acKey = () => store.clearExpression();

  const handleArrow = (dir: 'left' | 'right' | 'up' | 'down') => {
    const { cursorPos, expression } = store;
    if (dir === 'left') {
      store.setCursorPos(Math.max(0, cursorPos - 1));
    } else if (dir === 'right') {
      store.setCursorPos(Math.min(expression.length, cursorPos + 1));
    } else if (dir === 'up') {
      store.setCursorPos(0);
    } else if (dir === 'down') {
      store.setCursorPos(expression.length);
    }
  };

  const ansKey = () => store.insertAtCursor('Ans');

  return (
    <div className="flex flex-col gap-3 pb-2 font-sans select-none text-white">
      {/* ── SECTION 1: D-PAD & CONTROL BUTTONS ── */}
      <div className="flex justify-between items-center px-1">
        {/* Left Side Controls: ON, HOME, SETTINGS, BACK */}
        <div className="flex flex-col gap-2 w-[76px]">
          <div className="grid grid-cols-2 text-center text-[6px] font-bold text-gray-500 font-mono tracking-tighter">
            <div>ON</div>
            <div>HOME</div>
          </div>
          <div className="flex gap-2">
            {/* ON Button */}
            <button 
              onClick={acKey}
              className="w-8 h-8 rounded-full bg-[#242b35] border border-[#384352]/50 hover:bg-[#2d3642] flex items-center justify-center text-[8px] font-bold text-white shadow-md active:scale-95 transition-transform"
              title="ON"
            >
              ON
            </button>
            {/* HOME Button */}
            <button 
              onClick={openMenu('home')}
              className="w-8 h-8 rounded-full bg-[#171c24] border border-[#293240]/40 hover:bg-[#202732] flex items-center justify-center text-gray-300 shadow-md active:scale-95 transition-transform"
              title="HOME"
            >
              <span className="material-symbols-outlined text-[14px]">home</span>
            </button>
          </div>
          <div className="grid grid-cols-2 text-center text-[6px] font-bold text-gray-500 font-mono tracking-tighter">
            <div>SETTINGS</div>
            <div>BACK</div>
          </div>
          <div className="flex gap-2">
            {/* SETTINGS Button */}
            <button 
              onClick={openMenu('settings')}
              className="w-8 h-8 rounded-full bg-[#171c24] border border-[#293240]/40 hover:bg-[#202732] flex items-center justify-center text-gray-300 shadow-md active:scale-95 transition-transform"
              title="SETTINGS"
            >
              <span className="material-symbols-outlined text-[14px]">settings</span>
            </button>
            {/* BACK Button */}
            <button 
              onClick={() => store.setActiveMenu(null)}
              className="w-8 h-8 rounded-full bg-[#171c24] border border-[#293240]/40 hover:bg-[#202732] flex items-center justify-center text-gray-300 shadow-md active:scale-95 transition-transform"
              title="BACK"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

        {/* Center: Circular D-Pad */}
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-b from-[#1e2530] to-[#0d1017] border border-[#2d3848] flex items-center justify-center shadow-lg select-none">
          {/* OK button in the center */}
          <button 
            onClick={executeCalc}
            className="w-10 h-10 rounded-full bg-[#1c222b] border border-[#374558] hover:bg-[#252e3b] text-white flex items-center justify-center text-[10px] font-bold shadow-inner cursor-pointer active:scale-95 transition-transform"
          >
            OK
          </button>
          
          {/* Arrow navigation buttons */}
          <button 
            onClick={() => handleArrow('up')}
            className="absolute top-1 left-[38px] w-9 h-6 hover:text-white text-gray-400 flex items-center justify-center transition-colors"
            title="Up"
          >
            <ArrowUp size={12} />
          </button>
          <button 
            onClick={() => handleArrow('down')}
            className="absolute bottom-1 left-[38px] w-9 h-6 hover:text-white text-gray-400 flex items-center justify-center transition-colors"
            title="Down"
          >
            <ArrowDown size={12} />
          </button>
          <button 
            onClick={() => handleArrow('left')}
            className="absolute left-1 top-[38px] w-6 h-9 hover:text-white text-gray-400 flex items-center justify-center transition-colors"
            title="Left"
          >
            <ArrowLeft size={12} />
          </button>
          <button 
            onClick={() => handleArrow('right')}
            className="absolute right-1 top-[38px] w-6 h-9 hover:text-white text-gray-400 flex items-center justify-center transition-colors"
            title="Right"
          >
            <ArrowRight size={12} />
          </button>
        </div>

        {/* Right Side Controls: SHIFT, ALPHA, MENU, x Variable */}
        <div className="flex flex-col gap-2 w-[76px] items-end">
          <div className="grid grid-cols-2 text-center text-[6px] font-bold text-gray-500 font-mono tracking-tighter w-full">
            <div><span className="text-[#d97706]">π</span></div>
            <div></div>
          </div>
          <div className="flex gap-2">
            {/* SHIFT Button */}
            <button 
              onClick={() => store.toggleShift()}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-[8px] font-bold shadow-md transition-all active:scale-95 ${
                store.shiftState === 'shift'
                  ? 'bg-[#d97706] border-[#d97706] text-black shadow-[0_0_8px_rgba(217,119,6,0.5)] font-extrabold'
                  : 'bg-[#0b0f17] border-[#d97706]/60 text-[#d97706]'
              }`}
              title="SHIFT"
            >
              SHIFT
            </button>
            {/* ALPHA Button */}
            <button 
              onClick={() => store.toggleAlpha()}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-[8px] font-bold shadow-md transition-all active:scale-95 ${
                store.shiftState === 'alpha'
                  ? 'bg-[#d946ef] border-[#d946ef] text-black shadow-[0_0_8px_rgba(217,70,239,0.5)] font-extrabold'
                  : 'bg-[#0b0f17] border-[#d946ef]/60 text-[#d946ef]'
              }`}
              title="ALPHA"
            >
              ALPHA
            </button>
          </div>
          <div className="grid grid-cols-2 text-center text-[6px] font-bold text-gray-500 font-mono tracking-tighter w-full">
            <div>MENU</div>
            <div>VARIABLE</div>
          </div>
          <div className="flex gap-2">
            {/* MENU Button */}
            <button 
              onClick={openMenu('home')}
              className="w-8 h-8 rounded-full bg-[#171c24] border border-[#293240]/40 hover:bg-[#202732] flex items-center justify-center text-gray-300 shadow-md active:scale-95 transition-transform"
              title="MENU"
            >
              <span className="material-symbols-outlined text-[14px]">more_horiz</span>
            </button>
            {/* x variable Button */}
            <button 
              onClick={insertStr('x')}
              className="w-8 h-8 rounded-full bg-[#171c24] border border-[#293240]/40 hover:bg-[#202732] flex items-center justify-center text-[#d946ef] font-semibold text-xs shadow-md active:scale-95 transition-transform"
              title="x Variable"
            >
              x
            </button>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: 4 PRIMARY SYSTEM FUNCTION KEYS ── */}
      <div className="flex flex-col gap-0.5">
        <div className="grid grid-cols-4 gap-2.5 text-center text-[7px] font-bold text-gray-500 font-mono tracking-wide">
          <div>VARIABLE</div>
          <div>FUNCTION</div>
          <div>CATALOG</div>
          <div>TOOLS</div>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          <CalcKey main="x" type="fn" onPress={openMenu('catalog')} />
          <CalcKey main="f(x)" type="fn" onPress={insertFn('f(')} />
          <CalcKey main="CATALOG" type="fn" mainSize="xs" onPress={openMenu('catalog')} />
          <CalcKey main="TOOLS" type="fn" mainSize="xs" onPress={openMenu('format')} />
        </div>
      </div>

      {/* ── SECTION 3: TRIG & LOG SCIENTIFIC KEYS ── */}
      <div className="flex flex-col gap-0.5">
        <div className="grid grid-cols-6 gap-2 text-center text-[7px] font-mono leading-none">
          <div className="flex justify-center gap-1"><span className="text-[#d97706]">x!</span><span className="text-[#d946ef]">A</span></div>
          <div className="flex justify-center gap-1"><span className="text-[#d97706]">sin⁻¹</span><span className="text-[#d946ef]">B</span></div>
          <div className="flex justify-center gap-1"><span className="text-[#d97706]">cos⁻¹</span><span className="text-[#d946ef]">C</span></div>
          <div className="flex justify-center gap-1"><span className="text-[#d97706]">tan⁻¹</span><span className="text-[#d946ef]">D</span></div>
          <div className="flex justify-center gap-1"><span className="text-[#d97706]">10ˣ</span><span className="text-[#d946ef]">E</span></div>
          <div className="flex justify-center gap-1"><span className="text-[#d97706]">eˣ</span><span className="text-[#d946ef]">F</span></div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          <CalcKey main="x⁻¹" type="fn" mainSize="xs" onPress={insertFn('^(-1)')} />
          <CalcKey main="sin" type="fn" mainSize="xs" onPress={insertFn('sin(')} />
          <CalcKey main="cos" type="fn" mainSize="xs" onPress={insertFn('cos(')} />
          <CalcKey main="tan" type="fn" mainSize="xs" onPress={insertFn('tan(')} />
          <CalcKey main="log" type="fn" mainSize="xs" onPress={insertFn('log(')} />
          <CalcKey main="In" type="fn" mainSize="xs" onPress={insertFn('ln(')} />
        </div>
      </div>

      {/* ── SECTION 4: FRACTIONS & MODIFIERS ── */}
      <div className="flex flex-col gap-0.5 text-[8px]">
        <div className="grid grid-cols-8 gap-1 text-center text-[6px] font-mono leading-none">
          <div><span className="text-[#d97706]">QR</span></div>
          <div><span className="text-[#d946ef]">SOLVE</span></div>
          <div className="text-gray-500">■/□</div>
          <div><span className="text-[#d97706]">x²</span></div>
          <div><span className="text-[#d97706]">ʸ√</span></div>
          <div className="text-gray-500">a⇔b</div>
          <div><span className="text-[#d97706]">[</span><span className="text-[#d946ef]">y</span></div>
          <div><span className="text-[#d97706]">]</span><span className="text-[#d946ef]">z</span></div>
        </div>
        <div className="grid grid-cols-8 gap-1">
          <CalcKey main="OPTN" type="fn" mainSize="xs" onPress={openMenu('format')} />
          <CalcKey main="CALC" type="fn" mainSize="xs" onPress={executeCalc} />
          <CalcKey main="a/b" type="fn" mainSize="xs" onPress={insertStr('/')} />
          <CalcKey main="√" type="fn" mainSize="xs" onPress={insertFn('sqrt(')} />
          <CalcKey main="xʸ" type="fn" mainSize="xs" onPress={insertStr('^')} />
          <CalcKey main="S⇔D" type="fn" mainSize="xs" onPress={() => {}} />
          <CalcKey main="(" type="fn" mainSize="xs" onPress={insertStr('(')} />
          <CalcKey main=")" type="fn" mainSize="xs" onPress={insertStr(')')} />
        </div>
      </div>

      {/* ── SECTION 5: NUMERICAL KEYPAD GRID ── */}
      <div className="flex flex-col gap-1.5 mt-1">
        {/* Row 1 Grid & Labels */}
        <div className="flex flex-col gap-0.5">
          <div className="grid grid-cols-5 gap-2 text-center text-[7px] font-mono leading-none">
            <div><span className="text-[#d97706]">CONST</span></div>
            <div><span className="text-[#d97706]">CONV</span></div>
            <div><span className="text-[#d97706]">RESET</span></div>
            <div></div>
            <div><span className="text-[#d97706]">OFF</span></div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <CalcKey main="7" type="num" />
            <CalcKey main="8" type="num" />
            <CalcKey main="9" type="num" />
            <CalcKey main="DEL" type="del" onPress={delKey} />
            <CalcKey main="AC" type="del" onPress={acKey} />
          </div>
        </div>

        {/* Row 2 Grid & Labels */}
        <div className="flex flex-col gap-0.5">
          <div className="grid grid-cols-5 gap-2 text-center text-[7px] font-mono leading-none">
            <div><span className="text-[#d97706]">nPr</span></div>
            <div><span className="text-[#d97706]">nCr</span></div>
            <div><span className="text-[#d97706]">Rec</span></div>
            <div></div>
            <div></div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <CalcKey main="4" type="num" />
            <CalcKey main="5" type="num" />
            <CalcKey main="6" type="num" />
            <CalcKey main="×" type="op" onPress={insertStr('*')} />
            <CalcKey main="÷" type="op" onPress={insertStr('/')} />
          </div>
        </div>

        {/* Row 3 Grid & Labels */}
        <div className="flex flex-col gap-0.5">
          <div className="grid grid-cols-5 gap-2 text-center text-[7px] font-mono leading-none">
            <div><span className="text-[#d97706]">Pol</span></div>
            <div><span className="text-[#d97706]">° ' "</span></div>
            <div><span className="text-[#d97706]">∠</span></div>
            <div></div>
            <div></div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <CalcKey main="1" type="num" />
            <CalcKey main="2" type="num" />
            <CalcKey main="3" type="num" />
            <CalcKey main="+" type="op" onPress={insertStr('+')} />
            <CalcKey main="−" type="op" onPress={insertStr('-')} />
          </div>
        </div>

        {/* Row 4 Grid & Labels */}
        <div className="flex flex-col gap-0.5">
          <div className="grid grid-cols-5 gap-2 text-center text-[7px] font-mono leading-none">
            <div><span className="text-[#d97706]">Rnd</span></div>
            <div><span className="text-[#d97706]">Ran#</span></div>
            <div className="flex justify-center gap-1"><span className="text-[#d97706]">π</span><span className="text-[#d946ef]">e</span></div>
            <div><span className="text-[#d97706]">PreAns</span></div>
            <div></div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <CalcKey main="0" type="num" />
            <CalcKey main="." type="num" />
            <CalcKey main="×10ˣ" type="num" onPress={insertFn('*10^(')} />
            <CalcKey main="Ans" type="num" onPress={ansKey} />
            <CalcKey main="=" type="exe" onPress={executeCalc} />
          </div>
        </div>
      </div>
    </div>
  );
}
