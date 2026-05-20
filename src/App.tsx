import React, { useEffect } from 'react';
import { useCalcStore } from './state/useCalcStore';
import { useKeyboard } from './hooks/useKeyboard';
import { Calculator } from './components/Calculator/Calculator';

export default function App() {
  const { theme } = useCalcStore();

  // Apply theme class on mount + change
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Activate global keyboard handler
  useKeyboard();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 select-none">
      <Calculator />
    </div>
  );
}
