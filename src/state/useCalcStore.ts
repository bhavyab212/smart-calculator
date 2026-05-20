import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AngleUnit } from '../engine/math/types';
import type { DisplayFormat } from '../engine/math/arithmetic';
import type { Matrix } from '../engine/math/matrix';
import type { Vector } from '../engine/math/vector';

// ── Types ─────────────────────────────────────────────────────────────────────

export type AppMode =
  | 'calculate' | 'statistics' | 'distribution' | 'spreadsheet'
  | 'table' | 'equation' | 'inequality' | 'complex'
  | 'base-n' | 'matrix' | 'vector' | 'ratio' | 'mathbox';

export type MenuType = 'home' | 'catalog' | 'tools' | 'format' | 'settings' | null;

export type ShiftState = 'none' | 'shift' | 'alpha';

export interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalcState {
  // App
  activeApp: AppMode;
  setActiveApp: (app: AppMode) => void;

  // Expression
  expression: string;
  cursorPos: number;
  setExpression: (expr: string) => void;
  setCursorPos: (pos: number) => void;
  insertAtCursor: (text: string) => void;
  deleteAtCursor: () => void;
  clearExpression: () => void;

  // Results
  result: string;
  setResult: (r: string) => void;
  isError: boolean;
  setIsError: (v: boolean) => void;

  // History
  history: HistoryEntry[];
  addToHistory: (expr: string, result: string) => void;
  historyIndex: number;
  setHistoryIndex: (i: number) => void;

  // Memory & Variables
  memory: number;
  setMemory: (v: number) => void;
  memoryAdd: (v: number) => void;
  memorySub: (v: number) => void;
  variables: Record<string, number>;
  setVariable: (name: string, value: number) => void;
  ans: number;
  setAns: (v: number) => void;
  preAns: number;
  setPreAns: (v: number) => void;

  // Settings
  angleUnit: AngleUnit;
  setAngleUnit: (u: AngleUnit) => void;
  displayFormat: DisplayFormat;
  setDisplayFormat: (f: DisplayFormat) => void;
  fixDigits: number;
  setFixDigits: (n: number) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;

  // Modifier Keys
  shiftState: ShiftState;
  setShiftState: (s: ShiftState) => void;
  toggleShift: () => void;
  toggleAlpha: () => void;

  // Menu
  activeMenu: MenuType;
  setActiveMenu: (m: MenuType) => void;
  menuFocusIndex: number;
  setMenuFocusIndex: (i: number) => void;

  // Matrix store (MatA, MatB, MatC)
  matrices: Record<string, Matrix>;
  setMatrix: (name: string, m: Matrix) => void;

  // Vector store (VctA, VctB, VctC)
  vectors: Record<string, Vector>;
  setVector: (name: string, v: Vector) => void;

  // Base-N
  baseNMode: 2 | 8 | 10 | 16;
  setBaseNMode: (b: 2 | 8 | 10 | 16) => void;

  // Stats data (persists within session)
  statsData: { x: number[]; y: number[]; freq: number[] };
  setStatsData: (d: { x: number[]; y: number[]; freq: number[] }) => void;

  // Reset
  resetAll: () => void;
}

const DEFAULT_VARIABLES: Record<string, number> = {
  A: 0, B: 0, C: 0, D: 0, E: 0, F: 0,
  x: 0, y: 0, z: 0, M: 0,
};

export const useCalcStore = create<CalcState>()(
  persist(
    (set, get) => ({
      // App
      activeApp: 'calculate',
      setActiveApp: (app) => set({ activeApp: app, activeMenu: null, expression: '', result: '', cursorPos: 0 }),

      // Expression
      expression: '',
      cursorPos: 0,
      setExpression: (expr) => set({ expression: expr, cursorPos: expr.length }),
      setCursorPos: (pos) => set({ cursorPos: pos }),
      insertAtCursor: (text) => set((s) => {
        const expr = s.expression.slice(0, s.cursorPos) + text + s.expression.slice(s.cursorPos);
        return { expression: expr, cursorPos: s.cursorPos + text.length };
      }),
      deleteAtCursor: () => set((s) => {
        if (s.cursorPos === 0) return s;
        const expr = s.expression.slice(0, s.cursorPos - 1) + s.expression.slice(s.cursorPos);
        return { expression: expr, cursorPos: s.cursorPos - 1 };
      }),
      clearExpression: () => set({ expression: '', cursorPos: 0, result: '', isError: false }),

      // Results
      result: '',
      setResult: (r) => set({ result: r }),
      isError: false,
      setIsError: (v) => set({ isError: v }),

      // History
      history: [],
      historyIndex: -1,
      addToHistory: (expr, result) => set((s) => ({
        history: [{ expression: expr, result, timestamp: Date.now() }, ...s.history].slice(0, 50),
        historyIndex: -1,
      })),
      setHistoryIndex: (i) => set({ historyIndex: i }),

      // Memory
      memory: 0,
      setMemory: (v) => set({ memory: v, variables: { ...get().variables, M: v } }),
      memoryAdd: (v) => set((s) => ({ memory: s.memory + v, variables: { ...s.variables, M: s.memory + v } })),
      memorySub: (v) => set((s) => ({ memory: s.memory - v, variables: { ...s.variables, M: s.memory - v } })),
      variables: { ...DEFAULT_VARIABLES },
      setVariable: (name, value) => set((s) => ({ variables: { ...s.variables, [name]: value } })),
      ans: 0,
      setAns: (v) => set((s) => ({ preAns: s.ans, ans: v })),
      preAns: 0,
      setPreAns: (v) => set({ preAns: v }),

      // Settings
      angleUnit: 'DEG',
      setAngleUnit: (u) => set({ angleUnit: u }),
      displayFormat: 'std',
      setDisplayFormat: (f) => set({ displayFormat: f }),
      fixDigits: 9,
      setFixDigits: (n) => set({ fixDigits: n }),
      theme: 'dark',
      toggleTheme: () => set((s) => {
        const newTheme = s.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('light', newTheme === 'light');
        return { theme: newTheme };
      }),
      soundEnabled: false,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),

      // Modifier keys
      shiftState: 'none',
      setShiftState: (state) => set({ shiftState: state }),
      toggleShift: () => set((s) => ({ shiftState: s.shiftState === 'shift' ? 'none' : 'shift' })),
      toggleAlpha: () => set((s) => ({ shiftState: s.shiftState === 'alpha' ? 'none' : 'alpha' })),

      // Menu
      activeMenu: null,
      setActiveMenu: (m) => set({ activeMenu: m, menuFocusIndex: 0 }),
      menuFocusIndex: 0,
      setMenuFocusIndex: (i) => set({ menuFocusIndex: i }),

      // Matrices
      matrices: {
        MatA: [[0, 0], [0, 0]],
        MatB: [[0, 0], [0, 0]],
        MatC: [[0, 0], [0, 0]],
      },
      setMatrix: (name, m) => set((s) => ({ matrices: { ...s.matrices, [name]: m } })),

      // Vectors
      vectors: {
        VctA: [0, 0, 0],
        VctB: [0, 0, 0],
        VctC: [0, 0, 0],
      },
      setVector: (name, v) => set((s) => ({ vectors: { ...s.vectors, [name]: v } })),

      // Base-N
      baseNMode: 10,
      setBaseNMode: (b) => set({ baseNMode: b }),

      // Stats
      statsData: { x: [], y: [], freq: [] },
      setStatsData: (d) => set({ statsData: d }),

      // Reset
      resetAll: () => set({
        expression: '', cursorPos: 0, result: '', isError: false,
        history: [], historyIndex: -1,
        memory: 0, variables: { ...DEFAULT_VARIABLES },
        ans: 0, preAns: 0,
        angleUnit: 'DEG', displayFormat: 'std', fixDigits: 9,
        shiftState: 'none', activeMenu: null,
        matrices: {
          MatA: [[0,0],[0,0]], MatB: [[0,0],[0,0]], MatC: [[0,0],[0,0]],
        },
        vectors: { VctA: [0,0,0], VctB: [0,0,0], VctC: [0,0,0] },
        baseNMode: 10, statsData: { x: [], y: [], freq: [] },
      }),
    }),
    {
      name: 'casio-fx991cw-store',
      partialize: (s) => ({
        variables: s.variables,
        memory: s.memory,
        ans: s.ans,
        preAns: s.preAns,
        angleUnit: s.angleUnit,
        displayFormat: s.displayFormat,
        fixDigits: s.fixDigits,
        theme: s.theme,
        soundEnabled: s.soundEnabled,
        matrices: s.matrices,
        vectors: s.vectors,
      }),
    }
  )
);
