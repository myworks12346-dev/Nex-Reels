import React from 'react';
import { MenuItem } from '../types';

interface DishPosterProps {
  item: MenuItem;
  isActive: boolean;
}

export const DishPoster: React.FC<DishPosterProps> = ({ item, isActive }) => {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      {/* Background Image with slow cinematic drift */}
      <img 
        src={item.fallbackImage} 
        alt={item.name} 
        className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear will-change-transform ${isActive ? 'scale-110' : 'scale-100'}`}
      />
      
      {/* Refined Gradients - Clean at top, fading at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
    </div>
  );
};