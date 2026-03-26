import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Students from './components/Students';
import Grades from './components/Grades';
import Activities from './components/Activities';
import Attendance from './components/Attendance';
import Settings from './components/Settings';


function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <Profile />;
      case 'Students':
        return <Students />;
      case 'Grades':
        return <Grades />;
      case 'Activities':
        return <Activities />;
      case 'Attendance':
        return <Attendance />;
      case 'Settings':
        return <Settings />;
      default:
        return (
          <div className="mt-8">
            <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">{activeTab}</h1>
            <p className="text-gray-500 mt-2">The {activeTab} content will be built here next!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#FCFBF8] font-sans">

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="flex justify-end items-center px-10 py-6 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-sm font-medium">
              S.Y. 2025–2026 · 2nd Sem
            </div>
            <button className="p-2 rounded-full bg-white border border-gray-200 text-amber-500 hover:bg-gray-50 transition-colors shadow-sm">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto px-10 pb-10">
          {renderContent()}
        </main>

      </div>
    </div>
  );
}

export default App;