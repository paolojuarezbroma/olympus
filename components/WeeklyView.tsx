
import React, { useState } from 'react';
import { LongevityPlan, ActivityType, PlanItem } from '../types';

interface WeeklyViewProps {
  plan: LongevityPlan;
  toggleComplete: (day: string, id: string) => void;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ plan, toggleComplete }) => {
  const [selectedItem, setSelectedItem] = useState<{item: PlanItem, day: string} | null>(null);

  return (
    <div className="space-y-16 animate-luxe pb-24">
      <div className="flex items-end justify-between border-b border-white/5 pb-12">
        <div>
          <h2 className="text-4xl font-cinzel font-black text-white">The <span className="text-[#C5A059]">Horizon</span></h2>
          <p className="text-gray-500 mt-2 uppercase text-[10px] font-bold tracking-[0.4em]">Integrated Bio-Logic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {plan.week.map((day) => (
          <div key={day.day} className="flex flex-col space-y-4">
            <div className="text-center pb-6">
              <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-[#C5A059]">{day.day}</h3>
            </div>
            <div className="flex-1 space-y-3">
              {day.items.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem({item, day: day.day})}
                  className={`p-5 rounded-2xl hairline-border cursor-pointer transition-all duration-300 hover:bg-white/[0.04] active:scale-95 ${
                    item.completed ? 'opacity-20 grayscale' : 'bg-white/[0.01]'
                  }`}
                >
                  <p className="text-[8px] font-black text-gray-600 mb-2">{item.time}</p>
                  <p className="text-[10px] font-bold text-white leading-tight uppercase tracking-widest truncate">{item.activity}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-700">
          <div className="bg-[#050505] w-full max-w-xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-16 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                   <p className="text-[10px] uppercase font-black tracking-[0.4em] text-[#C5A059]">{selectedItem.day} • {selectedItem.item.time}</p>
                   <h3 className="text-4xl font-cinzel font-black text-white">{selectedItem.item.activity}</h3>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-gray-600 hover:text-white transition-colors">
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-white/[0.01] hairline-border italic text-gray-400 text-lg leading-relaxed font-light">
                "{selectedItem.item.description}"
              </div>

              <button 
                onClick={() => {
                  toggleComplete(selectedItem.day, selectedItem.item.id);
                  setSelectedItem(null);
                }}
                className={`w-full py-5 rounded-full font-black uppercase tracking-[0.3em] text-[10px] transition-all ${
                  selectedItem.item.completed 
                  ? 'border border-red-500/20 text-red-500 hover:bg-red-500/5' 
                  : 'bg-[#C5A059] text-black hover:scale-[1.02]'
                }`}
              >
                {selectedItem.item.completed ? 'Reset Module' : 'Acknowledge Execution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyView;
