// ── Base-N Engine ─────────────────────────────────────────────────────────────

export type Base = 2 | 8 | 10 | 16;

export function toBase(n: number, base: Base): string {
  if (!Number.isInteger(n)) throw new Error('Integer required');
  const neg = n < 0;
  n = Math.abs(n);
  let result = n.toString(base).toUpperCase();
  return neg ? '-' + result : result;
}

export function fromBase(s: string, base: Base): number {
  const n = parseInt(s.replace(/-/g, ''), base);
  if (isNaN(n)) throw new Error('Invalid input');
  return s.startsWith('-') ? -n : n;
}

// Converts a decimal integer to display in all 4 bases
export interface BaseNDisplay {
  bin: string;
  oct: string;
  dec: string;
  hex: string;
}

export function toAllBases(n: number): BaseNDisplay {
  n = Math.round(n);
  return {
    bin: toBase(n, 2),
    oct: toBase(n, 8),
    dec: String(n),
    hex: toBase(n, 16),
  };
}

// Bitwise Operations (using 32-bit signed integers)
function int32(n: number): number { return n | 0; }

export function bitwiseAnd(a: number, b: number): number { return int32(a) & int32(b); }
export function bitwiseOr(a: number, b: number): number  { return int32(a) | int32(b); }
export function bitwiseXor(a: number, b: number): number { return int32(a) ^ int32(b); }
export function bitwiseNot(a: number): number            { return ~int32(a); }
export function bitwiseXnor(a: number, b: number): number { return ~(int32(a) ^ int32(b)); }
export function bitwiseXand(a: number, b: number): number { return ~(int32(a) | int32(b)); } // NOR
export function bitwiseNeg(a: number): number             { return -int32(a); } // two's complement

export function bitwiseArithmetic(
  a: number, b: number,
  op: 'AND' | 'OR' | 'XOR' | 'XNOR' | 'XAND'
): number {
  switch (op) {
    case 'AND':  return bitwiseAnd(a, b);
    case 'OR':   return bitwiseOr(a, b);
    case 'XOR':  return bitwiseXor(a, b);
    case 'XNOR': return bitwiseXnor(a, b);
    case 'XAND': return bitwiseXand(a, b);
  }
}
