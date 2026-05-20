import React from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import type { AppMode } from '../../state/useCalcStore';
import { 
  Home, 
  BarChart2, 
  TrendingUp, 
  Table, 
  Sigma, 
  Grid3X3, 
  Play, 
  Binary,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AppDef {
  id: AppMode;
  num: string;
  label: string;
  icon: React.ReactNode;
}

export function MainMenuWidget() {
  const { activeApp, setActiveApp, setActiveMenu } = useCalcStore();

  const apps: AppDef[] = [
    { id: 'calculate', num: '1', label: 'Calculate', icon: <Home size={18} /> },
    { id: 'statistics', num: '2', label: 'Statistics', icon: <BarChart2 size={18} /> },
    { id: 'distribution', num: '3', label: 'Distribution', icon: <TrendingUp size={18} /> },
    { id: 'table', num: '4', label: 'Table', icon: <Table size={18} /> },
    { id: 'equation', num: '5', label: 'Equation', icon: <span className="font-mono text-sm">x=0</span> },
    { id: 'matrix', num: '6', label: 'Matrix', icon: <Grid3X3 size={18} /> },
    { id: 'vector', num: '7', label: 'Vector', icon: <Play size={18} className="rotate-45" /> },
    { id: 'complex', num: '8', label: 'Complex', icon: <span className="font-serif italic font-bold text-sm">i</span> },
    { id: 'base-n', num: '9', label: 'Base-N', icon: <span className="font-mono font-bold text-[10px]">1010</span> },
    { id: 'equation', num: 'A', label: 'Polynomial', icon: <span className="font-serif italic font-bold text-sm">x²</span> },
    { id: 'inequality', num: 'B', label: 'Inequality', icon: <span className="font-mono font-bold text-sm">&lt;</span> },
    { id: 'ratio', num: 'C', label: 'Ratio', icon: <span className="font-bold text-sm">a:b</span> },
  ];

  const handleSelect = (appId: AppMode) => {
    setActiveApp(appId);
    setActiveMenu(null);
  };

  return (
    <div className="w-full bg-[#0d131f] rounded-xl border border-[#1e2633] p-4 flex flex-col gap-3">
      {/* Title */}
      <div className="flex justify-between items-center border-b border-[#1e2633] pb-1.5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
          MAIN MENU
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {apps.map((app, idx) => {
          const isSelected = activeApp === app.id;
          return (
            <button
              key={`${app.id}-${idx}`}
              onClick={() => handleSelect(app.id)}
              className={`flex flex-col items-center justify-between p-2 rounded-lg border transition-all h-20 ${
                isSelected
                  ? 'border-[#0088cc] bg-[#0088cc]/10 text-white shadow-[0_0_10px_rgba(0,136,204,0.3)]'
                  : 'border-[#1e2633] bg-[#090e15]/50 hover:bg-[#141b27]/80 text-gray-400 hover:text-white'
              }`}
            >
              {/* Icon */}
              <div className={`flex-1 flex items-center justify-center ${isSelected ? 'text-[#0088cc]' : 'text-gray-500'}`}>
                {app.icon}
              </div>

              {/* Title label */}
              <div className="text-[9px] font-sans text-center font-medium leading-tight truncate w-full">
                <span className="opacity-60 font-mono mr-1">{app.num}</span>
                {app.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination indicators with chevrons */}
      <div className="flex justify-between items-center mt-1 px-1">
        <button className="text-gray-500 hover:text-white transition-colors">
          <ChevronLeft size={14} />
        </button>
        <div className="flex justify-center items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0088cc]" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
