
import React, { useState, useEffect } from 'react';
import { LongevityPlan, ActivityType, UserProfile, AppTab } from './types';
import { INITIAL_PLAN, DEFAULT_PROFILE } from './constants';
import Sidebar from './components/Sidebar';
import DailyView from './components/DailyView';
import WeeklyView from './components/WeeklyView';
import VoiceCoach from './components/VoiceCoach';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';
import Integrations from './components/Integrations';
import GroceryList from './components/GroceryList';
import ExportView from './components/ExportView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [plan, setPlan] = useState<LongevityPlan>(INITIAL_PLAN);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTimeStr = now.toTimeString().slice(0, 5);

      const todayPlan = plan.week.find(d => d.day === currentDay);
      if (todayPlan) {
        todayPlan.items.forEach(item => {
          if (item.time === currentTimeStr && !item.completed) {
            new Notification("Olympus Command", {
              body: `${item.activity}: Your biological synchrony is requested.`,
              icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913564.png'
            });
          }
        });
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [plan]);

  useEffect(() => {
    const savedPlan = localStorage.getItem('olympus_plan');
    const savedProfile = localStorage.getItem('olympus_profile');
    if (savedPlan) setPlan(JSON.parse(savedPlan));
    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
  }, []);

  useEffect(() => {
    localStorage.setItem('olympus_plan', JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem('olympus_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const toggleComplete = (dayName: string, id: string) => {
    setPlan(prev => ({
      ...prev,
      week: prev.week.map(day => 
        day.day === dayName 
          ? { ...day, items: day.items.map(item => item.id === id ? { ...item, completed: !item.completed } : item) }
          : day
      )
    }));
  };

  const handleUpdatePlan = (newPlan: LongevityPlan) => {
    setPlan(newPlan);
    setActiveTab('daily');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#F2F2F2] selection:bg-[#D4AF37] selection:text-black overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-8 md:p-14 overflow-y-auto relative z-10">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in slide-in-from-top-4 duration-1000">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-[#D4AF37]/50"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">The Great Work</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-cinzel font-black text-ivory tracking-tighter leading-none mb-3">OLYMPUS</h1>
            <p className="text-gray-500 font-medium tracking-[0.1em] uppercase text-xs">Architecting Eternal Vitality</p>
          </div>
          
          <div 
            className="flex items-center gap-6 glass p-4 pr-6 rounded-3xl border border-[#D4AF37]/10 cursor-pointer hover:border-[#D4AF37]/40 transition-all shadow-2xl group" 
            onClick={() => setActiveTab('profile')}
          >
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#111] flex items-center justify-center text-[#050505] shadow-[0_0_20px_rgba(212,175,55,0.2)] group-hover:rotate-6 transition-transform">
               <i className="fa-solid fa-user-shield text-2xl"></i>
             </div>
             <div className="text-left">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black mb-1">Biological Identity</div>
                <div className="text-xl font-cinzel font-bold text-ivory">{userProfile.gender}, {userProfile.age} CYCLES</div>
             </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto pb-32">
          {activeTab === 'dashboard' && <Dashboard plan={plan} onGenerate={setIsGenerating} isGenerating={isGenerating} setPlan={handleUpdatePlan} userProfile={userProfile} />}
          {activeTab === 'daily' && <DailyView plan={plan} toggleComplete={toggleComplete} />}
          {activeTab === 'weekly' && <WeeklyView plan={plan} toggleComplete={toggleComplete} />}
          {activeTab === 'voice' && <VoiceCoach plan={plan} setPlan={setPlan} userProfile={userProfile} />}
          {activeTab === 'profile' && <ProfileForm profile={userProfile} setProfile={setUserProfile} />}
          {activeTab === 'integrations' && <Integrations profile={userProfile} setProfile={setUserProfile} />}
          {activeTab === 'grocery' && <GroceryList plan={plan} />}
          {activeTab === 'export' && (
            <ExportView 
              plan={plan} 
              profile={userProfile} 
              setPlan={setPlan} 
              setProfile={setUserProfile} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
