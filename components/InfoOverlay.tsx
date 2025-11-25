import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { CURRENCY } from '../constants';
import { Flame, Leaf, Candy, Info, ChefHat, Heart, MessageCircle, Volume2, Plus, Share2 } from 'lucide-react';
import { getAIRecommendationDetails, playDishDescription } from '../services/geminiService';

interface InfoOverlayProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onOpenChat: (item: MenuItem) => void;
  isActive: boolean;
}

export const InfoOverlay: React.FC<InfoOverlayProps> = ({ item, onAddToCart, onOpenChat, isActive }) => {
  const [aiTip, setAiTip] = useState<string>("");
  const [liked, setLiked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Fetch AI recommendation when this card becomes active
  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout>;

    // Only fetch if active, no existing tip, and user stays on card for 1s (Debounce)
    if (isActive && !aiTip) {
      timer = setTimeout(() => {
        getAIRecommendationDetails(item).then(text => {
          if (isMounted) {
            setAiTip(text);
          }
        });
      }, 1000); 
    }

    return () => { 
      isMounted = false; 
      clearTimeout(timer);
    };
  }, [isActive, item, aiTip]);

  const handlePlayAudio = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await playDishDescription(item);
    setTimeout(() => setIsPlayingAudio(false), 5000);
  };

  const getTasteIcon = (taste: string) => {
    switch(taste) {
      case 'Spicy': return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'Sweet': return <Candy className="w-3.5 h-3.5 text-pink-400" />;
      case 'Savoury': return <Leaf className="w-3.5 h-3.5 text-green-400" />;
      default: return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-end">
      
      {/* Right Action Bar (TikTok Style) */}
      <div className={`absolute right-4 bottom-24 flex flex-col items-center gap-5 pointer-events-auto transition-all duration-700 ease-out ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        
        {/* Like Button */}
        <div className="flex flex-col items-center gap-1 group">
          <button 
            onClick={() => setLiked(!liked)}
            className={`p-3 rounded-full glass-panel border border-white/10 active:scale-90 transition-all duration-300 ${liked ? 'bg-red-500/20 border-red-500/50' : 'hover:bg-white/10'}`}
          >
            <Heart className={`w-7 h-7 ${liked ? 'fill-red-500 text-red-500' : 'text-white'} transition-colors duration-300 drop-shadow-sm`} />
          </button>
          <span className="text-[10px] font-medium text-white/90 drop-shadow-md tracking-wide">Like</span>
        </div>

        {/* Chat / Ask Chef */}
        <div className="flex flex-col items-center gap-1 group">
          <button 
            onClick={() => onOpenChat(item)}
            className="p-3 rounded-full glass-panel border border-white/10 hover:bg-white/10 active:scale-90 transition-all duration-300"
          >
            <MessageCircle className="w-7 h-7 text-white drop-shadow-sm" />
          </button>
          <span className="text-[10px] font-medium text-white/90 drop-shadow-md tracking-wide">Chef</span>
        </div>

        {/* Audio Description */}
        <div className="flex flex-col items-center gap-1 group">
          <button 
            onClick={handlePlayAudio}
            className={`p-3 rounded-full glass-panel border border-white/10 hover:bg-white/10 active:scale-90 transition-all duration-300 ${isPlayingAudio ? 'animate-pulse border-emerald-400/50 bg-emerald-500/20' : ''}`}
          >
            <Volume2 className={`w-7 h-7 ${isPlayingAudio ? 'text-emerald-300' : 'text-white'} drop-shadow-sm`} />
          </button>
          <span className="text-[10px] font-medium text-white/90 drop-shadow-md tracking-wide">Hear</span>
        </div>

         {/* Share (Dummy) */}
         <div className="flex flex-col items-center gap-1 group">
          <button className="p-3 rounded-full glass-panel border border-white/10 hover:bg-white/10 active:scale-90 transition-all duration-300">
            <Share2 className="w-7 h-7 text-white drop-shadow-sm" />
          </button>
          <span className="text-[10px] font-medium text-white/90 drop-shadow-md tracking-wide">Share</span>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div 
        key={isActive ? 'active' : 'inactive'} 
        className={`px-6 pb-10 pt-16 pointer-events-auto w-[85%] transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex flex-col gap-3">
          
          {/* Tags */}
          <div className={`flex items-center gap-2 ${isActive ? 'animate-fade-in-up' : ''}`}>
             <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
                {getTasteIcon(item.taste)}
                <span className="text-[10px] uppercase tracking-widest font-bold text-white">{item.taste}</span>
             </div>
          </div>

          {/* Title & Price */}
          <div className={`flex flex-col gap-1 mt-1 ${isActive ? 'animate-fade-in-up delay-[100ms]' : ''}`}>
            <h2 className="text-4xl font-serif font-medium text-white leading-[0.9] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-tight">
              {item.name}
            </h2>
            <div className="text-xl font-light text-emerald-300 font-serif italic drop-shadow-md">
               {CURRENCY}{item.price}
             </div>
          </div>
          
           {/* Description */}
          <div className={`mt-1 ${isActive ? 'animate-fade-in-up delay-[200ms]' : ''}`}>
             <p className="text-white/80 text-sm font-light leading-relaxed drop-shadow-md line-clamp-3">
              {item.description}
            </p>
          </div>

          {/* Add to Cart Button (Primary) */}
          <button 
            onClick={() => onAddToCart(item)}
            className={`
              mt-3 flex items-center justify-center gap-2 w-full py-3.5
              bg-white text-black font-bold rounded-2xl shadow-xl shadow-black/20
              hover:bg-gray-50 active:scale-[0.98] transition-all
              ${isActive ? 'animate-fade-in-up delay-[300ms]' : ''}
            `}
          >
            <Plus className="w-5 h-5" />
            <span className="tracking-wide text-sm">ADD TO ORDER</span>
          </button>
          
           {/* AI Tip Snippet (Small) */}
          {aiTip && (
             <div className={`mt-2 flex items-center gap-2 text-xs text-white/60 ${isActive ? 'animate-fade-in-up delay-[400ms]' : ''}`}>
                <ChefHat className="w-3 h-3 text-indigo-300" />
                <span className="italic font-light">{aiTip}</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};