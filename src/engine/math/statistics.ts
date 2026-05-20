// ── Statistics Engine ─────────────────────────────────────────────────────────

export interface StatResult1Var {
  n: number;
  sumX: number;
  sumX2: number;
  mean: number;
  sigmaX: number;   // population std dev
  sX: number;       // sample std dev
  minX: number;
  maxX: number;
  q1: number;
  median: number;
  q3: number;
}

export interface StatResult2Var extends StatResult1Var {
  sumY: number;
  sumY2: number;
  sumXY: number;
  meanY: number;
  sigmaY: number;
  sY: number;
  minY: number;
  maxY: number;
}

export interface RegressionResult {
  type: RegressionType;
  a: number;
  b: number;
  c?: number;
  r: number;         // correlation coefficient
  r2: number;        // R²
  predict: (x: number) => number;
}

export type RegressionType =
  | 'linear' | 'quadratic' | 'logarithmic'
  | 'expE' | 'expAB' | 'power' | 'inverse';

function sortedCopy(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}

function quantile(sorted: number[], q: number): number {
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (base + 1 < sorted.length) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

export function oneVarStats(xs: number[], freqs?: number[]): StatResult1Var {
  const data: number[] = [];
  if (freqs) {
    xs.forEach((x, i) => {
      const f = Math.round(freqs[i] ?? 1);
      for (let k = 0; k < f; k++) data.push(x);
    });
  } else {
    data.push(...xs);
  }

  const n = data.length;
  if (n === 0) throw new Error('No Data');

  const sumX = data.reduce((a, b) => a + b, 0);
  const sumX2 = data.reduce((a, b) => a + b * b, 0);
  const mean = sumX / n;
  const sigmaX = Math.sqrt(sumX2 / n - mean * mean);
  const sX = n > 1 ? Math.sqrt((sumX2 - n * mean * mean) / (n - 1)) : 0;

  const sorted = sortedCopy(data);
  const minX = sorted[0];
  const maxX = sorted[n - 1];
  const q1 = quantile(sorted, 0.25);
  const median = quantile(sorted, 0.5);
  const q3 = quantile(sorted, 0.75);

  return { n, sumX, sumX2, mean, sigmaX, sX, minX, maxX, q1, median, q3 };
}

export function twoVarStats(xs: number[], ys: number[], freqs?: number[]): StatResult2Var {
  const dx: number[] = [], dy: number[] = [];
  if (freqs) {
    xs.forEach((x, i) => {
      const f = Math.round(freqs[i] ?? 1);
      for (let k = 0; k < f; k++) { dx.push(x); dy.push(ys[i]); }
    });
  } else {
    dx.push(...xs); dy.push(...ys);
  }

  const n = dx.length;
  if (n === 0) throw new Error('No Data');

  const s1 = oneVarStats(dx);
  const sumY = dy.reduce((a, b) => a + b, 0);
  const sumY2 = dy.reduce((a, b) => a + b * b, 0);
  const meanY = sumY / n;
  const sigmaY = Math.sqrt(sumY2 / n - meanY * meanY);
  const sY = n > 1 ? Math.sqrt((sumY2 - n * meanY * meanY) / (n - 1)) : 0;
  const sumXY = dx.reduce((a, x, i) => a + x * dy[i], 0);
  const sorted = sortedCopy(dy);
  const minY = sorted[0], maxY = sorted[n - 1];

  return {
    ...s1,
    sumY, sumY2, sumXY,
    meanY, sigmaY, sY, minY, maxY,
  };
}

// ── Regression ───────────────────────────────────────────────────────────────

function linearReg(xs: number[], ys: number[]): RegressionResult {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sx2 = xs.reduce((a, x) => a + x * x, 0);
  const sy2 = ys.reduce((a, y) => a + y * y, 0);

  const denom = n * sx2 - sx * sx;
  if (denom === 0) throw new Error('Singular Matrix');

  const b = (n * sxy - sx * sy) / denom;
  const a = (sy - b * sx) / n;

  const r = (n * sxy - sx * sy) / Math.sqrt((n * sx2 - sx ** 2) * (n * sy2 - sy ** 2));
  return { type: 'linear', a, b, r, r2: r * r, predict: (x) => a + b * x };
}

function quadraticReg(xs: number[], ys: number[]): RegressionResult {
  // Normal equations for y = a + bx + cx²
  const n = xs.length;
  let s0=n, s1=0, s2=0, s3=0, s4=0, t0=0, t1=0, t2=0;
  for (let i=0;i<n;i++) {
    const x=xs[i], y=ys[i];
    s1+=x; s2+=x*x; s3+=x*x*x; s4+=x*x*x*x;
    t0+=y; t1+=x*y; t2+=x*x*y;
  }
  // Solve 3×3 system via Gaussian elimination
  const A = [[s0,s1,s2,t0],[s1,s2,s3,t1],[s2,s3,s4,t2]];
  for (let col=0;col<3;col++) {
    let pivot = col;
    for (let row=col+1;row<3;row++) if (Math.abs(A[row][col])>Math.abs(A[pivot][col])) pivot=row;
    [A[col],A[pivot]]=[A[pivot],A[col]];
    for (let row=col+1;row<3;row++) {
      const f=A[row][col]/A[col][col];
      for (let j=col;j<4;j++) A[row][j]-=f*A[col][j];
    }
  }
  const c=A[2][3]/A[2][2];
  const b=(A[1][3]-A[1][2]*c)/A[1][1];
  const a=(A[0][3]-A[0][2]*c-A[0][1]*b)/A[0][0];

  const yMean = t0/n;
  const ssTot = ys.reduce((acc,y)=>acc+(y-yMean)**2,0);
  const ssRes = ys.reduce((acc,y,i)=>{ const yh=a+b*xs[i]+c*xs[i]**2; return acc+(y-yh)**2; },0);
  const r2 = 1 - ssRes/ssTot;

  return { type: 'quadratic', a, b, c, r: Math.sqrt(r2), r2, predict: (x)=>a+b*x+c*x*x };
}

function transformReg(
  xs: number[], ys: number[],
  xFn: (x:number)=>number, yFn: (y:number)=>number,
  predictFn: (a:number,b:number,x:number)=>number,
  type: RegressionType,
): RegressionResult {
  const txs = xs.map(xFn);
  const tys = ys.map(yFn);
  const res = linearReg(txs, tys);
  return {
    type,
    a: res.a, b: res.b, r: res.r, r2: res.r2,
    predict: (x) => predictFn(res.a, res.b, x),
  };
}

export function regression(
  xs: number[], ys: number[], type: RegressionType
): RegressionResult {
  switch (type) {
    case 'linear':      return linearReg(xs, ys);
    case 'quadratic':   return quadraticReg(xs, ys);
    case 'logarithmic': return transformReg(xs,ys,x=>Math.log(x),y=>y,(a,b,x)=>a+b*Math.log(x),'logarithmic');
    case 'expE':        return transformReg(xs,ys,x=>x,y=>Math.log(y),(a,b,x)=>Math.exp(a)*Math.exp(b*x),'expE');
    case 'expAB':       return transformReg(xs,ys,x=>x,y=>Math.log(y),(a,b,x)=>Math.exp(a)*Math.pow(Math.exp(b),x),'expAB');
    case 'power':       return transformReg(xs,ys,x=>Math.log(x),y=>Math.log(y),(a,b,x)=>Math.exp(a)*Math.pow(x,b),'power');
    case 'inverse':     return transformReg(xs,ys,x=>1/x,y=>y,(a,b,x)=>a+b/x,'inverse');
  }
}

// ── Probability Distributions ─────────────────────────────────────────────────

// Normal distribution PDF
export function normalPDF(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) throw new Error('σ must be > 0');
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

// Normal CDF using numerical approximation (Hart's algorithm)
export function normalCDF(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) throw new Error('σ must be > 0');
  const z = (x - mu) / (sigma * Math.SQRT2);
  return 0.5 * (1 + erf(z));
}

// Error function approximation
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  return sign * (1 - poly * Math.exp(-x * x));
}

// Inverse normal CDF (rational approximation)
export function inverseNormalCDF(p: number, mu: number, sigma: number): number {
  if (p <= 0 || p >= 1) throw new Error('p must be in (0,1)');
  const z = rationalApproxInvNorm(p);
  return mu + sigma * z;
}

function rationalApproxInvNorm(p: number): number {
  const a = [-3.969683028665376e1,2.209460984245205e2,-2.759285104469687e2,1.383577518672690e2,-3.066479806614716e1,2.506628277459239];
  const b = [-5.447609879822406e1,1.615858368580409e2,-1.556989798598866e2,6.680131188771972e1,-1.328068155288572e1];
  const c = [-7.784894002430293e-3,-3.223964580411365e-1,-2.400758277161838,- 2.549732539343734,4.374664141464968,2.938163982698783];
  const d = [7.784695709041462e-3,3.224671290700398e-1,2.445134137142996,3.754408661907416];

  const pLow = 0.02425, pHigh = 1 - pLow;
  let q: number, r: number;

  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
           ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= pHigh) {
    q = p - 0.5; r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
           (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
             ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}

// Binomial PMF: P(X=k) = C(n,k) * p^k * (1-p)^(n-k)
export function binomialPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n || !Number.isInteger(k)) throw new Error('Invalid k');
  if (p < 0 || p > 1) throw new Error('p must be in [0,1]');
  const c = binomialCoeff(n, k);
  return c * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Binomial CDF
export function binomialCDF(k: number, n: number, p: number): number {
  let sum = 0;
  for (let i = 0; i <= Math.floor(k); i++) sum += binomialPMF(i, n, p);
  return Math.min(1, sum);
}

function binomialCoeff(n: number, k: number): number {
  if (k > n - k) k = n - k;
  let c = 1;
  for (let i = 0; i < k; i++) { c = c * (n - i) / (i + 1); }
  return c;
}

// Poisson PMF: P(X=k) = e^(-λ) * λ^k / k!
export function poissonPMF(k: number, lambda: number): number {
  if (k < 0 || !Number.isInteger(k)) throw new Error('k must be non-negative integer');
  if (lambda <= 0) throw new Error('λ must be > 0');
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}

export function poissonCDF(k: number, lambda: number): number {
  let sum = 0;
  for (let i = 0; i <= Math.floor(k); i++) sum += poissonPMF(i, lambda);
  return Math.min(1, sum);
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
