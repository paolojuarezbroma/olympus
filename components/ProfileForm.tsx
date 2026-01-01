
import React from 'react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, setProfile }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-3xl font-serif font-bold">Biological Identity</h2>
        <p className="text-gray-400 mt-1">Provide your physiological data for precision protocol engineering.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Chronological Age</label>
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/5 rounded-xl p-4 focus:border-[#D4AF37] focus:outline-none transition-all"
            placeholder="e.g. 35"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Gender Identity</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/5 rounded-xl p-4 focus:border-[#D4AF37] focus:outline-none transition-all"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Ethnicity / Genetic Lineage</label>
          <input
            type="text"
            name="ethnicity"
            value={profile.ethnicity}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/5 rounded-xl p-4 focus:border-[#D4AF37] focus:outline-none transition-all"
            placeholder="e.g. Northern European, East Asian"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Height</label>
            <input
              type="text"
              name="height"
              value={profile.height}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/5 rounded-xl p-4 focus:border-[#D4AF37] focus:outline-none transition-all"
              placeholder="180cm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Weight</label>
            <input
              type="text"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/5 rounded-xl p-4 focus:border-[#D4AF37] focus:outline-none transition-all"
              placeholder="75kg"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Lifestyle Profile</label>
          <select
            name="lifestyle"
            value={profile.lifestyle}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/5 rounded-xl p-4 focus:border-[#D4AF37] focus:outline-none transition-all"
          >
            <option value="Sedentary">Sedentary (Little to no exercise)</option>
            <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
            <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
            <option value="Very Active">Very Active (6-7 days/week)</option>
            <option value="Athlete">Elite Athlete (High intensity daily)</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Core Longevity Goals</label>
          <textarea
            name="goals"
            value={profile.goals}
            onChange={handleChange}
            rows={3}
            className="w-full bg-[#111] border border-white/5 rounded-xl p-4 focus:border-[#D4AF37] focus:outline-none transition-all resize-none"
            placeholder="e.g. Reverse biological aging, maximize focus, maintain muscle mass..."
          />
        </div>
      </div>
      
      <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-2xl">
        <p className="text-sm text-[#D4AF37] leading-relaxed">
          <i className="fa-solid fa-circle-info mr-2"></i>
          This data is used exclusively to calibrate the <strong>Olympus Engine</strong>. Your information remains local and is only transmitted to the A.I. to generate your master protocol.
        </p>
      </div>
    </div>
  );
};

export default ProfileForm;
