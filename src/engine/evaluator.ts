// ── Expression Evaluator (math.js backed) ────────────────────────────────────
// Evaluates textbook-style expression strings in the context of the calculator

import { create, all } from 'mathjs';
import type { AngleUnit } from './math/types';
import { isComplex } from './math/types';
import {
  factorial, combination, permutation, gcd, lcm,
  primeFactorsString, abs, intPart, fracPart,
  roundVal, log10, ln, logBase, sqrt, nthRoot,
  sin, cos, tan, asin, acos, atan,
  sinh, cosh, tanh, asinh, acosh, atanh,
  recToPol, polToRec, integrate, derivative, summation, productSeries,
  formatNum, type DisplayFormat, randomNum, randomInt,
  complexToString,
} from './math/arithmetic';
import { SCIENTIFIC_CONSTANTS } from './constants';
import type { Complex } from './math/types';

export interface EvalContext {
  angleUnit: AngleUnit;
  variables: Record<string, any>;
  ans: number | Complex;
  preAns: number | Complex;
  displayFormat: DisplayFormat;
  fixDigits: number;
}

export interface EvalResult {
  value: number | Complex;
  display: string;
  exact?: string;
  isError: boolean;
  errorMsg?: string;
}

// Build a constants map from SCIENTIFIC_CONSTANTS
const CONST_MAP: Record<string, number> = {};
SCIENTIFIC_CONSTANTS.forEach(c => { CONST_MAP[c.symbol] = c.value; });

// Add mathematical constants
CONST_MAP['π'] = Math.PI;
CONST_MAP['pi'] = Math.PI;
CONST_MAP['e'] = Math.E;

function preprocessExpression(expr: string): string {
  // Normalize common textbook notations
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'PI')
    .replace(/\^/g, '**')
    .replace(/(\d+)!/g, 'factorial($1)')
    .replace(/(\d+)\s*P\s*(\d+)/g, 'permutation($1,$2)')
    .replace(/(\d+)\s*C\s*(\d+)/g, 'combination($1,$2)')
    .replace(/sin⁻¹|asin/gi, 'asin')
    .replace(/cos⁻¹|acos/gi, 'acos')
    .replace(/tan⁻¹|atan/gi, 'atan')
    .replace(/sinh⁻¹|asinh/gi, 'asinh')
    .replace(/cosh⁻¹|acosh/gi, 'acosh')
    .replace(/tanh⁻¹|atanh/gi, 'atanh')
    .replace(/log₁₀|log10/gi, 'log10')
    .replace(/log\(([^,)]+),([^)]+)\)/g, 'logBase($1,$2)')
    .replace(/ln/gi, 'ln')
    .replace(/√\(([^)]+)\)/g, 'sqrt($1)')
    .replace(/∛\(([^)]+)\)/g, 'cbrt($1)')
    .replace(/Abs|abs/g, 'abs')
    .replace(/Int(?!e)/g, 'intPart')
    .replace(/Frac/g, 'fracPart')
    .replace(/GCD/gi, 'gcd')
    .replace(/LCM/gi, 'lcm')
    .replace(/Pol\(([^,]+),([^)]+)\)/g, 'recToPol($1,$2)')
    .replace(/Rec\(([^,]+),([^)]+)\)/g, 'polToRec($1,$2)')
    .replace(/Ran#/g, 'ranNum()')
    .replace(/RanInt#\(([^,]+),([^)]+)\)/g, 'ranInt($1,$2)')
    .replace(/Σ/g, 'sigma')
    .replace(/∫/g, 'integral')
    .replace(/d\/dx/g, 'derivative');
}

export function evaluate(expression: string, ctx: EvalContext): EvalResult {
  try {
    if (!expression.trim()) {
      return { value: 0, display: '', isError: false };
    }

    // Create a math.js scope with all our functions
    const scope: Record<string, unknown> = {
      PI: Math.PI,
      E: Math.E,
      Ans: ctx.ans,
      PreAns: ctx.preAns,
      ...ctx.variables,

      // Inject constants
      ...CONST_MAP,

      // Arithmetic
      factorial: (n: number) => factorial(n),
      permutation: (n: number, r: number) => permutation(n, r),
      combination: (n: number, r: number) => combination(n, r),
      nPr: (n: number, r: number) => permutation(n, r),
      nCr: (n: number, r: number) => combination(n, r),
      gcd: (a: number, b: number) => gcd(a, b),
      lcm: (a: number, b: number) => lcm(a, b),
      abs: (x: number) => abs(x),
      intPart: (x: number) => intPart(x),
      fracPart: (x: number) => fracPart(x),
      round: (x: number, n = 0) => roundVal(x, n),
      primeFactors: (n: number) => primeFactorsString(n),

      // Trig (angle-unit-aware)
      sin: (x: number) => sin(x, ctx.angleUnit),
      cos: (x: number) => cos(x, ctx.angleUnit),
      tan: (x: number) => tan(x, ctx.angleUnit),
      asin: (x: number) => asin(x, ctx.angleUnit),
      acos: (x: number) => acos(x, ctx.angleUnit),
      atan: (x: number) => atan(x, ctx.angleUnit),
      sinh: (x: number) => sinh(x),
      cosh: (x: number) => cosh(x),
      tanh: (x: number) => tanh(x),
      asinh: (x: number) => asinh(x),
      acosh: (x: number) => acosh(x),
      atanh: (x: number) => atanh(x),

      // Logs
      log: (x: number) => log10(x),
      log10: (x: number) => log10(x),
      ln: (x: number) => ln(x),
      logBase: (x: number, base: number) => logBase(x, base),
      exp: (x: number) => Math.exp(x),

      // Roots
      sqrt: (x: number) => sqrt(x),
      cbrt: (x: number) => Math.cbrt(x),
      nthRoot: (n: number, x: number) => nthRoot(x, n),

      // Coordinate
      recToPol: (x: number, y: number) => {
        const r = recToPol(x, y, ctx.angleUnit);
        return r.r; // returns r, stores θ in variable
      },
      polToRec: (r: number, theta: number) => {
        const p = polToRec(r, theta, ctx.angleUnit);
        return p.x; // returns x, stores y in variable
      },

      // Random
      ranNum: () => randomNum(),
      ranInt: (a: number, b: number) => randomInt(a, b),

      // Calculus
      integral: (f: (x: number) => number, a: number, b: number) => integrate(f, a, b),
      sigma: (f: (x: number) => number, start: number, end: number) => summation(f, start, end),
      product: (f: (x: number) => number, start: number, end: number) => productSeries(f, start, end),
      ddx: (f: (x: number) => number, x: number) => derivative(f, x),
    };

    // Use mathjs for safe evaluation
    const mathInstance = create(all);
    const result = mathInstance.evaluate(preprocessExpression(expression), scope);

    const value = typeof result === 'number' ? result : Number(result);

    if (isNaN(value)) return { value: 0, display: 'Math ERROR', isError: true, errorMsg: 'Math ERROR' };

    const display = formatNum(value, ctx.displayFormat, ctx.fixDigits);
    return { value, display, isError: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Syntax ERROR';
    return { value: 0, display: msg, isError: true, errorMsg: msg };
  }
}

// Safe function builder for calculus operations
export function buildFunction(
  expr: string,
  variable: string,
  ctx: EvalContext,
): (val: number) => number {
  return (val: number) => {
    const result = evaluate(expr, {
      ...ctx,
      variables: { ...ctx.variables, [variable]: val },
    });
    if (result.isError) throw new Error(result.errorMsg);
    return Number(result.value);
  };
}

export { complexToString, isComplex };
