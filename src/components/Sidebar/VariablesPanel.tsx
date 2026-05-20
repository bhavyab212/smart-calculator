import React from 'react';
import { useCalcStore } from '../../state/useCalcStore';

export const VariablesPanel: React.FC = () => {
  const { variables, ans, preAns, memory } = useCalcStore();

  const renderVarRow = (label: string, value: number, isSpecial = false) => (
    <div className="flex justify-between items-center py-1.5 px-2 hover:bg-[rgba(188,19,254,0.05)] rounded border border-transparent hover:border-[#3a494b]/50 transition-colors">
      <span className={`font-mono text-xs ${isSpecial ? 'text-[#bc13fe]' : 'text-[#b9cacb]'}`}>{label}</span>
      <span className="font-mono text-xs text-[#00f2ff] truncate max-w-[120px]">{value}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#050508]/40 overflow-hidden">
      <div className="px-4 py-2 border-b border-[#3a494b] bg-gradient-to-r from-[rgba(188,19,254,0.05)] to-transparent">
        <h3 className="text-xs font-semibold tracking-wider text-[#bc13fe] uppercase">Variables</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-0.5">
          {renderVarRow('Ans', ans, true)}
          {renderVarRow('PreAns', preAns, true)}
          {renderVarRow('M (Memory)', memory, true)}
          <div className="my-2 border-t border-[#3a494b]/50"></div>
          {Object.entries(variables).map(([name, value]) => {
             // Don't duplicate M since we show it above
             if (name === 'M') return null;
             return renderVarRow(name, value);
          })}
        </div>
      </div>
    </div>
  );
};
