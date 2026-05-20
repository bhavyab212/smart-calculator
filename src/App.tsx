import React, { useEffect } from 'react';
import { useCalcStore } from './state/useCalcStore';
import { useKeyboard } from './hooks/useKeyboard';
import { TopHeaderBar } from './components/TopHeaderBar';
import { LeftRailNav } from './components/LeftRailNav';
import { HistoryPanel } from './components/Sidebar/HistoryPanel';
import { Calculator } from './components/Calculator/Calculator';
import { MainMenuWidget } from './components/Dashboard/MainMenuWidget';
import { VariablesWidget } from './components/Dashboard/VariablesWidget';
import { SettingsWidget } from './components/Dashboard/SettingsWidget';
import { BottomStatusBar } from './components/BottomStatusBar';

export default function App() {
  const { theme } = useCalcStore();

  // Apply theme class on mount + change
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Activate global keyboard handler
  useKeyboard();

    return (
      <div className="h-screen w-screen flex flex-col bg-[#0b0f17] text-white overflow-hidden font-sans">
        {/* Top Header Navigation bar */}
        <TopHeaderBar />
  
        {/* Main dashboard content container */}
        <div className="flex flex-1 w-full overflow-hidden">
          {/* Left vertical navigation rail */}
          <LeftRailNav />
  
          {/* Left column history list */}
          <div className="hidden lg:block w-72 h-full flex-shrink-0">
            <HistoryPanel />
          </div>
  
          {/* Center column: Casio fx-991CW hardware simulator */}
          <main className="flex-1 bg-[#090e15] flex items-center justify-center p-6 overflow-y-auto">
            <Calculator />
          </main>
  
          {/* Right column: dashboard menu cards & variable settings */}
          <aside className="hidden xl:flex w-[380px] h-full flex-shrink-0 bg-[#0b0f17] border-l border-[#1e2633] p-4 flex-col gap-4 overflow-y-auto select-none">
          <MainMenuWidget />
          <VariablesWidget />
          <SettingsWidget />
        </aside>
      </div>

      {/* Bottom Status bar */}
      <BottomStatusBar />
    </div>
  );
}
