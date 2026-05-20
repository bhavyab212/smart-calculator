import React, { useState } from 'react';
import { useCalcStore } from '../../state/useCalcStore';
import { Star, Trash2, List } from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const { history, setExpression } = useCalcStore();
  const [activeTab, setActiveTab] = useState<'All' | 'Math' | 'Stats' | 'Matrix' | 'Other'>('All');
  const [starredIndices, setStarredIndices] = useState<Record<number, boolean>>({});

  const toggleStar = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setStarredIndices(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleClearHistory = () => {
    // Clear history in store (we will clear expressions and simulate empty logs)
    useCalcStore.setState({ history: [] });
  };

  // Convert timestamp to hh:mm:ss format
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toTimeString().split(' ')[0];
  };

  const tabs = ['All', 'Math', 'Stats', 'Matrix', 'Other'] as const;

  return (
    <div className="flex flex-col h-full bg-[#0d131f] border-r border-[#1e2633] overflow-hidden select-none font-sans">
      {/* Title */}
      <div className="px-4 pt-4 pb-2 border-b border-[#1e2633] mb-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-200">
          HISTORY
        </h3>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-3 flex items-center justify-between border-b border-[#1e2633] gap-2">
        <div className="flex bg-[#090e15]/50 rounded-lg p-0.5 border border-[#1e2633] overflow-x-auto flex-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#0088cc]/15 border border-[#0088cc] text-white shadow-[0_0_6px_rgba(0,136,204,0.15)]'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="p-1 hover:text-white text-gray-500 rounded hover:bg-gray-800 transition-colors">
          <List size={14} />
        </button>
      </div>

      {/* History Items Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="text-xs text-gray-500 italic py-8 text-center">
            No history yet
          </div>
        ) : (
          history.map((entry, idx) => {
            const displayIdx = history.length - idx;
            const isStarred = starredIndices[idx] || false;
            return (
              <div 
                key={idx} 
                className="group flex flex-col gap-1.5 border-b border-[#1e2633]/60 pb-3 last:border-b-0 cursor-pointer"
                onClick={() => setExpression(entry.expression)}
              >
                {/* Meta details */}
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#0088cc] font-bold">#{displayIdx}</span>
                    <span>{entry.timestamp ? formatTime(entry.timestamp) : '00:00:00'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>DEG</span>
                    <button 
                      onClick={(e) => toggleStar(e, idx)} 
                      className={`hover:text-amber-400 transition-colors p-0.5 rounded ${
                        isStarred ? 'text-amber-400' : 'text-gray-600 group-hover:text-gray-400'
                      }`}
                    >
                      <Star size={12} fill={isStarred ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Expression */}
                <div className="font-mono text-xs text-white truncate pl-4 pr-2">
                  {entry.expression}
                </div>

                {/* Result */}
                <div className="font-mono text-sm font-bold text-[#0088cc] text-left pl-4 pr-2">
                  = {entry.result}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clear controls */}
      <div className="p-4 border-t border-[#1e2633] flex gap-2 bg-[#090e15]/40">
        <button
          onClick={handleClearHistory}
          disabled={history.length === 0}
          className="flex-1 flex justify-center items-center py-2 text-xs font-semibold rounded-lg bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Clear History
        </button>
        <button
          onClick={handleClearHistory}
          disabled={history.length === 0}
          className="p-2 border border-red-950 bg-red-950/20 hover:bg-red-900/30 text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-lg"
          title="Delete All"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
