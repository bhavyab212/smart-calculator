import { create, all } from 'mathjs';
import Fraction from 'fraction.js';
import type { AngleUnit, Complex } from './types';
import { toRadians, fromRadians } from './types';

// Configured math.js instance
const math = create(all, {
  number: 'BigNumber',
  precision: 64,
});

// ── Arithmetic ───────────────────────────────────────────────────────────────

export function add(a: number, b: number): number { return Number(math.add(a, b)); }
export function subtract(a: number, b: number): number { return Number(math.subtract(a, b)); }
export function multiply(a: number, b: number): number { return Number(math.multiply(a, b)); }
export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Division by Zero');
  return Number(math.divide(a, b));
}
export function mod(a: number, b: number): number {
  if (b === 0) throw new Error('Division by Zero');
  return Number(math.mod(a, b));
}
export function intDiv(a: number, b: number): number {
  if (b === 0) throw new Error('Division by Zero');
  return Math.trunc(a / b);
}
export function remainder(a: number, b: number): number {
  if (b === 0) throw new Error('Division by Zero');
  return ((a % b) + b) % b;
}
export function power(base: number, exp: number): number {
  return Number(math.pow(base, exp));
}
export function nthRoot(x: number, n: number): number {
  if (n === 0) throw new Error('Root index cannot be 0');
  if (x < 0 && n % 2 === 0) throw new Error('Math ERROR');
  return Number(math.nthRoot(x, n));
}
export function sqrt(x: number): number {
  if (x < 0) throw new Error('Math ERROR');
  return Number(math.sqrt(x));
}
export function cbrt(x: number): number { return Math.cbrt(x); }
export function reciprocal(x: number): number {
  if (x === 0) throw new Error('Division by Zero');
  return 1 / x;
}
export function square(x: number): number { return x * x; }
export function cube(x: number): number { return x * x * x; }
export function abs(x: number): number { return Math.abs(x); }
export function intPart(x: number): number { return Math.trunc(x); }
export function fracPart(x: number): number { return x - Math.trunc(x); }
export function roundVal(x: number, n = 0): number {
  const factor = Math.pow(10, n);
  return Math.round(x * factor) / factor;
}

// ── GCD / LCM ────────────────────────────────────────────────────────────────

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export function lcm(a: number, b: number): number {
  const g = gcd(a, b);
  if (g === 0) return 0;
  return Math.abs(Math.round(a) * Math.round(b)) / g;
}

// ── Prime Factorization ───────────────────────────────────────────────────────

export function primeFactors(n: number): Record<number, number> {
  n = Math.abs(Math.round(n));
  if (n < 2) return {};
  const factors: Record<number, number> = {};
  for (let d = 2; d * d <= n; d++) {
    while (n % d === 0) {
      factors[d] = (factors[d] || 0) + 1;
      n = Math.floor(n / d);
    }
  }
  if (n > 1) factors[n] = (factors[n] || 0) + 1;
  return factors;
}

export function primeFactorsString(n: number): string {
  const f = primeFactors(n);
  return Object.entries(f)
    .map(([base, exp]) => exp === 1 ? base : `${base}^${exp}`)
    .join(' × ');
}

// ── Logarithms ───────────────────────────────────────────────────────────────

export function log10(x: number): number {
  if (x <= 0) throw new Error('Math ERROR');
  return Math.log10(x);
}
export function ln(x: number): number {
  if (x <= 0) throw new Error('Math ERROR');
  return Math.log(x);
}
export function logBase(x: number, base: number): number {
  if (x <= 0 || base <= 0 || base === 1) throw new Error('Math ERROR');
  return Math.log(x) / Math.log(base);
}
export function exp(x: number): number { return Math.exp(x); }
export function pow10(x: number): number { return Math.pow(10, x); }

// ── Trigonometry ──────────────────────────────────────────────────────────────

export function sin(x: number, unit: AngleUnit): number {
  const r = toRadians(x, unit);
  // Handle exact values
  if (unit === 'DEG') {
    const d = ((x % 360) + 360) % 360;
    if (d === 0 || d === 180) return 0;
    if (d === 90) return 1;
    if (d === 270) return -1;
  }
  return Math.sin(r);
}
export function cos(x: number, unit: AngleUnit): number {
  const r = toRadians(x, unit);
  if (unit === 'DEG') {
    const d = ((x % 360) + 360) % 360;
    if (d === 90 || d === 270) return 0;
    if (d === 0) return 1;
    if (d === 180) return -1;
  }
  return Math.cos(r);
}
export function tan(x: number, unit: AngleUnit): number {
  if (unit === 'DEG') {
    const d = ((x % 360) + 360) % 360;
    if (d === 90 || d === 270) throw new Error('Math ERROR');
    if (d === 0 || d === 180) return 0;
  }
  return Math.tan(toRadians(x, unit));
}
export function asin(x: number, unit: AngleUnit): number {
  if (x < -1 || x > 1) throw new Error('Math ERROR');
  return fromRadians(Math.asin(x), unit);
}
export function acos(x: number, unit: AngleUnit): number {
  if (x < -1 || x > 1) throw new Error('Math ERROR');
  return fromRadians(Math.acos(x), unit);
}
export function atan(x: number, unit: AngleUnit): number {
  return fromRadians(Math.atan(x), unit);
}
export function atan2(y: number, x: number, unit: AngleUnit): number {
  return fromRadians(Math.atan2(y, x), unit);
}

// Hyperbolic
export function sinh(x: number): number { return Math.sinh(x); }
export function cosh(x: number): number { return Math.cosh(x); }
export function tanh(x: number): number { return Math.tanh(x); }
export function asinh(x: number): number { return Math.asinh(x); }
export function acosh(x: number): number {
  if (x < 1) throw new Error('Math ERROR');
  return Math.acosh(x);
}
export function atanh(x: number): number {
  if (x <= -1 || x >= 1) throw new Error('Math ERROR');
  return Math.atanh(x);
}

// ── Coordinate Conversion ────────────────────────────────────────────────────

export function polToRec(r: number, theta: number, unit: AngleUnit): { x: number; y: number } {
  const rad = toRadians(theta, unit);
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
}
export function recToPol(x: number, y: number, unit: AngleUnit): { r: number; theta: number } {
  const r = Math.sqrt(x * x + y * y);
  const theta = fromRadians(Math.atan2(y, x), unit);
  return { r, theta };
}

// ── Combinatorics ────────────────────────────────────────────────────────────

export function factorial(n: number): number {
  n = Math.round(n);
  if (n < 0) throw new Error('Math ERROR');
  if (n > 69) throw new Error('Math ERROR'); // overflow
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function permutation(n: number, r: number): number {
  n = Math.round(n); r = Math.round(r);
  if (r < 0 || r > n) throw new Error('Math ERROR');
  return factorial(n) / factorial(n - r);
}

export function combination(n: number, r: number): number {
  n = Math.round(n); r = Math.round(r);
  if (r < 0 || r > n) throw new Error('Math ERROR');
  if (r > n - r) r = n - r;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

// ── Random ───────────────────────────────────────────────────────────────────

export function randomNum(): number { return Math.random(); }
export function randomInt(a: number, b: number): number {
  a = Math.ceil(a); b = Math.floor(b);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// ── Fraction Utilities ────────────────────────────────────────────────────────

export function toFraction(x: number): string {
  try {
    const f = new Fraction(x);
    if (f.d === 1) return String(f.n);
    return `${f.n}/${f.d}`;
  } catch {
    return String(x);
  }
}

export function simplifyFraction(num: number, den: number): { num: number; den: number } {
  const g = gcd(Math.abs(num), Math.abs(den));
  return { num: num / g, den: den / g };
}

// ── Numerical Calculus ────────────────────────────────────────────────────────

// Numerical derivative using 5-point stencil (centered difference)
export function derivative(f: (x: number) => number, x: number, h = 1e-6): number {
  return (-f(x + 2*h) + 8*f(x + h) - 8*f(x - h) + f(x - 2*h)) / (12 * h);
}

// Adaptive Simpson's rule for numerical integration
export function integrate(f: (x: number) => number, a: number, b: number, tol = 1e-10): number {
  function simpsons(fa: number, fm: number, fb: number, h: number) {
    return (h / 6) * (fa + 4 * fm + fb);
  }

  function adaptiveSimpson(
    a: number, b: number,
    fa: number, fm: number, fb: number,
    whole: number, depth: number
  ): number {
    const lm = (a + (b - a) / 4);
    const rm = (b - (b - a) / 4);
    const mid = (a + b) / 2;
    const flm = f(lm); const frm = f(rm); const fm2 = f(mid);
    const h = (b - a) / 2;
    const left = simpsons(fa, flm, fm2, h / 2);
    const right = simpsons(fm2, frm, fb, h / 2);
    if (depth >= 20 || Math.abs(left + right - whole) <= 15 * tol) {
      return left + right + (left + right - whole) / 15;
    }
    return (
      adaptiveSimpson(a, mid, fa, flm, fm2, left, depth + 1) +
      adaptiveSimpson(mid, b, fm2, frm, fb, right, depth + 1)
    );
  }

  const fa = f(a); const fb = f(b); const fm = f((a + b) / 2);
  const whole = simpsons(fa, fm, fb, (b - a) / 2);
  return adaptiveSimpson(a, b, fa, fm, fb, whole, 0);
}

// Summation Σ f(x) for x from start to end (integers)
export function summation(f: (x: number) => number, start: number, end: number): number {
  let sum = 0;
  for (let x = Math.round(start); x <= Math.round(end); x++) {
    sum += f(x);
  }
  return sum;
}

// Product Π f(x) for x from start to end (integers)
export function productSeries(f: (x: number) => number, start: number, end: number): number {
  let prod = 1;
  for (let x = Math.round(start); x <= Math.round(end); x++) {
    prod *= f(x);
  }
  return prod;
}

// ── Complex Number Arithmetic ─────────────────────────────────────────────────

export function complexAdd(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}
export function complexSub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}
export function complexMul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}
export function complexDiv(a: Complex, b: Complex): Complex {
  const d = b.re * b.re + b.im * b.im;
  if (d === 0) throw new Error('Division by Zero');
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
}
export function complexAbs(z: Complex): number {
  return Math.sqrt(z.re * z.re + z.im * z.im);
}
export function complexArg(z: Complex, unit: AngleUnit): number {
  return fromRadians(Math.atan2(z.im, z.re), unit);
}
export function complexConj(z: Complex): Complex {
  return { re: z.re, im: -z.im };
}
export function complexPow(z: Complex, n: number): Complex {
  const r = complexAbs(z);
  const theta = Math.atan2(z.im, z.re);
  const rn = Math.pow(r, n);
  return { re: rn * Math.cos(n * theta), im: rn * Math.sin(n * theta) };
}
export function complexSqrt(z: Complex): Complex {
  const r = complexAbs(z);
  return {
    re: Math.sqrt((r + z.re) / 2),
    im: Math.sign(z.im) * Math.sqrt((r - z.re) / 2),
  };
}
export function complexToString(z: Complex, decimals = 10): string {
  const re = +z.re.toPrecision(10);
  const im = +z.im.toPrecision(10);
  if (im === 0) return formatNum(re);
  if (re === 0) return `${formatNum(im)}i`;
  const sign = im < 0 ? '-' : '+';
  return `${formatNum(re)}${sign}${formatNum(Math.abs(im))}i`;
}

// ── Number Formatting ─────────────────────────────────────────────────────────

export type DisplayFormat = 'std' | 'dec' | 'sci' | 'eng' | 'fix' | 'norm1' | 'norm2';

export function formatNum(
  x: number,
  format: DisplayFormat = 'std',
  fixDigits = 6,
): string {
  if (!isFinite(x)) return x > 0 ? '∞' : x < 0 ? '-∞' : 'Math ERROR';
  if (isNaN(x)) return 'Math ERROR';

  switch (format) {
    case 'sci': {
      const exp = Math.floor(Math.log10(Math.abs(x)));
      const mantissa = x / Math.pow(10, exp);
      return `${mantissa.toPrecision(fixDigits)}×10^${exp}`;
    }
    case 'eng': {
      if (x === 0) return '0';
      const exp = Math.floor(Math.log10(Math.abs(x)) / 3) * 3;
      const mantissa = x / Math.pow(10, exp);
      return `${+mantissa.toPrecision(fixDigits)}×10^${exp}`;
    }
    case 'fix':
      return x.toFixed(fixDigits);
    case 'norm1':
      if (Math.abs(x) >= 1e10 || (Math.abs(x) < 0.1 && x !== 0)) {
        return x.toExponential(fixDigits - 1);
      }
      return +x.toPrecision(fixDigits) + '';
    case 'norm2':
      if (Math.abs(x) >= 1e10 || (Math.abs(x) < 0.01 && x !== 0)) {
        return x.toExponential(fixDigits - 1);
      }
      return +x.toPrecision(fixDigits) + '';
    default: {
      // std/dec: try to show as clean number
      const abs = Math.abs(x);
      if (abs === 0) return '0';
      if (abs >= 1e10 || (abs < 1e-9 && abs > 0)) {
        return x.toExponential(9).replace(/\.?0+e/, 'e');
      }
      const s = +x.toPrecision(10) + '';
      return s;
    }
  }
}
