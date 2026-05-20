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
    <div className="w-full h-full max-h-[800px] glass-panel rounded-xl flex flex-col text-[#d7e3fa] select-none border border-[rgba(0,242,255,0.15)] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#3a494b] bg-gradient-to-r from-[rgba(0,242,255,0.05)] to-transparent">
        <h2 className="font-sans text-[20px] font-bold text-[#00f2ff] tracking-wide flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00f2ff]">menu_book</span>
          Astra Guide
        </h2>
        <p className="text-xs text-[#b9cacb] mt-1">Interactive User Manual</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* App Instructions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#00f2ff] font-bold text-[15px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">info</span>
            {activeHelp.title}
          </div>
          <p className="text-[13px] text-[#d7e3fa] opacity-80 leading-relaxed font-sans">
            {activeHelp.description}
          </p>
          <ul className="flex flex-col gap-2 pl-4 list-disc text-[12px] text-[#b9cacb] leading-relaxed font-sans">
            {activeHelp.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="flex flex-col gap-3 border-t border-[#3a494b] pt-5">
          <div className="flex items-center gap-2 text-[#bc13fe] font-bold text-[15px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">keyboard</span>
            Keyboard Shortcuts
          </div>
          <div className="flex flex-col gap-2 text-[12px] text-[#b9cacb]">
            <div className="flex justify-between border-b border-[#3a494b]/30 pb-1.5">
              <span>Numbers & Operators</span>
              <span className="font-mono text-[#e1fdff] bg-[rgba(0,242,255,0.05)] px-1.5 rounded">0-9, +, -, *, /</span>
            </div>
            <div className="flex justify-between border-b border-[#3a494b]/30 pb-1.5">
              <span>Calculate/Execute</span>
              <span className="font-mono text-[#e1fdff] bg-[rgba(0,242,255,0.05)] px-1.5 rounded">Enter</span>
            </div>
            <div className="flex justify-between border-b border-[#3a494b]/30 pb-1.5">
              <span>Delete Digit</span>
              <span className="font-mono text-[#e1fdff] bg-[rgba(0,242,255,0.05)] px-1.5 rounded">Backspace</span>
            </div>
            <div className="flex justify-between border-b border-[#3a494b]/30 pb-1.5">
              <span>Clear / AC</span>
              <span className="font-mono text-[#e1fdff] bg-[rgba(0,242,255,0.05)] px-1.5 rounded">Escape</span>
            </div>
            <div className="flex justify-between border-b border-[#3a494b]/30 pb-1.5">
              <span>SHIFT / ALPHA Toggle</span>
              <span className="font-mono text-[#bc13fe] bg-[rgba(188,19,254,0.05)] px-1.5 rounded">s / a</span>
            </div>
            <div className="flex justify-between border-b border-[#3a494b]/30 pb-1.5">
              <span>Trig (sin, cos, tan)</span>
              <span className="font-mono text-[#e1fdff] bg-[rgba(0,242,255,0.05)] px-1.5 rounded">d, f, g</span>
            </div>
            <div className="flex justify-between pb-1.5">
              <span>Log (log, ln, sqrt)</span>
              <span className="font-mono text-[#e1fdff] bg-[rgba(0,242,255,0.05)] px-1.5 rounded">l, n, r</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
