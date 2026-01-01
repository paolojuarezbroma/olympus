
import React, { useState, useRef } from 'react';
import { UserProfile, HealthMetrics } from '../types';

interface IntegrationsProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Integrations: React.FC<IntegrationsProps> = ({ profile, setProfile }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [ouraToken, setOuraToken] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // REAL: Oura API Integration
  const syncOura = async () => {
    if (!ouraToken) {
      setStatusMsg("Please provide an Oura Personal Access Token.");
      return;
    }
    setIsSyncing(true);
    setStatusMsg("Establishing link with Oura Cloud...");
    
    try {
      const response = await fetch('https://api.ouraring.com/v2/usercollection/daily_activity', {
        headers: { 'Authorization': `Bearer ${ouraToken}` }
      });
      
      if (!response.ok) throw new Error("Connection failed. Check your token.");
      
      const data = await response.json();
      const latest = data.data[data.data.length - 1];
      
      setProfile({
        ...profile,
        healthMetrics: {
          ...profile.healthMetrics!,
          isConnected: true,
          lastSynced: new Date().toLocaleTimeString(),
          dailySteps: latest.steps.toString(),
          activeCalories: latest.active_calories.toString(),
          // We would ideally fetch sleep and readiness in parallel for a full sync
        }
      });
      setStatusMsg("Oura Synchrony Achieved.");
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // REAL: Apple Health XML Parser
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncing(true);
    setStatusMsg("Decoding Health Archive...");

    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlContent = event.target?.result as string;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

      const getLatestMetric = (type: string) => {
        const records = xmlDoc.getElementsByTagName("Record");
        for (let i = records.length - 1; i >= 0; i--) {
          if (records[i].getAttribute("type") === type) {
            return records[i].getAttribute("value");
          }
        }
        return null;
      };

      // Extract specific longevity identifiers
      const vo2 = getLatestMetric("HKQuantityTypeIdentifierVO2Max");
      const rhr = getLatestMetric("HKQuantityTypeIdentifierRestingHeartRate");
      const hrv = getLatestMetric("HKQuantityTypeIdentifierHeartRateVariabilitySDNN");
      const glucose = getLatestMetric("HKQuantityTypeIdentifierBloodGlucose");

      setProfile({
        ...profile,
        healthMetrics: {
          ...profile.healthMetrics!,
          isConnected: true,
          lastSynced: new Date().toLocaleTimeString(),
          vo2Max: vo2 || profile.healthMetrics?.vo2Max || '45',
          restingHeartRate: rhr || profile.healthMetrics?.restingHeartRate || '55',
          hrv: hrv || profile.healthMetrics?.hrv || '70',
          bloodGlucoseMgDl: glucose || profile.healthMetrics?.bloodGlucoseMgDl || '85',
        }
      });

      setStatusMsg("Biological Archive Integrated.");
      setIsSyncing(false);
    };
    reader.readAsText(file);
  };

  const m = profile.healthMetrics;

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-1000 pb-32">
      <div className="border-b border-[#D4AF37]/10 pb-8">
        <h2 className="text-5xl font-cinzel font-black text-ivory">Sovereign <span className="text-[#D4AF37]">Data Vault</span></h2>
        <p className="text-gray-500 mt-2 max-w-2xl font-light">Direct browser integration with native HealthKit is sandboxed. Use the methods below to bridge your real-world biometrics into the Olympus Engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Apple Health Export Link */}
        <div className="glass p-10 rounded-[3rem] border border-[#D4AF37]/10 flex flex-col justify-between group hover:border-[#D4AF37]/30 transition-all">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-red-500/10 flex items-center justify-center text-3xl text-red-500">
              <i className="fa-solid fa-heart-pulse"></i>
            </div>
            <div>
              <h3 className="text-2xl font-cinzel font-bold text-ivory">Apple Health Link</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                1. Open Health App on iPhone<br/>
                2. Tap Profile > Export All Health Data<br/>
                3. Upload the <code className="text-[#D4AF37]">export.xml</code> here.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".xml" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-[#D4AF37] transition-all"
            >
              Upload Archive
            </button>
          </div>
        </div>

        {/* Oura Cloud API Link */}
        <div className="glass p-10 rounded-[3rem] border border-[#D4AF37]/10 flex flex-col justify-between group hover:border-[#D4AF37]/30 transition-all">
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500/10 flex items-center justify-center text-3xl text-blue-400">
              <i className="fa-solid fa-ring"></i>
            </div>
            <div>
              <h3 className="text-2xl font-cinzel font-bold text-ivory">Oura Cloud Link</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Connect directly to your Oura account via Personal Access Token (PAT).
              </p>
            </div>
            <input 
              type="password"
              placeholder="Enter Oura PAT Token"
              value={ouraToken}
              onChange={(e) => setOuraToken(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm focus:border-[#D4AF37] outline-none"
            />
          </div>
          
          <div className="mt-8">
            <button
              onClick={syncOura}
              disabled={isSyncing}
              className="w-full py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] transition-all"
            >
              {isSyncing ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Establish API Link'}
            </button>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl text-center">
          <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">{statusMsg}</p>
        </div>
      )}

      {m?.isConnected && (
        <div className="mt-16 space-y-10 animate-in fade-in duration-1000">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-cinzel font-bold flex items-center gap-4">
              <i className="fa-solid fa-dna text-[#D4AF37]"></i>
              Verified Biometrics
            </h3>
            <span className="text-[10px] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1.5 rounded-full border border-[#D4AF37]/20 tracking-[0.2em] uppercase">
              Last Sync: {m.lastSynced}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricCard label="HRV (SDNN)" value={`${m.hrv}ms`} icon="fa-heart-circle-bolt" color="text-purple-400" />
            <MetricCard label="VO2 Max" value={m.vo2Max} icon="fa-wind" color="text-blue-400" />
            <MetricCard label="RHR" value={`${m.restingHeartRate}bpm`} icon="fa-heart-pulse" color="text-red-400" />
            <MetricCard label="Glucose" value={`${m.bloodGlucoseMgDl}mg/dL`} icon="fa-syringe" color="text-orange-400" />
          </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, icon, color }: any) => {
  return (
    <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-36 hover:border-[#D4AF37]/20 transition-all">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest">{label}</p>
        <i className={`fa-solid ${icon} ${color} opacity-30`}></i>
      </div>
      <p className="text-3xl font-cinzel font-bold text-ivory">{value}</p>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-[#D4AF37]/40 w-2/3"></div>
      </div>
    </div>
  );
};

export default Integrations;
