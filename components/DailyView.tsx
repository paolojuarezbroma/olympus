
import React from 'react';
import { LongevityPlan, ActivityType } from '../types';

interface DailyViewProps {
  plan: LongevityPlan;
  toggleComplete: (day: string, id: string) => void;
}

const DailyView: React.FC<DailyViewProps> = ({ plan, toggleComplete }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todayData = plan.week.find(d => d.day === todayName) || plan.week[0];

  return (
    <div className="space-y-16 animate-luxe">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-12 gap-6">
        <div>
          <h2 className="text-5xl font-cinzel font-black text-white">Daily <span className="text-[#C5A059]">Rites</span></h2>
          <p className="text-gray-500 mt-2 uppercase text-[10px] font-bold tracking-[0.4em]">Biological Clock: Synchronized</p>
        </div>
        <div className="flex items-center gap-4 text-right">
           <div>
              <p className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest">Cycle Phase</p>
              <p className="text-xl font-cinzel font-bold text-white">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
           </div>
        </div>
      </div>

      <div className="relative pl-12 space-y-12">
        {/* The Timeline String */}
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#C5A059]/40 via-[#C5A059]/10 to-transparent ml-4"></div>

        {todayData.items.sort((a, b) => a.time.localeCompare(b.time)).map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Node */}
            <div className={`absolute -left-[48px] top-6 w-3 h-3 rounded-full border-2 transition-all duration-500 ${
              item.completed ? 'bg-[#C5A059] border-[#C5A059]' : 'bg-[#0A0A0A] border-[#C5A059]/30 group-hover:scale-125'
            }`}></div>

            <div className={`flex flex-col md:flex-row md:items-center gap-8 p-8 rounded-[2.5rem] transition-all duration-700 ${
              item.completed ? 'opacity-30' : 'luxe-card hover:bg-white/[0.02]'
            }`}>
              <div className="w-24 shrink-0">
                <span className="text-2xl font-cinzel font-bold text-[#C5A059]">{item.time}</span>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className={`text-xl font-bold tracking-tight ${item.completed ? 'line-through' : 'text-white'}`}>{item.activity}</h3>
                  <span className="text-[8px] uppercase tracking-[0.2em] font-black text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">{item.type}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-light max-w-2xl">{item.description}</p>
              </div>

              <button 
                onClick={() => toggleComplete(todayData.day, item.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 ${
                  item.completed 
                  ? 'bg-[#C5A059] border-[#C5A059] text-black shadow-[0_0_20px_rgba(197,160,89,0.3)]' 
                  : 'border-white/10 text-white/20 hover:border-[#C5A059] hover:text-[#C5A059]'
                }`}
              >
                <i className="fa-solid fa-check text-sm"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyView;
