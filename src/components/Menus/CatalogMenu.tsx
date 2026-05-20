import React, { useState, useMemo } from 'react';
import { useCalcStore } from '../../state/useCalcStore';

// ── Function Catalog ──────────────────────────────────────────────────────────

interface CatalogEntry {
  name: string;
  insert: string;
  category: string;
  desc: string;
}

const CATALOG: CatalogEntry[] = [
  // Arithmetic
  { name: 'Abs',          insert: 'abs(',           category: 'Arithmetic',    desc: 'Absolute value' },
  { name: 'Int',          insert: 'intPart(',        category: 'Arithmetic',    desc: 'Integer part' },
  { name: 'Frac',         insert: 'fracPart(',       category: 'Arithmetic',    desc: 'Fractional part' },
  { name: 'GCD',          insert: 'gcd(',            category: 'Arithmetic',    desc: 'Greatest common divisor' },
  { name: 'LCM',          insert: 'lcm(',            category: 'Arithmetic',    desc: 'Least common multiple' },
  { name: 'Prime',        insert: 'primeFactors(',   category: 'Arithmetic',    desc: 'Prime factorization' },
  { name: 'Round',        insert: 'round(',          category: 'Arithmetic',    desc: 'Round to n digits' },
  { name: 'nPr',          insert: ' nPr ',           category: 'Arithmetic',    desc: 'Permutations' },
  { name: 'nCr',          insert: ' nCr ',           category: 'Arithmetic',    desc: 'Combinations' },
  { name: 'n!',           insert: '!',               category: 'Arithmetic',    desc: 'Factorial' },
  { name: 'Ran#',         insert: 'Ran#',            category: 'Arithmetic',    desc: 'Random number [0,1)' },
  { name: 'RanInt',       insert: 'RanInt#(',        category: 'Arithmetic',    desc: 'Random integer' },
  // Trig
  { name: 'sin',          insert: 'sin(',            category: 'Trigonometry',  desc: 'Sine' },
  { name: 'cos',          insert: 'cos(',            category: 'Trigonometry',  desc: 'Cosine' },
  { name: 'tan',          insert: 'tan(',            category: 'Trigonometry',  desc: 'Tangent' },
  { name: 'sin⁻¹',       insert: 'asin(',           category: 'Trigonometry',  desc: 'Inverse sine' },
  { name: 'cos⁻¹',       insert: 'acos(',           category: 'Trigonometry',  desc: 'Inverse cosine' },
  { name: 'tan⁻¹',       insert: 'atan(',           category: 'Trigonometry',  desc: 'Inverse tangent' },
  { name: 'sinh',         insert: 'sinh(',           category: 'Trigonometry',  desc: 'Hyperbolic sine' },
  { name: 'cosh',         insert: 'cosh(',           category: 'Trigonometry',  desc: 'Hyperbolic cosine' },
  { name: 'tanh',         insert: 'tanh(',           category: 'Trigonometry',  desc: 'Hyperbolic tangent' },
  { name: 'sinh⁻¹',      insert: 'asinh(',          category: 'Trigonometry',  desc: 'Inverse hyperbolic sine' },
  { name: 'cosh⁻¹',      insert: 'acosh(',          category: 'Trigonometry',  desc: 'Inverse hyperbolic cosine' },
  { name: 'tanh⁻¹',      insert: 'atanh(',          category: 'Trigonometry',  desc: 'Inverse hyperbolic tangent' },
  { name: 'Pol',          insert: 'Pol(',            category: 'Trigonometry',  desc: 'Rectangular → Polar' },
  { name: 'Rec',          insert: 'Rec(',            category: 'Trigonometry',  desc: 'Polar → Rectangular' },
  // Logs
  { name: 'log',          insert: 'log(',            category: 'Logarithm',     desc: 'Common logarithm (base 10)' },
  { name: 'ln',           insert: 'ln(',             category: 'Logarithm',     desc: 'Natural logarithm' },
  { name: 'log_b',        insert: 'logBase(',        category: 'Logarithm',     desc: 'Logarithm base b' },
  { name: '10^x',         insert: '10^(',            category: 'Logarithm',     desc: 'Power of 10' },
  { name: 'e^x',          insert: 'exp(',            category: 'Logarithm',     desc: 'Exponential e^x' },
  // Roots
  { name: '√',            insert: 'sqrt(',           category: 'Power/Root',    desc: 'Square root' },
  { name: '∛',            insert: 'cbrt(',           category: 'Power/Root',    desc: 'Cube root' },
  { name: 'ˣ√',           insert: 'nthRoot(',        category: 'Power/Root',    desc: 'Nth root' },
  { name: 'x²',           insert: '^2',              category: 'Power/Root',    desc: 'Square' },
  { name: 'x^y',          insert: '^',               category: 'Power/Root',    desc: 'Power' },
  { name: 'x⁻¹',         insert: '^(-1)',            category: 'Power/Root',    desc: 'Reciprocal' },
  // Calculus
  { name: '∫',            insert: '∫(',              category: 'Calculus',      desc: 'Definite integral' },
  { name: 'd/dx',         insert: 'd/dx(',           category: 'Calculus',      desc: 'Derivative' },
  { name: 'Σ',            insert: 'Σ(',              category: 'Calculus',      desc: 'Summation' },
  { name: 'Π',            insert: 'product(',        category: 'Calculus',      desc: 'Product series' },
  // Constants
  { name: 'π',            insert: 'π',               category: 'Constants',     desc: '3.14159265...' },
  { name: 'e',            insert: 'e',               category: 'Constants',     desc: '2.71828182...' },
  { name: 'Ans',          insert: 'Ans',             category: 'Constants',     desc: 'Last answer' },
  { name: 'PreAns',       insert: 'PreAns',          category: 'Constants',     desc: 'Previous answer' },
];

const CATEGORIES = ['All', ...Array.from(new Set(CATALOG.map(e => e.category)))];

export function CatalogMenu() {
  const { setActiveMenu, insertAtCursor } = useCalcStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() =>
    CATALOG.filter(e =>
      (category === 'All' || e.category === category) &&
      (e.name.toLowerCase().includes(search.toLowerCase()) ||
       e.desc.toLowerCase().includes(search.toLowerCase()))
    ), [search, category]);

  const handleInsert = (entry: CatalogEntry) => {
    insertAtCursor(entry.insert);
    setActiveMenu(null);
  };

  return (
    <div className="menu-overlay" onClick={() => setActiveMenu(null)}>
      <div className="menu-panel max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-bold text-base">Function Catalog</h2>
          <button className="text-gray-400 hover:text-white text-lg p-1" onClick={() => setActiveMenu(null)}>✕</button>
        </div>

        {/* Search */}
        <input
          className="w-full bg-[#0e0e1a] border border-[rgba(100,200,50,0.2)] rounded-lg px-3 py-1.5 text-sm font-mono mb-2 outline-none focus:border-[rgba(100,200,50,0.5)]"
          style={{ color: 'var(--lcd-text)' }}
          placeholder="Search functions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />

        {/* Category tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-[rgba(100,200,50,0.25)] text-[var(--lcd-text)] border border-[rgba(100,200,50,0.4)]'
                  : 'text-gray-400 border border-transparent hover:border-[rgba(100,200,50,0.2)]'
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Entries */}
        <div className="overflow-y-auto flex-1 space-y-0.5">
          {filtered.length === 0 && (
            <div className="text-gray-500 text-sm text-center py-4">No functions found</div>
          )}
          {filtered.map(entry => (
            <div
              key={entry.name + entry.insert}
              className="menu-item"
              onClick={() => handleInsert(entry)}
            >
              <span className="font-mono text-sm w-20 shrink-0" style={{ color: 'var(--lcd-text)' }}>
                {entry.name}
              </span>
              <span className="text-gray-500 text-xs">{entry.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
