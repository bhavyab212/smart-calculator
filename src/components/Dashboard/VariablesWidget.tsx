import React from 'react';
import { useCalcStore } from '../../state/useCalcStore';

export function VariablesWidget() {
  const { variables, ans, preAns } = useCalcStore();

  // Left column variables
  const leftVars = [
    { name: 'A', value: variables.A ?? 0 },
    { name: 'B', value: variables.B ?? 0 },
    { name: 'C', value: variables.C ?? 0 },
    { name: 'D', value: variables.D ?? 0 },
    { name: 'E', value: variables.E ?? 0 },
  ];

  // Right column variables / memory
  const rightVars = [
    { name: 'F', value: variables.F ?? 0 },
    { name: 'x', value: variables.x ?? 0 },
    { name: 'y', value: variables.y ?? 0 },
    { name: 'z', value: variables.z ?? 0 },
    { name: 'M', value: variables.M ?? 0 },
  ];

  const formatVal = (val: number) => {
    if (val === 0) return '0';
    if (Math.abs(val) < 1e-4 || Math.abs(val) > 1e6) {
      return val.toExponential(4);
    }
    return parseFloat(val.toFixed(6)).toString();
  };

  return (
    <div className="w-full bg-[#0d131f] rounded-xl border border-[#1e2633] p-4 flex flex-col gap-3 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#1e2633] pb-1.5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
          VARIABLES
        </h3>
      </div>

      {/* Grid containing list */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-mono">
        {/* Left Column */}
        <div className="flex flex-col gap-1.5 border-r border-[#1e2633]/60 pr-3">
          {leftVars.map((v) => (
            <div key={v.name} className="flex items-center text-gray-300">
              <span className="text-[#0088cc] font-semibold min-w-[16px]">{v.name}</span>
              <span className="mx-1 text-gray-500">=</span>
              <span className="text-white font-medium truncate max-w-[120px]" title={v.value.toString()}>
                {formatVal(v.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-1.5 pl-3">
          {rightVars.map((v) => (
            <div key={v.name} className="flex items-center text-gray-300">
              <span className="text-[#0088cc] font-semibold min-w-[16px]">{v.name}</span>
              <span className="mx-1 text-gray-500">=</span>
              <span className="text-white font-medium truncate max-w-[120px]" title={v.value.toString()}>
                {formatVal(v.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* View All Button at bottom right */}
      <div className="flex justify-end pt-1">
        <button className="text-[10px] bg-[#0c1017]/60 hover:bg-[#141b27]/80 px-2 py-1 rounded border border-[#1e2633] text-gray-400 hover:text-white transition-colors">
          View All
        </button>
      </div>
    </div>
  );
}
