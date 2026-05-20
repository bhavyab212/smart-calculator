// ── Equation Solvers ──────────────────────────────────────────────────────────

// Simultaneous linear equations using Gaussian elimination with partial pivoting
// Returns solution vector or throws
export function solveSimultaneous(coeffs: number[][], constants: number[]): number[] {
  const n = coeffs.length;
  // Build augmented matrix
  const aug: number[][] = coeffs.map((row, i) => [...row, constants[i]]);

  // Forward elimination with partial pivoting
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    if (Math.abs(aug[col][col]) < 1e-12) throw new Error('No Unique Solution');

    for (let row = col + 1; row < n; row++) {
      const f = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) aug[row][j] -= f * aug[col][j];
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = aug[i][n];
    for (let j = i + 1; j < n; j++) x[i] -= aug[i][j] * x[j];
    x[i] /= aug[i][i];
  }
  return x;
}

// ── Polynomial Root Finding ───────────────────────────────────────────────────
// Returns all roots (real and complex) for degrees 2–4

export interface Root {
  re: number;
  im: number;
  isComplex: boolean;
}

function rootFromComplex(re: number, im: number): Root {
  return { re, im: Math.abs(im) < 1e-10 ? 0 : im, isComplex: Math.abs(im) > 1e-10 };
}

// Quadratic: ax² + bx + c = 0
export function solveQuadratic(a: number, b: number, c: number): Root[] {
  if (a === 0) {
    if (b === 0) throw new Error(c === 0 ? 'All Real' : 'No Solution');
    return [rootFromComplex(-c / b, 0)];
  }
  const disc = b * b - 4 * a * c;
  if (disc >= 0) {
    const sqrtD = Math.sqrt(disc);
    return [
      rootFromComplex((-b + sqrtD) / (2 * a), 0),
      rootFromComplex((-b - sqrtD) / (2 * a), 0),
    ];
  } else {
    const sqrtD = Math.sqrt(-disc);
    return [
      rootFromComplex(-b / (2 * a), sqrtD / (2 * a)),
      rootFromComplex(-b / (2 * a), -sqrtD / (2 * a)),
    ];
  }
}

// Cubic: ax³ + bx² + cx + d = 0 (Cardano's formula)
export function solveCubic(a: number, b: number, c: number, d: number): Root[] {
  if (a === 0) return solveQuadratic(b, c, d);
  b /= a; c /= a; d /= a;

  const p = c - b * b / 3;
  const q = 2 * b * b * b / 27 - b * c / 3 + d;
  const disc = q * q / 4 + p * p * p / 27;
  const offset = -b / 3;

  if (disc > 1e-10) {
    const sqrtD = Math.sqrt(disc);
    const u = Math.cbrt(-q / 2 + sqrtD);
    const v = Math.cbrt(-q / 2 - sqrtD);
    const r1 = u + v + offset;
    const re23 = -(u + v) / 2 + offset;
    const im23 = (u - v) * Math.sqrt(3) / 2;
    return [rootFromComplex(r1,0), rootFromComplex(re23,im23), rootFromComplex(re23,-im23)];
  } else if (disc < -1e-10) {
    const r = Math.sqrt(-p * p * p / 27);
    const theta = Math.acos(Math.max(-1, Math.min(1, -q / (2 * r))));
    const m = 2 * Math.cbrt(r);
    return [
      rootFromComplex(m * Math.cos(theta / 3) + offset, 0),
      rootFromComplex(m * Math.cos((theta + 2 * Math.PI) / 3) + offset, 0),
      rootFromComplex(m * Math.cos((theta + 4 * Math.PI) / 3) + offset, 0),
    ];
  } else {
    const u = Math.cbrt(-q / 2);
    return [
      rootFromComplex(2 * u + offset, 0),
      rootFromComplex(-u + offset, 0),
      rootFromComplex(-u + offset, 0),
    ];
  }
}

// Quartic: ax⁴ + bx³ + cx² + dx + e = 0 (Ferrari's method)
export function solveQuartic(a: number, b: number, c: number, d: number, e: number): Root[] {
  if (a === 0) return solveCubic(b, c, d, e);
  b /= a; c /= a; d /= a; e /= a;

  // Depressed quartic via substitution x = t - b/4
  const p = c - 3 * b * b / 8;
  const q = b * b * b / 8 - b * c / 2 + d;
  const r = -3 * b * b * b * b / 256 + c * b * b / 16 - b * d / 4 + e;

  const offset = -b / 4;

  if (Math.abs(q) < 1e-12) {
    // Biquadratic case
    const quads = solveQuadratic(1, p, r);
    const roots: Root[] = [];
    for (const quad of quads) {
      if (!quad.isComplex) {
        if (quad.re >= 0) {
          const s = Math.sqrt(quad.re);
          roots.push(rootFromComplex(s + offset, 0));
          roots.push(rootFromComplex(-s + offset, 0));
        } else {
          const s = Math.sqrt(-quad.re);
          roots.push(rootFromComplex(offset, s));
          roots.push(rootFromComplex(offset, -s));
        }
      }
    }
    return roots;
  }

  // Ferrari: solve resolvent cubic
  const cubicRoots = solveCubic(1, p / 2, (p * p - 4 * r) / 16, -q * q / 64);
  const m = cubicRoots.find(r => !r.isComplex && r.re > 0)?.re
    ?? cubicRoots.find(r => !r.isComplex)?.re ?? 0;

  const sqrtM = Math.sqrt(Math.max(0, m));
  const roots: Root[] = [];

  const q1 = solveQuadratic(1, sqrtM, p / 2 + m - q / (4 * sqrtM || 1));
  const q2 = solveQuadratic(1, -sqrtM, p / 2 + m + q / (4 * sqrtM || 1));

  for (const r of [...q1, ...q2]) {
    roots.push(rootFromComplex(r.re + offset, r.im));
  }
  return roots;
}

// ── Inequality Solver ─────────────────────────────────────────────────────────

export interface Interval {
  type: 'open' | 'closed' | 'empty' | 'all';
  intervals?: Array<{ lo: number; hi: number; loIncl: boolean; hiIncl: boolean }>;
}

export function solveInequality(
  coeffs: number[],
  sign: '>' | '<' | '>=' | '<=',
): string {
  let roots: Root[] = [];
  const [a, b, c, d, e] = coeffs;

  if (coeffs.length === 3) roots = solveQuadratic(a, b, c);
  else if (coeffs.length === 4) roots = solveCubic(a, b, c, d);
  else if (coeffs.length === 5) roots = solveQuartic(a, b, c, d, e);

  const realRoots = roots
    .filter(r => !r.isComplex)
    .map(r => r.re)
    .sort((a, b) => a - b)
    .filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 1e-10);

  if (realRoots.length === 0) {
    // Constant sign — test at x=0
    const lead = a;
    const posAtZero = lead > 0;
    const isSatisfied = (sign === '>' || sign === '>=') ? posAtZero : !posAtZero;
    return isSatisfied ? 'All Real Numbers' : 'No Solution';
  }

  // Build intervals and test midpoints
  const boundaries = [-Infinity, ...realRoots, Infinity];
  const incl = sign === '>=' || sign === '<=';
  const wantPositive = sign === '>' || sign === '>=';

  const parts: string[] = [];
  for (let i = 0; i < boundaries.length - 1; i++) {
    const lo = boundaries[i];
    const hi = boundaries[i + 1];
    const mid = lo === -Infinity ? hi - 1 : (hi === Infinity ? lo + 1 : (lo + hi) / 2);

    // Evaluate polynomial at mid
    let val = 0, pow = 1;
    const c2 = [...coeffs].reverse();
    for (let k = 0; k < c2.length; k++) { val += c2[k] * pow; pow *= mid; }

    const inInterval = wantPositive ? val > 0 : val < 0;
    if (inInterval) {
      const loStr = lo === -Infinity ? '-∞' : lo.toPrecision(6);
      const hiStr = hi === Infinity ? '+∞' : hi.toPrecision(6);
      const loBr = lo === -Infinity ? '(' : (incl ? '[' : '(');
      const hiBr = hi === Infinity ? ')' : (incl ? ']' : ')');
      parts.push(`${loBr}${loStr}, ${hiStr}${hiBr}`);
    }
  }

  return parts.length === 0 ? 'No Solution' : parts.join(' ∪ ');
}
