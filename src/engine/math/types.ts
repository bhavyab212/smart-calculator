// ── Math Engine Types ────────────────────────────────────────────────────────

export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

export interface CalcContext {
  angleUnit: AngleUnit;
  variables: Record<string, number | Complex>;
  ans: number | Complex;
  preAns: number | Complex;
}

export interface Complex {
  re: number;
  im: number;
}

export function isComplex(v: unknown): v is Complex {
  return typeof v === 'object' && v !== null && 're' in v && 'im' in v;
}

export interface CalcResult {
  value: number | Complex;
  display: string;      // formatted for LCD
  exact?: string;       // fraction or simplified form
  isError: boolean;
  errorMsg?: string;
}

// ── Angle Conversions ────────────────────────────────────────────────────────

export function toRadians(x: number, unit: AngleUnit): number {
  if (unit === 'RAD') return x;
  if (unit === 'DEG') return x * Math.PI / 180;
  return x * Math.PI / 200; // GRAD
}

export function fromRadians(x: number, unit: AngleUnit): number {
  if (unit === 'RAD') return x;
  if (unit === 'DEG') return x * 180 / Math.PI;
  return x * 200 / Math.PI; // GRAD
}

// Convert decimal degrees to DMS string
export function toDMS(deg: number): string {
  const sign = deg < 0 ? '-' : '';
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const mFull = (abs - d) * 60;
  const m = Math.floor(mFull);
  const s = (mFull - m) * 60;
  return `${sign}${d}°${m}'${s.toFixed(4)}"`;
}

// Convert DMS string to decimal degrees
export function fromDMS(dms: string): number {
  // Expected format: D.MMSS where D=degrees, MM=minutes, SS=seconds
  const n = parseFloat(dms);
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  const d = Math.floor(abs);
  const rest = (abs - d) * 100;
  const m = Math.floor(rest);
  const s = (rest - m) * 100;
  return sign * (d + m / 60 + s / 3600);
}
