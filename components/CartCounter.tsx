import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';
import { CURRENCY } from '../constants';

interface CartCounterProps {
  cart: CartItem[];
  onClick: () => void;
}

export const CartCounter: React.FC<CartCounterProps> = ({ cart, onClick }) => {
  const [animate, setAnimate] = useState(false);
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    if (totalItems > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <button 
      onClick={onClick}
      className={`fixed top-6 left-6 z-50 transition-all duration-300 group ${animate ? 'scale-110' : 'scale-100 hover:scale-105'}`}
    >
      <div className={`
        glass-panel rounded-full pl-5 pr-4 py-2.5 flex items-center gap-3 shadow-2xl
        border-white/10 group-hover:bg-white/10 transition-colors
        ${animate ? 'bg-white/20 border-emerald-400/50' : ''}
      `}>
        <div className="relative">
          <ShoppingBag className={`w-5 h-5 ${animate ? 'text-emerald-300' : 'text-white'} transition-colors duration-300`} />
          <span className={`
            absolute -top-2 -right-2 
            bg-emerald-500 text-white text-[10px] font-bold 
            w-4 h-4 rounded-full flex items-center justify-center shadow-sm
            ${animate ? 'animate-pop' : ''}
          `}>
            {totalItems}
          </span>
        </div>
        <div className="h-4 w-[1px] bg-white/20"></div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] text-white/60 uppercase tracking-wider font-bold mb-0.5">Total</span>
          <span className="text-sm font-semibold text-white tracking-wide font-serif italic">
            {CURRENCY}{totalPrice}
          </span>
        </div>
        
        {/* Helper arrow to indicate clickability */}
        <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
      </div>
    </button>
  );
};