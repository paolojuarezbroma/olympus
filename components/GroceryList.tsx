
import React, { useState, useEffect } from 'react';
import { generateGroceryList } from '../geminiService';
import { LongevityPlan, GroceryItem } from '../types';

interface GroceryListProps {
  plan: LongevityPlan;
}

const GroceryList: React.FC<GroceryListProps> = ({ plan }) => {
  const [list, setList] = useState<{categories: GroceryItem[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    setIsLoading(true);
    const result = await generateGroceryList(plan);
    if (result) setList(result);
    setIsLoading(false);
  };

  const toggleItem = (item: string) => {
    const next = new Set(checkedItems);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    setCheckedItems(next);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-serif font-bold">Nutritional Inventory</h2>
          <p className="text-gray-400 mt-1">Sourcing the building blocks for your biological upgrade.</p>
        </div>
        {!list && (
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-xl transition-all hover:scale-105"
          >
            {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Generate Weekly List'}
          </button>
        )}
      </div>

      {!list && !isLoading && (
        <div className="p-20 text-center bg-[#111] rounded-[2.5rem] border border-white/5">
          <i className="fa-solid fa-cart-shopping text-6xl text-gray-700 mb-6"></i>
          <h3 className="text-xl font-bold mb-2">Ready to source?</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">Click below to generate a consolidated shopping list based on your current 7-day protocol.</p>
          <button onClick={handleGenerate} className="text-[#D4AF37] font-bold underline">Generate Now</button>
        </div>
      )}

      {isLoading && (
        <div className="p-20 text-center space-y-4">
          <i className="fa-solid fa-dna animate-pulse text-6xl text-[#D4AF37]"></i>
          <p className="text-gray-400 font-mono text-sm">EXTRACTING MICRONUTRIENTS...</p>
        </div>
      )}

      {list && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.categories.map((cat, idx) => (
            <div key={idx} className="bg-[#111] p-8 rounded-[2rem] border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-tag text-xs opacity-50"></i>
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.items.map((item, i) => (
                  <div 
                    key={i} 
                    onClick={() => toggleItem(item)}
                    className="flex items-center gap-4 cursor-pointer group"
                  >
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${checkedItems.has(item) ? 'bg-green-500 border-green-500' : 'border-white/10 bg-white/5 group-hover:border-[#D4AF37]'}`}>
                      {checkedItems.has(item) && <i className="fa-solid fa-check text-black text-xs"></i>}
                    </div>
                    <span className={`text-sm font-medium transition-all ${checkedItems.has(item) ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="md:col-span-2 flex justify-center pt-8">
            <button 
              onClick={() => setList(null)}
              className="text-gray-500 hover:text-white text-xs uppercase font-bold tracking-widest flex items-center gap-2"
            >
              <i className="fa-solid fa-rotate-right"></i>
              Reset List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryList;
