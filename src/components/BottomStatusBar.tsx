import React from 'react';
import { useCalcStore } from '../state/useCalcStore';
import { Keyboard, Maximize } from 'lucide-react';

export function BottomStatusBar() {
  const { angleUnit } = useCalcStore();

  return (
    <footer className="w-full flex items-center justify-between px-6 py-2 border-t border-[#1e2633] bg-[#0b0f17] select-none text-xs text-gray-500 z-30 font-sans">
      {/* Left status indicators */}
      <div className="flex items-center gap-4">
        <span className="text-[#0088cc] font-semibold tracking-wide">
          {angleUnit}
        </span>
        <span className="text-gray-400">Norm 1</span>
        <span className="text-gray-400">Math</span>
      </div>

      {/* Middle status msg */}
      <div className="flex-1 text-center font-medium text-gray-400">
        Ready
      </div>

      {/* Right icons */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 hover:text-white transition-colors">
          <Keyboard size={14} />
          <span>Keyboard</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-white transition-colors">
          <Maximize size={14} />
          <span>Expand</span>
        </button>
      </div>
    </footer>
  );
}
