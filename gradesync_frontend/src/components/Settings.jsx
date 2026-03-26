import React, { useState } from 'react';
import { Save } from 'lucide-react';

const Settings = () => {

  const [notifications, setNotifications] = useState(true);
  const [schoolYear, setSchoolYear] = useState('2025-2026');
  const [gradingSystem, setGradingSystem] = useState('75 (DepEd)');
  const [language, setLanguage] = useState('English (PH)');

  return (
    <div className="max-w-3xl">

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Settings</h1>
        <p className="text-gray-500 mt-1">App preferences and configuration</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-serif font-bold text-[#1A1C29] mb-6">App Settings</h2>

        <div className="space-y-6">

          <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <div>
              <p className="font-semibold text-sm text-[#1A1C29]">Notifications</p>
              <p className="text-xs text-gray-500 mt-1">Grade deadlines, attendance reminders</p>
            </div>

            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${
                notifications ? 'bg-amber-400' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${
                notifications ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <div>
              <p className="font-semibold text-sm text-[#1A1C29]">School Year</p>
              <p className="text-xs text-gray-500 mt-1">Current active school year</p>
            </div>
            <select 
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer"
            >
              <option value="2024-2025">2024–2025</option>
              <option value="2025-2026">2025–2026</option>
              <option value="2026-2027">2026–2027</option>
            </select>
          </div>

          <div className="flex justify-between items-center pb-6 border-b border-gray-100">
            <div>
              <p className="font-semibold text-sm text-[#1A1C29]">Grading System</p>
              <p className="text-xs text-gray-500 mt-1">Passing grade threshold</p>
            </div>
            <select 
              value={gradingSystem}
              onChange={(e) => setGradingSystem(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer"
            >
              <option value="75 (DepEd)">75 (DepEd)</option>
              <option value="70 (Custom)">70 (Custom)</option>
              <option value="60 (Base)">60 (Base)</option>
            </select>
          </div>

          <div className="flex justify-between items-center pb-8">
            <div>
              <p className="font-semibold text-sm text-[#1A1C29]">Language</p>
              <p className="text-xs text-gray-500 mt-1">Interface language</p>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none cursor-pointer"
            >
              <option value="English (PH)">English (PH)</option>
              <option value="Tagalog">Tagalog</option>
            </select>
          </div>

          <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
            <Save size={18} />
            <span>Save Changes</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Settings;