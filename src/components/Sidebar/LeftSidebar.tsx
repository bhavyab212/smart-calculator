import React from 'react';
import { HistoryPanel } from './HistoryPanel';
import { VariablesPanel } from './VariablesPanel';

export const LeftSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col w-64 xl:w-72 glass-panel rounded-xl overflow-hidden shadow-2xl h-full max-h-[800px] border border-[rgba(0,242,255,0.15)]">
      <div className="flex-1 overflow-hidden h-1/2">
        <HistoryPanel />
      </div>
      <div className="flex-1 overflow-hidden h-1/2 border-t border-[rgba(188,19,254,0.15)]">
        <VariablesPanel />
      </div>
    </div>
  );
};
