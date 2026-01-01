
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-light fa-house-blank', label: 'Overview' },
    { id: 'profile', icon: 'fa-light fa-fingerprint', label: 'Biometrics' },
    { id: 'integrations', icon: 'fa-light fa-link', label: 'Tether' },
    { id: 'daily', icon: 'fa-light fa-sun', label: 'Today' },
    { id: 'weekly', icon: 'fa-light fa-calendar-range', label: 'Forecast' },
    { id: 'grocery', icon: 'fa-light fa-basket-shopping', label: 'Sustenance' },
    { id: 'voice', icon: 'fa-light fa-waveform', label: 'Oracle' },
    { id: 'export', icon: 'fa-light fa-paper-plane', label: 'Transit' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-[#050505] border-r border-white/5 flex flex-col py-12 transition-all shrink-0">
      <div className="px-8 mb-20 hidden md:block">
        <div className="flex flex-col gap-1">
          <span className="font-cinzel font-black tracking-[0.4em] text-sm text-[#C5A059]">OLYMPUS</span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-bold">Systems v2.0</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-500 group ${
              activeTab === item.id 
                ? 'text-[#C5A059] bg-white/[0.03]' 
                : 'text-gray-500 hover:text-white hover:bg-white/[0.01]'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeTab === item.id ? 'bg-[#C5A059]/10' : ''}`}>
              <i className={`fa-solid ${item.icon.replace('fa-light', 'fa-solid')} text-sm`}></i>
            </div>
            <span className="hidden md:inline font-medium text-[11px] uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-6 mt-auto">
        <div className="hidden md:block p-5 rounded-2xl hairline-border bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></div>
            <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gray-500">Live Feedback</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
