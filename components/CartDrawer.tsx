import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ChefHat, ArrowRight, CheckCircle2, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { CURRENCY } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onPlaceOrder: () => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity,
  onPlaceOrder,
  onClearCart
}) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Reset confirmation state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setShowClearConfirm(false);
    }
  }, [isOpen]);

  const handleCheckout = () => {
    setIsOrderPlaced(true);
    setTimeout(() => {
      onPlaceOrder();
      setIsOrderPlaced(false);
      onClose();
    }, 3000);
  };

  if (!isOpen && !isOrderPlaced) return null;

  return (
    <div className={`fixed inset-0 z-[60] flex items-end justify-center pointer-events-none`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`
        relative w-full max-w-[480px] bg-gray-900 rounded-t-3xl border-t border-white/10 shadow-2xl pointer-events-auto
        transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        
        {/* Handle Bar */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full" />

        {!isOrderPlaced ? (
          <div className="flex flex-col h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-serif font-bold text-white">Your Order</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 animate-fade-in-up">
                    <img 
                      src={item.fallbackImage} 
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover border border-white/10"
                    />
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-medium text-white text-lg leading-tight">{item.name}</h3>
                        <p className="text-white/50 text-xs mt-1">{item.description.substring(0, 30)}...</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-serif font-bold">{CURRENCY}{item.price * item.quantity}</span>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/10">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-white" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 bg-gray-900 border-t border-white/10 space-y-3">
                
                {!showClearConfirm ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60">Total Amount</span>
                      <span className="text-3xl font-serif font-bold text-white">{CURRENCY}{total}</span>
                    </div>

                    <button 
                      onClick={() => setShowClearConfirm(true)}
                      className="w-full py-2.5 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Cart
                    </button>
                    
                    <button 
                      onClick={handleCheckout}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white py-4 rounded-xl font-bold tracking-wide uppercase shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-2 group"
                    >
                      Place Order
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-fade-in-up">
                    <p className="text-red-200 text-sm font-medium mb-3 text-center">Are you sure you want to remove all items?</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => {
                          onClearCart();
                          setShowClearConfirm(false);
                        }}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors"
                      >
                        Yes, Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Success State */
          <div className="h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full animate-ping absolute inset-0" />
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center relative z-10 shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-white animate-pop" />
              </div>
            </div>
            
            <div className="space-y-2 animate-fade-in-up">
              <h3 className="text-3xl font-serif font-bold text-white">Order Placed!</h3>
              <p className="text-white/60">The kitchen has received your order.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl flex items-center gap-3 border border-white/10 max-w-xs animate-fade-in-up delay-200">
              <ChefHat className="w-6 h-6 text-emerald-400" />
              <div className="text-left">
                <p className="text-xs text-white/50 uppercase tracking-wider">Estimated Time</p>
                <p className="text-sm font-bold text-white">15-20 Minutes</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};