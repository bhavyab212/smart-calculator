import React, { useEffect } from 'react';
import { useCalcStore } from './state/useCalcStore';
import { useKeyboard } from './hooks/useKeyboard';
import { Calculator } from './components/Calculator/Calculator';
import { GuidePanel } from './components/Guide/GuidePanel';

export default function App() {
  const { theme } = useCalcStore();

  // Apply theme class on mount + change
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Activate global keyboard handler
  useKeyboard();

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 select-none max-w-6xl mx-auto">
      <div className="w-full lg:w-auto flex justify-center">
        <GuidePanel />
      </div>
      <div className="w-full lg:w-auto flex justify-center">
        <Calculator />
      </div>
    </div>
  );
}
