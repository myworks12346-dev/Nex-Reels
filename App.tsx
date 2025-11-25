import React, { useState, useRef, useEffect } from 'react';
import { MENU_ITEMS } from './constants';
import { MenuItem, CartItem } from './types';
import { DishPoster } from './components/DishPoster';
import { InfoOverlay } from './components/InfoOverlay';
import { CartCounter } from './components/CartCounter';
import { CartDrawer } from './components/CartDrawer';
import { NavigationHints } from './components/NavigationHints';
import { ChefChat } from './components/ChefChat';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatItem, setChatItem] = useState<MenuItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Scroll Snap Detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      if (index !== activeIndex && index >= 0 && index < MENU_ITEMS.length) {
        setActiveIndex(index);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => {
    setCart([]);
  };

  const openChat = (item: MenuItem) => {
    setChatItem(item);
    setIsChatOpen(true);
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden flex justify-center">
      
      {/* Mobile-sized container on desktop, full on mobile */}
      <div className="relative w-full max-w-[480px] h-full shadow-2xl bg-gray-900">
        
        {/* Main Scroll Container */}
        <div 
          ref={containerRef}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
        >
          {MENU_ITEMS.map((item, index) => (
            <div 
              key={item.id} 
              className="w-full h-full snap-start relative flex-shrink-0"
            >
              <DishPoster 
                item={item} 
                isActive={index === activeIndex} 
              />
              <InfoOverlay 
                item={item} 
                onAddToCart={addToCart}
                onOpenChat={openChat}
                isActive={index === activeIndex}
              />
            </div>
          ))}
        </div>

        {/* Global Overlays */}
        <CartCounter 
          cart={cart} 
          onClick={() => setIsCartOpen(true)}
        />
        
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onPlaceOrder={clearCart}
          onClearCart={clearCart}
        />

        <ChefChat 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          item={chatItem}
        />

        <NavigationHints activeIndex={activeIndex} totalItems={MENU_ITEMS.length} />

        {/* Top Gradient for status bar visibility */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Desktop Background Ambience (Visible on large screens only) */}
      <div className="hidden md:block absolute inset-0 -z-10 bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center">
           <p className="text-white/10 text-9xl font-bold font-serif select-none">MENU</p>
        </div>
      </div>
    </div>
  );
}