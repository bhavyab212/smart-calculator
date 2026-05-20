import React, { useState } from 'react';
import { useCalcStore } from '../state/useCalcStore';
import { Sun, Moon, Volume2, VolumeX, Smartphone, HelpCircle, Maximize2, Minimize2 } from 'lucide-react';

export function TopHeaderBar() {
  const { 
    angleUnit, 
    setAngleUnit, 
    theme, 
    toggleTheme, 
    soundEnabled, 
    toggleSound 
  } = useCalcStore();

  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [normFormat, setNormFormat] = useState<'Norm 1' | 'Norm 2' | 'Norm 3'>('Norm 1');

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error enabling fullscreen", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 border-b border-[#1e2633] bg-[#0b0f17] select-none text-sm z-30 font-sans">
      {/* Brand Logo & Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-base tracking-wider text-white">
            CASIO <span className="font-medium text-gray-300">FX-991CW</span>
          </h1>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-gray-600 bg-gray-800 text-gray-400 font-mono font-bold scale-90">
            CLASSWIZ
          </span>
        </div>
        <p className="text-[9px] text-gray-500 font-medium tracking-wide">
          Advanced Scientific Calculator
        </p>
      </div>

      {/* Interactive Tabs (Angle & Format) */}
      <div className="flex items-center gap-8">
        {/* Angle Units */}
        <div className="flex items-center gap-4">
          {(['DEG', 'RAD', 'GRAD'] as const).map((unit) => {
            const isActive = angleUnit === unit;
            return (
              <button
                key={unit}
                onClick={() => setAngleUnit(unit)}
                className={`text-xs font-bold transition-all px-1 pb-1 border-b-2 ${
                  isActive
                    ? 'border-[#0088cc] text-[#0088cc]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {unit === 'DEG' ? 'Deg' : unit === 'RAD' ? 'Rad' : 'Grad'}
              </button>
            );
          })}
        </div>

        {/* Norm Formats */}
        <div className="flex items-center gap-2">
          {(['Norm 1', 'Norm 2', 'Norm 3'] as const).map((norm) => {
            const isActive = normFormat === norm;
            return (
              <button
                key={norm}
                onClick={() => setNormFormat(norm)}
                className={`text-xs font-bold transition-all px-3 py-1 rounded border ${
                  isActive
                    ? 'border-[#0088cc] bg-[#0088cc]/10 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {norm === 'Norm 3' ? 'Norm ∞' : norm}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-5 text-gray-400 font-medium text-xs">
        {/* Theme Toggle */}
        <div className="flex items-center gap-1.5 pr-2">
          <span className="text-gray-500">Theme</span>
          <button
            onClick={toggleTheme}
            className="p-1 hover:text-white rounded hover:bg-gray-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Moon size={14} className="text-sky-400" /> : <Sun size={14} className="text-amber-400" />}
          </button>
        </div>

        {/* Sound Toggle */}
        <div className="flex items-center gap-1.5 pr-2">
          <span className="text-gray-500">Sound</span>
          <button
            onClick={toggleSound}
            className="p-1 hover:text-white rounded hover:bg-gray-800 transition-colors"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={14} className="text-sky-400" /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Haptic Toggle */}
        <div className="flex items-center gap-1.5 pr-2">
          <span className="text-gray-500">Haptic</span>
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className="p-1 hover:text-white rounded hover:bg-gray-800 transition-colors"
            title="Toggle Haptic"
          >
            <Smartphone size={14} className={hapticEnabled ? 'text-sky-400' : ''} />
          </button>
        </div>

        {/* Help icon */}
        <button className="p-1 hover:text-white rounded hover:bg-gray-800 transition-colors">
          <HelpCircle size={14} />
        </button>

        {/* Fullscreen Expand toggle */}
        <button 
          onClick={toggleFullscreen} 
          className="p-1 hover:text-white rounded hover:bg-gray-800 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </header>
  );
}
