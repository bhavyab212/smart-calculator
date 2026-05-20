import React from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { ChevronRight } from 'lucide-react';

export function SettingsWidget() {
  const { 
    angleUnit, 
    setAngleUnit,
    displayFormat,
    setDisplayFormat
  } = useCalcStore();

  const handleAngleToggle = () => {
    if (angleUnit === 'DEG') setAngleUnit('RAD');
    else if (angleUnit === 'RAD') setAngleUnit('GRAD');
    else setAngleUnit('DEG');
  };

  const handleDisplayToggle = () => {
    if (displayFormat === 'std') setDisplayFormat('sci');
    else if (displayFormat === 'sci') setDisplayFormat('eng');
    else setDisplayFormat('std');
  };

  const settingsRows = [
    { 
      label: 'Angle Unit', 
      value: angleUnit === 'DEG' ? 'DEG' : angleUnit === 'RAD' ? 'RAD' : 'GRAD', 
      onClick: handleAngleToggle 
    },
    { 
      label: 'Display Format', 
      value: displayFormat === 'std' ? 'Math' : displayFormat === 'sci' ? 'Sci' : 'Eng', 
      onClick: handleDisplayToggle 
    },
    { 
      label: 'Fraction Format', 
      value: 'a/b', 
      onClick: () => {} 
    },
    { 
      label: 'Complex Format', 
      value: 'a+bi', 
      onClick: () => {} 
    },
  ];

  return (
    <div className="w-full bg-[#0d131f] rounded-xl border border-[#1e2633] p-4 flex flex-col gap-3 font-sans">
      {/* Title */}
      <div className="border-b border-[#1e2633] pb-1.5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
          SETTINGS
        </h3>
      </div>

      {/* Rows */}
      <div className="flex flex-col border border-[#1e2633] rounded-lg divide-y divide-[#1e2633] overflow-hidden bg-[#090e15]/40">
        {settingsRows.map((row) => (
          <button
            key={row.label}
            onClick={row.onClick}
            className="flex justify-between items-center px-3 py-2.5 text-xs hover:bg-[#141b27]/40 transition-colors text-left w-full"
          >
            <span className="text-gray-400 font-medium">{row.label}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#0088cc] font-semibold font-mono">{row.value}</span>
              <ChevronRight size={14} className="text-gray-500" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
