
import React from 'react';
import { generatePlan } from '../geminiService';
import { LongevityPlan, UserProfile, ActivityType } from '../types';

interface DashboardProps {
  plan: LongevityPlan;
  onGenerate: (state: boolean) => void;
  isGenerating: boolean;
  setPlan: (plan: LongevityPlan) => void;
  userProfile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ plan, onGenerate, isGenerating, setPlan, userProfile }) => {
  const handleGenerate = async () => {
    onGenerate(true);
    const newPlan = await generatePlan(userProfile);
    if (newPlan) setPlan(newPlan);
    onGenerate(false);
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todayMeals = plan.week.find(d => d.day === todayName)?.items.filter(i => i.type === ActivityType.MEAL) || [];

  const metrics = userProfile.healthMetrics?.isConnected ? [
    { label: 'Metabolic', value: `${userProfile.healthMetrics.bloodGlucoseMgDl}`, unit: 'mg/dL', trend: 'Optimized', icon: 'fa-chart-simple' },
    { label: 'Deep Sleep', value: `${Math.floor(parseInt(userProfile.healthMetrics.deepSleepMinutes)/60)}h ${parseInt(userProfile.healthMetrics.deepSleepMinutes)%60}m`, unit: '', trend: 'Repairing', icon: 'fa-moon' },
    { label: 'Resting HR', value: userProfile.healthMetrics.restingHeartRate, unit: 'bpm', trend: 'Athletic', icon: 'fa-heart-pulse' },
    { label: 'VO2 Max', value: userProfile.healthMetrics.vo2Max, unit: '', trend: 'Elite', icon: 'fa-wind' },
  ] : Array(4).fill({ label: 'System', value: '--', unit: '', trend: 'Scanning', icon: 'fa-dna' });

  return (
    <div className="space-y-16 animate-luxe">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="luxe-card p-8 rounded-3xl group hover:border-[#C5A059]/30 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">{m.label}</p>
              <i className={`fa-solid ${m.icon} text-xs text-[#C5A059]/40`}></i>
            </div>
            <div className="flex items-baseline gap-1">
              <h4 className="text-3xl font-cinzel font-bold text-white tracking-tight">{m.value}</h4>
              <span className="text-[10px] text-gray-500 font-bold uppercase">{m.unit}</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#C5A059]"></div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{m.trend}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="relative overflow-hidden rounded-[3rem] p-12 lg:p-20 hairline-border bg-gradient-to-br from-white/[0.02] to-transparent">
        <div className="max-w-3xl space-y-10 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-[1px] bg-[#C5A059]/50"></div>
             <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-black">Architecture of Time</span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-cinzel font-black leading-tight text-white tracking-tighter">
            Sculpting Your <span className="italic font-normal text-[#C5A059]">Infinity.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed font-light">
            Olympus analyzes your biological telemetry to forge a protocol that doesn't just manage aging—it redefines the boundaries of your vitality.
          </p>
          <button 
            disabled={isGenerating}
            onClick={handleGenerate}
            className="group px-12 py-5 bg-[#C5A059] text-black font-bold uppercase tracking-[0.2em] text-[11px] rounded-full transition-all hover:scale-[1.02] flex items-center gap-4 disabled:opacity-40"
          >
            {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
            Consult the Oracle
          </button>
        </div>
        
        <div className="hidden lg:block absolute top-1/2 right-20 -translate-y-1/2 opacity-20">
           <i className="fa-solid fa-archway text-[20rem] text-[#C5A059] animate-pulse duration-[10000ms]"></i>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="luxe-card p-10 rounded-[3rem]">
          <h3 className="text-lg font-cinzel font-bold mb-10 flex items-center gap-3 text-[#C5A059]">
             <i className="fa-solid fa-leaf text-xs"></i>
             Sustenance Focus
          </h3>
          <div className="space-y-6">
            {todayMeals.length > 0 ? todayMeals.map(meal => (
              <div key={meal.id} className="p-6 rounded-2xl bg-white/[0.01] hairline-border hover:bg-white/[0.03] transition-colors group">
                <p className="text-[9px] uppercase font-black text-gray-500 mb-2 tracking-[0.2em]">{meal.time}</p>
                <h4 className="font-bold text-white text-lg mb-1 group-hover:text-[#C5A059] transition-colors">{meal.activity}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-light">{meal.description}</p>
              </div>
            )) : <p className="text-sm text-gray-600 italic">No scheduled nutrition for this cycle.</p>}
          </div>
        </section>

        <section className="luxe-card p-10 rounded-[3rem]">
          <h3 className="text-lg font-cinzel font-bold mb-10 flex items-center gap-3 text-[#C5A059]">
             <i className="fa-solid fa-dna text-xs"></i>
             Mitochondrial Logic
          </h3>
          <div className="space-y-4">
             {[
               { title: 'Sirtuin Activation', text: 'Detected fasting window aligns with optimal SIRT1 regulation.' },
               { title: 'Glycemic Stability', text: 'Current glucose profile suggests high metabolic flexibility.' }
             ].map((item, idx) => (
               <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-white/[0.01] hairline-border">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/5 flex items-center justify-center text-[#C5A059] text-xs">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
                  </div>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
