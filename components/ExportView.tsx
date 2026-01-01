
import React, { useRef, useState } from 'react';
import { LongevityPlan, UserProfile } from '../types';

interface ExportViewProps {
  plan: LongevityPlan;
  profile: UserProfile;
  setPlan: (plan: LongevityPlan) => void;
  setProfile: (profile: UserProfile) => void;
}

const ExportView: React.FC<ExportViewProps> = ({ plan, profile, setPlan, setProfile }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success'>('idle');
  const isPWAReady = 'serviceWorker' in navigator;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateProjectBlueprint = () => {
    // In a real scenario, this would ideally be a ZIP. 
    // Here we provide a JSON manifest that contains the instructions and state.
    const blueprint = {
      appName: "Olympus",
      version: "2.1.0-Luxe",
      deploymentInstructions: [
        "1. Create a GitHub Repository.",
        "2. Upload all files (index.html, index.tsx, App.tsx, etc.)",
        "3. Connect to Vercel.",
        "4. Set Environment Variable: API_KEY = [Your Gemini Key]"
      ],
      state: { profile, plan }
    };
    
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `olympus_blueprint_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyConfigSnippet = () => {
    const snippet = `API_KEY=your_key_here\nNODE_VERSION=20`;
    navigator.clipboard.writeText(snippet);
    setCopyStatus('success');
    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  return (
    <div className="space-y-20 animate-luxe pb-32">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-[0.5px] bg-[#C5A059]/50"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-black">Production Ritual</span>
        </div>
        <h2 className="text-6xl font-cinzel font-black text-white leading-tight">Sovereign <span className="text-[#C5A059]">Transit.</span></h2>
        <p className="text-gray-500 mt-6 text-lg font-light leading-relaxed">
          Move Olympus from this preview environment to your own private infrastructure. This ensures 100% data privacy and permanent availability as a native mobile application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Project Blueprint Card */}
        <div className="luxe-card p-12 rounded-[3.5rem] border-[#C5A059]/10 relative group overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fa-solid fa-file-export text-[15rem] text-[#C5A059]"></i>
          </div>
          <div className="relative z-10 space-y-8">
            <h3 className="text-2xl font-cinzel font-bold text-white">Project Blueprint</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Generate a unified manifest of your current configuration and deployment roadmap. This is your first step to owning the application.
            </p>
            <button 
              onClick={generateProjectBlueprint}
              className="w-full py-5 bg-[#C5A059] text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-full hover:scale-[1.02] transition-all shadow-xl"
            >
              Generate Digital Blueprint
            </button>
          </div>
        </div>

        {/* Environment Config Card */}
        <div className="luxe-card p-12 rounded-[3.5rem] border-white/5 relative group overflow-hidden">
           <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <i className="fa-solid fa-code text-[15rem]"></i>
          </div>
          <div className="relative z-10 space-y-8">
            <h3 className="text-2xl font-cinzel font-bold text-white">Cloud Configuration</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              When hosting on Vercel or Netlify, you must inject your Gemini API Key into the environment variables.
            </p>
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-[11px] text-[#C5A059] flex justify-between items-center">
               <span>API_KEY=[secret]</span>
               <button onClick={copyConfigSnippet} className="text-gray-600 hover:text-white transition-colors">
                 {copyStatus === 'success' ? <i className="fa-solid fa-check text-green-500"></i> : <i className="fa-solid fa-copy"></i>}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Roadmap */}
      <section className="space-y-12">
        <h3 className="text-xl font-cinzel font-bold text-[#C5A059] flex items-center gap-4">
          <span className="w-8 h-[1px] bg-[#C5A059]/30"></span>
          Deployment Roadmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Source Code', desc: 'Copy the code from each file in this project to a local folder on your workstation.', icon: 'fa-folder-open' },
            { step: '02', title: 'Private Repo', desc: 'Push your folder to a private GitHub repository for secure version control.', icon: 'fa-github' },
            { step: '03', title: 'Instant Launch', desc: 'Connect Vercel to your repo. It will detect React and deploy in seconds.', icon: 'fa-rocket' },
          ].map((item, idx) => (
            <div key={idx} className="p-10 rounded-[2.5rem] hairline-border bg-white/[0.01] space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-cinzel font-black text-[#C5A059]/20">{item.step}</span>
                <i className={`fa-solid ${item.icon} text-[#C5A059]/40`}></i>
              </div>
              <h4 className="text-lg font-bold text-white">{item.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Installation Secret */}
      <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border-l-2 border-[#C5A059] p-12 rounded-[3rem] space-y-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#C5A059] flex items-center justify-center text-black text-2xl shadow-2xl">
               <i className="fa-solid fa-mobile-screen"></i>
            </div>
            <div>
               <h3 className="text-2xl font-cinzel font-bold text-white">The Final Transformation</h3>
               <p className="text-sm text-gray-400 mt-1">Converting the URL into a native biological agent.</p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-gray-500 leading-relaxed font-light">
           <div className="space-y-4">
              <p className="font-bold text-white uppercase tracking-widest text-[10px]">On iOS (Safari)</p>
              <p>Tap the <span className="text-white">Share</span> button and select <span className="text-[#C5A059] font-bold">"Add to Home Screen."</span> Olympus will appear on your dashboard as a high-fidelity app icon.</p>
           </div>
           <div className="space-y-4">
              <p className="font-bold text-white uppercase tracking-widest text-[10px]">On Android (Chrome)</p>
              <p>Tap the <span className="text-white">three dots</span> menu and select <span className="text-[#C5A059] font-bold">"Install App."</span> This enables background synchronization and full-screen immersion.</p>
           </div>
         </div>
      </div>

      {/* Restoration Vault */}
      <div className="luxe-card p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-4 text-center md:text-left">
           <h3 className="text-2xl font-cinzel font-bold text-white">Identity Restoration</h3>
           <p className="text-sm text-gray-500 max-w-md">Already have an Olympus Vault file? Load it now to restore your biological profile and historical protocols.</p>
        </div>
        <div className="flex gap-4">
          <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => {
             const file = e.target.files?.[0];
             if (!file) return;
             const reader = new FileReader();
             reader.onload = (ev) => {
               try {
                 const data = JSON.parse(ev.target?.result as string);
                 if (data.profile && data.plan) {
                   setProfile(data.profile);
                   setPlan(data.plan);
                   alert("Identity Restored.");
                 }
               } catch (err) { alert("Failed to parse vault file."); }
             };
             reader.readAsText(file);
          }} />
          <button onClick={() => fileInputRef.current?.click()} className="px-10 py-4 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
             Restore from Vault
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportView;
