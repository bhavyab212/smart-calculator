// ── Matrix Engine ─────────────────────────────────────────────────────────────
// Up to 4×4 matrices: MatA, MatB, MatC

export type Matrix = number[][];

function rows(m: Matrix): number { return m.length; }
function cols(m: Matrix): number { return m[0]?.length ?? 0; }

export function createMatrix(r: number, c: number, fill = 0): Matrix {
  return Array.from({ length: r }, () => Array(c).fill(fill));
}

export function matAdd(a: Matrix, b: Matrix): Matrix {
  if (rows(a) !== rows(b) || cols(a) !== cols(b)) throw new Error('Dimension mismatch');
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

export function matSub(a: Matrix, b: Matrix): Matrix {
  if (rows(a) !== rows(b) || cols(a) !== cols(b)) throw new Error('Dimension mismatch');
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}

export function matScalar(a: Matrix, k: number): Matrix {
  return a.map(row => row.map(v => v * k));
}

export function matMul(a: Matrix, b: Matrix): Matrix {
  if (cols(a) !== rows(b)) throw new Error('Dimension mismatch');
  const result = createMatrix(rows(a), cols(b));
  for (let i = 0; i < rows(a); i++)
    for (let j = 0; j < cols(b); j++)
      for (let k = 0; k < cols(a); k++)
        result[i][j] += a[i][k] * b[k][j];
  return result;
}

export function matTranspose(m: Matrix): Matrix {
  return Array.from({ length: cols(m) }, (_, j) =>
    Array.from({ length: rows(m) }, (_, i) => m[i][j])
  );
}

export function matDet(m: Matrix): number {
  const n = rows(m);
  if (cols(m) !== n) throw new Error('Square matrix required');
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];

  // LU decomposition for general case
  const lu = m.map(r => [...r]);
  let sign = 1;
  for (let col = 0; col < n; col++) {
    // Partial pivoting
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(lu[row][col]) > Math.abs(lu[maxRow][col])) maxRow = row;
    }
    if (maxRow !== col) { [lu[col], lu[maxRow]] = [lu[maxRow], lu[col]]; sign *= -1; }
    if (Math.abs(lu[col][col]) < 1e-12) return 0;
    for (let row = col + 1; row < n; row++) {
      const f = lu[row][col] / lu[col][col];
      for (let j = col; j < n; j++) lu[row][j] -= f * lu[col][j];
    }
  }
  let det = sign;
  for (let i = 0; i < n; i++) det *= lu[i][i];
  return det;
}

export function matInverse(m: Matrix): Matrix {
  const n = rows(m);
  if (cols(m) !== n) throw new Error('Square matrix required');

  // Augmented matrix [A | I]
  const aug = m.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  // Gauss-Jordan elimination
  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[pivotRow][col])) pivotRow = row;
    }
    [aug[col], aug[pivotRow]] = [aug[pivotRow], aug[col]];

    const pivot = aug[col][col];
    if (Math.abs(pivot) < 1e-12) throw new Error('Singular Matrix');

    for (let j = 0; j < 2 * n; j++) aug[col][j] /= pivot;
    for (let row = 0; row < n; row++) {
      if (row !== col) {
        const f = aug[row][col];
        for (let j = 0; j < 2 * n; j++) aug[row][j] -= f * aug[col][j];
      }
    }
  }

  return aug.map(row => row.slice(n));
}

export function matPow(m: Matrix, exp: number): Matrix {
  const n = rows(m);
  if (cols(m) !== n) throw new Error('Square matrix required');
  exp = Math.round(exp);
  if (exp < 0) {
    return matPow(matInverse(m), -exp);
  }
  let result: Matrix = createMatrix(n, n);
  for (let i = 0; i < n; i++) result[i][i] = 1; // identity
  let base = m.map(r => [...r]);
  while (exp > 0) {
    if (exp % 2 === 1) result = matMul(result, base);
    base = matMul(base, base);
    exp = Math.floor(exp / 2);
  }
  return result;
}

export function matTrace(m: Matrix): number {
  const n = Math.min(rows(m), cols(m));
  let sum = 0;
  for (let i = 0; i < n; i++) sum += m[i][i];
  return sum;
}

export function matToString(m: Matrix, decimals = 6): string {
  return '[' + m.map(row =>
    '[' + row.map(v => +v.toPrecision(decimals)).join(', ') + ']'
  ).join(', ') + ']';
}
