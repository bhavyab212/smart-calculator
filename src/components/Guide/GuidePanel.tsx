import React from 'react';
import { useCalcStore, AppMode } from '../../state/useCalcStore';

interface AppHelp {
  title: string;
  description: string;
  steps: string[];
}

const APP_HELP_MAP: Record<AppMode, AppHelp> = {
  calculate: {
    title: 'Calculate App',
    description: 'Perform basic arithmetic operations, trigonometric functions, logs, roots, and percent calculations.',
    steps: [
      'Enter mathematical expressions using the keypad or your physical keyboard.',
      'Use the SHIFT key (or press S) to access gold functions like sin⁻¹, 10^x, and square root derivatives.',
      'Use the ALPHA key (or press A) to input variables (A-F, x, y, z) into equations.',
      'Press EXE (or Enter) to compute results. Results are stored in the Ans variable automatically.'
    ]
  },
  statistics: {
    title: 'Statistics App',
    description: 'Calculate 1-variable or 2-variable statistics including mean, standard deviation, and regression analysis.',
    steps: [
      'Enter the app, define your statistical lists (X, Y, and frequencies).',
      'Use the editor interface to fill in table values.',
      'Press EXE after inputting values to save them into the current active cell.',
      'Press OPTN (or Option) to open statistical calculations and view regression results.'
    ]
  },
  distribution: {
    title: 'Distribution App',
    description: 'Work with Normal, Binomial, and Poisson probability distributions.',
    steps: [
      'Choose the distribution type (e.g., Normal CD, Binomial PD).',
      'Select single variable or list calculation.',
      'Provide your mean (μ), standard deviation (σ), and x value, then press EXE.',
      'The calculated probability values will render directly on the display.'
    ]
  },
  spreadsheet: {
    title: 'Spreadsheet App',
    description: 'Perform cell-based computations with formulas, relative references, and automatic fill.',
    steps: [
      'Select a cell (A1 to E45) using the D-pad navigation keys.',
      'Type values or enter formulas starting with "=" (e.g., "=A1+B1").',
      'Press OPTN to trigger batch fills, formula insertions, or sheet options.',
      'Press EXE to recalculate all cells automatically.'
    ]
  },
  table: {
    title: 'Table App',
    description: 'Generate function tables based on one or two active equations (f(x) and g(x)).',
    steps: [
      'Input the equation for f(x) (using x as variable, input via ALPHA + ) key).',
      'Input the equation for g(x) if needed, or leave it blank.',
      'Set Table Range: Start, End, and Step size (e.g., Start: 1, End: 10, Step: 0.5).',
      'Press EXE to render the dynamic values table.'
    ]
  },
  equation: {
    title: 'Equation App',
    description: 'Solve simultaneous linear equations (2 to 4 unknowns) or polynomial equations (degrees 2 to 4).',
    steps: [
      'Select "Simul Equation" or "Polynomial".',
      'Select number of unknowns (2-4) or polynomial degree (2-4).',
      'Enter coefficients (a, b, c, etc.) into the matrix input grid.',
      'Press EXE to compute the solutions (x, y, z, etc.).'
    ]
  },
  inequality: {
    title: 'Inequality App',
    description: 'Solve polynomial inequalities from degree 2 to degree 4.',
    steps: [
      'Select the polynomial degree (2-4).',
      'Choose the inequality sign configuration (e.g., ax² + bx + c > 0).',
      'Input the coefficients and press EXE.',
      'View the computed ranges of x that satisfy the inequality.'
    ]
  },
  complex: {
    title: 'Complex App',
    description: 'Perform calculations involving complex numbers in rectangular (a+bi) or polar (r∠θ) form.',
    steps: [
      'Input numbers using "i" (activated via Shift or keys).',
      'Select rectangular or polar output in settings.',
      'Calculate sums, products, conjugates, and arguments of complex coordinates.',
      'Press EXE to evaluate.'
    ]
  },
  'base-n': {
    title: 'Base-N App',
    description: 'Perform binary, octal, decimal, and hexadecimal arithmetic operations and logical gates.',
    steps: [
      'Use the keys to switch base systems (DEC, HEX, BIN, OCT).',
      'Input values matching the active base (non-matching digits will be disabled).',
      'Use logical functions like AND, OR, XOR, NOT, and NEG.',
      'Evaluate calculations to see automated cross-base results.'
    ]
  },
  matrix: {
    title: 'Matrix App',
    description: 'Define and compute with matrices up to 4x4, including determinants, inverses, and matrix products.',
    steps: [
      'Press OPTN to define matrices (MatA, MatB, MatC).',
      'Provide matrix dimensions and input cell values.',
      'Write expressions in the display (e.g., "MatA × MatB" or "det(MatA)").',
      'Press EXE to compute the result matrix.'
    ]
  },
  vector: {
    title: 'Vector App',
    description: 'Create 2D/3D vectors and compute dot products, cross products, angles, and unit vectors.',
    steps: [
      'Press OPTN to define vectors (VctA, VctB, VctC).',
      'Provide dimension details and enter vectors.',
      'Construct calculation expressions (e.g., "VctA • VctB" or "VctA × VctB").',
      'Press EXE to output calculated vectors or scalars.'
    ]
  },
  ratio: {
    title: 'Ratio App',
    description: 'Solve ratio problems in forms like a:b = x:d or a:b = c:x.',
    steps: [
      'Select the form of ratio to solve.',
      'Input the known values (a, b, c, d).',
      'Press EXE to compute the unknown variable x.'
    ]
  },
  mathbox: {
    title: 'Math Box App',
    description: 'Explore mathematical concepts: dice rolling, coin tossing, number lines, and circle angles.',
    steps: [
      'Select the concept (e.g. Dice Roll, Coin Toss).',
      'Configure the parameters (e.g. number of rolls, number of coins).',
      'Press EXE to run simulations.',
      'View summary data, distributions, and probability stats.'
    ]
  }
};

export function GuidePanel() {
  const { activeApp, variables, ans, preAns } = useCalcStore();
  const activeHelp = APP_HELP_MAP[activeApp] || APP_HELP_MAP.calculate;

  return (
    <div className="w-full max-w-[400px] h-[640px] bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-6 shadow-2xl overflow-y-auto flex flex-col gap-6 text-on-background select-none">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-4">
        <h2 className="font-display-input text-[22px] font-bold text-primary-fixed tracking-tight flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-fixed">menu_book</span>
          Calculator Guide
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">Interactive User Manual & Monitor</p>
      </div>

      {/* App Instructions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-primary-fixed-dim font-bold font-display-result text-[16px]">
          <span className="material-symbols-outlined text-[18px]">info</span>
          {activeHelp.title}
        </div>
        <p className="text-xs text-on-background opacity-80 leading-relaxed">
          {activeHelp.description}
        </p>
        <ul className="flex flex-col gap-2 pl-4 list-disc text-[11px] text-on-surface-variant leading-relaxed">
          {activeHelp.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>

      {/* Active Variables & Memory */}
      <div className="flex flex-col gap-3 border-t border-outline-variant/20 pt-4">
        <div className="flex items-center gap-2 text-primary-fixed-dim font-bold font-display-result text-[16px]">
          <span className="material-symbols-outlined text-[18px]">database</span>
          Memory & Variables
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {Object.entries(variables).map(([name, val]) => (
            <div key={name} className="bg-surface-container-high/40 rounded-lg p-2 border border-outline-variant/25">
              <div className="text-[10px] text-primary-fixed font-bold">{name}</div>
              <div className="text-[11px] font-mono text-white mt-0.5 truncate" title={String(val)}>
                {typeof val === 'number' ? Number(val.toFixed(6)) : val}
              </div>
            </div>
          ))}
          <div className="bg-surface-container-high/40 rounded-lg p-2 border border-outline-variant/25 col-span-2">
            <div className="text-[10px] text-[#bf00ff] font-bold">Ans</div>
            <div className="text-[11px] font-mono text-white mt-0.5 truncate" title={String(ans)}>
              {Number(ans.toFixed(6))}
            </div>
          </div>
          <div className="bg-surface-container-high/40 rounded-lg p-2 border border-outline-variant/25 col-span-2">
            <div className="text-[10px] text-[#4fdbc8] font-bold">PreAns</div>
            <div className="text-[11px] font-mono text-white mt-0.5 truncate" title={String(preAns)}>
              {Number(preAns.toFixed(6))}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="flex flex-col gap-3 border-t border-outline-variant/20 pt-4">
        <div className="flex items-center gap-2 text-primary-fixed-dim font-bold font-display-result text-[16px]">
          <span className="material-symbols-outlined text-[18px]">keyboard</span>
          Keyboard Shortcuts
        </div>
        <div className="flex flex-col gap-1.5 text-[11px] text-on-surface-variant">
          <div className="flex justify-between border-b border-outline-variant/10 pb-1">
            <span>Numbers & Operators</span>
            <span className="font-mono text-white">0-9, +, -, *, /</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/10 pb-1">
            <span>Calculate/Execute</span>
            <span className="font-mono text-white">Enter</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/10 pb-1">
            <span>Delete Digit</span>
            <span className="font-mono text-white">Backspace</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/10 pb-1">
            <span>Clear / AC</span>
            <span className="font-mono text-white">Escape</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/10 pb-1">
            <span>SHIFT / ALPHA Toggle</span>
            <span className="font-mono text-white">s / a</span>
          </div>
          <div className="flex justify-between border-b border-outline-variant/10 pb-1">
            <span>Trigonometry (sin, cos, tan)</span>
            <span className="font-mono text-white">d, f, g</span>
          </div>
          <div className="flex justify-between pb-1">
            <span>Logarithm (log, ln, sqrt)</span>
            <span className="font-mono text-white">l, n, r</span>
          </div>
        </div>
      </div>
    </div>
  );
}
