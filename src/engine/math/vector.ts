// ── Vector Engine ─────────────────────────────────────────────────────────────
// 2D and 3D vectors: VctA, VctB, VctC

export type Vector2D = [number, number];
export type Vector3D = [number, number, number];
export type Vector = Vector2D | Vector3D;

export function vecAdd(a: Vector, b: Vector): Vector {
  if (a.length !== b.length) throw new Error('Dimension mismatch');
  return a.map((v, i) => v + b[i]) as Vector;
}

export function vecSub(a: Vector, b: Vector): Vector {
  if (a.length !== b.length) throw new Error('Dimension mismatch');
  return a.map((v, i) => v - b[i]) as Vector;
}

export function vecScale(a: Vector, k: number): Vector {
  return a.map(v => v * k) as Vector;
}

export function vecMagnitude(a: Vector): number {
  return Math.sqrt(a.reduce((acc, v) => acc + v * v, 0));
}

export function vecUnit(a: Vector): Vector {
  const mag = vecMagnitude(a);
  if (mag === 0) throw new Error('Zero vector');
  return a.map(v => v / mag) as Vector;
}

export function vecDot(a: Vector, b: Vector): number {
  if (a.length !== b.length) throw new Error('Dimension mismatch');
  return a.reduce((acc, v, i) => acc + v * b[i], 0);
}

export function vecCross(a: Vector3D, b: Vector3D): Vector3D {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function vecAngle(a: Vector, b: Vector, unit: 'DEG' | 'RAD' | 'GRAD' = 'RAD'): number {
  const dot = vecDot(a, b);
  const mags = vecMagnitude(a) * vecMagnitude(b);
  if (mags === 0) throw new Error('Zero vector');
  const cosTheta = Math.max(-1, Math.min(1, dot / mags));
  const rad = Math.acos(cosTheta);
  if (unit === 'DEG') return rad * 180 / Math.PI;
  if (unit === 'GRAD') return rad * 200 / Math.PI;
  return rad;
}

export function vecToString(v: Vector, decimals = 6): string {
  return '(' + v.map(x => +x.toPrecision(decimals)).join(', ') + ')';
}
