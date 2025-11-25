import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NavigationHintsProps {
  activeIndex: number;
  totalItems: number;
}

export const NavigationHints: React.FC<NavigationHintsProps> = ({ activeIndex, totalItems }) => {
  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 items-center pointer-events-none">
      {/* Scroll Indicators dots */}
      <div className="glass-panel p-1.5 rounded-full flex flex-col gap-2">
        {Array.from({ length: totalItems }).map((_, i) => (
          <div 
            key={i} 
            className={`w-1 rounded-full transition-all duration-500 ease-out ${i === activeIndex ? 'h-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'h-1.5 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};