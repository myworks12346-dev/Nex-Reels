import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ChefHat, Loader2 } from 'lucide-react';
import { MenuItem, ChatMessage } from '../types';
import { askChefAboutDish } from '../services/geminiService';

interface ChefChatProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
}

export const ChefChat: React.FC<ChefChatProps> = ({ isOpen, onClose, item }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && item && messages.length === 0) {
      setMessages([{
        role: 'model',
        text: `Hello! I'm the chef. Ask me anything about the ${item.name}.`
      }]);
    }
    if (!isOpen) {
      // Optional: clear messages on close or keep history
      // setMessages([]); 
    }
  }, [isOpen, item]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !item) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const answer = await askChefAboutDish(item, userMsg.text);
    
    setMessages(prev => [...prev, { role: 'model', text: answer }]);
    setIsLoading(false);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      
      <div className="
        pointer-events-auto w-full max-w-[400px] bg-gray-900 
        h-[60vh] sm:h-[500px] sm:rounded-2xl rounded-t-2xl 
        flex flex-col shadow-2xl border border-white/10
        animate-fade-in-up
      ">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gray-800/50 sm:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 rounded-full">
              <ChefHat className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Ask the Chef</h3>
              <p className="text-xs text-white/50">{item.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/70">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white/10 text-white/90 rounded-bl-none border border-white/5'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                <span className="text-xs text-white/50">Chef is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-gray-900">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Is it spicy? Vegan options?"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-white/30"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="bg-emerald-500 disabled:opacity-50 hover:bg-emerald-400 text-white p-3 rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};