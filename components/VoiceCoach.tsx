
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createVoiceSession } from '../geminiService';
import { LongevityPlan, UserProfile } from '../types';

interface VoiceCoachProps {
  plan: LongevityPlan;
  setPlan: (plan: LongevityPlan) => void;
  userProfile: UserProfile;
}

const VoiceCoach: React.FC<VoiceCoachProps> = ({ plan, setPlan, userProfile }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Use a ref for plan to avoid stale closures in callbacks
  const planRef = useRef(plan);
  useEffect(() => { planRef.current = plan; }, [plan]);

  const decodeAudio = useCallback(async (base64: string, ctx: AudioContext) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  }, []);

  const handleStart = async () => {
    setIsConnecting(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = createVoiceSession(userProfile, planRef.current, {
        onopen: () => {
          setIsActive(true);
          setIsConnecting(false);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
            
            let binary = '';
            const bytes = new Uint8Array(int16.buffer);
            for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
            const base64 = btoa(binary);

            sessionPromise.then(s => s.sendRealtimeInput({ 
              media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
            }));
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          // Handle Audio
          if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
            const buffer = await decodeAudio(msg.serverContent.modelTurn.parts[0].inlineData.data, ctx);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            
            const now = ctx.currentTime;
            const startTime = Math.max(nextStartTimeRef.current, now);
            source.start(startTime);
            nextStartTimeRef.current = startTime + buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          // Handle Function Calls
          if (msg.toolCall) {
            for (const fc of msg.toolCall.functionCalls) {
              if (fc.name === 'mark_activity_complete') {
                const { day, id, completed } = fc.args;
                setPlan({
                  ...planRef.current,
                  week: planRef.current.week.map(d => 
                    d.day === day 
                    ? { ...d, items: d.items.map(it => it.id === id ? { ...it, completed } : it) }
                    : d
                  )
                });
                sessionPromise.then(s => s.sendToolResponse({
                  functionResponses: [{ id: fc.id, name: fc.name, response: { result: 'ok' } }]
                }));
              } else if (fc.name === 'update_protocol') {
                const { day, updates } = fc.args;
                setPlan({
                  ...planRef.current,
                  week: planRef.current.week.map(d => d.day === day ? { ...d, items: updates } : d)
                });
                sessionPromise.then(s => s.sendToolResponse({
                  functionResponses: [{ id: fc.id, name: fc.name, response: { result: 'ok' } }]
                }));
              }
            }
          }

          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => setIsActive(false),
        onerror: () => setIsActive(false),
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const handleStop = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-serif font-bold tracking-tight">Speak to <span className="text-[#D4AF37]">Olympus</span></h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          Update your protocol, report completed tasks, or adjust based on how you feel.
        </p>
      </div>

      <div className="relative">
        <button
          disabled={isConnecting}
          onClick={isActive ? handleStop : handleStart}
          className={`w-40 h-40 rounded-full flex items-center justify-center transition-all shadow-2xl relative z-10 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/20' 
              : 'bg-[#D4AF37] hover:bg-[#B8962D] hover:scale-105 shadow-[#D4AF37]/20'
          } ${isConnecting ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isConnecting ? (
            <i className="fa-solid fa-circle-notch animate-spin text-4xl text-black"></i>
          ) : isActive ? (
            <div className="flex gap-1 items-center">
               <div className="w-1.5 h-8 bg-white rounded-full animate-bounce"></div>
               <div className="w-1.5 h-12 bg-white rounded-full animate-bounce delay-75"></div>
               <div className="w-1.5 h-6 bg-white rounded-full animate-bounce delay-150"></div>
            </div>
          ) : (
            <i className="fa-solid fa-microphone text-4xl text-black"></i>
          )}
        </button>

        {isActive && (
          <>
            <div className="absolute inset-[-40px] border-2 border-[#D4AF37]/30 rounded-full animate-ping"></div>
            <div className="absolute inset-[-80px] border border-[#D4AF37]/10 rounded-full animate-ping delay-150"></div>
          </>
        )}
      </div>

      <div className="w-full max-w-xl bg-[#111] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#D4AF37]">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="text-xs uppercase font-bold tracking-widest">{isActive ? 'Voice Engine Live' : 'Coach Offline'}</span>
          </div>
          <i className="fa-solid fa-waveform text-[#D4AF37]/50 text-xl"></i>
        </div>
        
        <div className="space-y-6">
           <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all cursor-pointer">
              <p className="text-sm font-medium italic text-gray-400">"Olympus, I've just completed my Zone 2 cardio session."</p>
           </div>
           <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all cursor-pointer">
              <p className="text-sm font-medium italic text-gray-400">"I'm feeling quite stressed today, should I skip the cold plunge?"</p>
           </div>
           <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#D4AF37]/20 transition-all cursor-pointer">
              <p className="text-sm font-medium italic text-gray-400">"Move my HIIT training to 4 PM on Thursday."</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCoach;
