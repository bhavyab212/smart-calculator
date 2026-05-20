import React from 'react';
import { useCalcStore } from '../state/useCalcStore';
import type { AppMode } from '../state/useCalcStore';
import { 
  Home, 
  Calculator, 
  BarChart2, 
  Grid3X3, 
  Settings, 
  Code,
  Sigma,
  Table as TableIcon
} from 'lucide-react';

interface RailItem {
  id: AppMode | 'home' | 'settings_menu';
  label: string;
  icon: React.ReactNode;
}

export function LeftRailNav() {
  const { activeApp, setActiveApp, activeMenu, setActiveMenu } = useCalcStore();

  const menuItems: RailItem[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'calculate', label: 'Calculate', icon: <Calculator size={18} /> },
    { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} /> },
    { id: 'table', label: 'Table', icon: <TableIcon size={18} /> },
    { id: 'matrix', label: 'Matrix', icon: <Grid3X3 size={18} /> },
    { id: 'equation', label: 'Equation', icon: <Sigma size={18} /> },
    { id: 'complex', label: 'Complex', icon: <span className="font-serif font-bold text-sm">i</span> },
    { id: 'base-n', label: 'Base-N', icon: <span className="font-mono font-bold text-xs">1010</span> },
    { id: 'settings_menu', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const handleSelect = (item: RailItem) => {
    if (item.id === 'home') {
      setActiveMenu('home');
    } else if (item.id === 'settings_menu') {
      setActiveMenu('settings');
    } else {
      setActiveApp(item.id as AppMode);
      setActiveMenu(null);
    }
  };

  const isActive = (item: RailItem) => {
    if (item.id === 'home') return activeMenu === 'home';
    if (item.id === 'settings_menu') return activeMenu === 'settings';
    return activeApp === item.id && activeMenu === null;
  };

  return (
    <nav className="w-16 flex flex-col items-center py-4 bg-[#0d131f] border-r border-[#1e2633] h-full select-none gap-2 z-10">
      {menuItems.map((item) => {
        const active = isActive(item);
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg transition-all relative group ${
              active 
                ? 'bg-[#0088cc]/10 border border-[#0088cc] text-white shadow-[0_0_8px_rgba(0,136,204,0.2)]' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#141b27]/40'
            }`}
            title={item.label}
          >
            {/* Active indicator bar */}
            {active && (
              <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#0088cc] rounded-r" />
            )}
            
            <div className={`flex items-center justify-center ${active ? 'text-[#0088cc]' : 'text-gray-400 group-hover:text-white transition-colors'}`}>
              {item.icon}
            </div>
            
            <span className="text-[8px] font-sans font-medium mt-1 tracking-wide scale-90 group-hover:scale-95 transition-transform">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
