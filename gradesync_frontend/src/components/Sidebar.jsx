import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  ClipboardList, 
  CheckSquare, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const mainLinks = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Students', icon: Users },
    { name: 'Grades', icon: BarChart2 },
    { name: 'Activities', icon: ClipboardList },
    { name: 'Attendance', icon: CheckSquare },
  ];

  const accountLinks = [
    { name: 'Profile', icon: User },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-[#1A1C29] text-white flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Logo */}
        <div className="pt-8 pb-6 px-6">
          <h1 className="text-2xl font-serif font-bold text-amber-400">
            Grade<span className="text-white">Sync</span>
          </h1>
        </div>

        {/* User Profile Summary */}
        <div className="flex flex-col items-center pb-8 border-b border-gray-700 mx-6 mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-amber-400 flex items-center justify-center bg-[#2A2D3E] mb-3">
            <span className="text-3xl font-serif font-bold text-amber-400">M</span>
          </div>
          <h2 className="font-semibold text-lg tracking-wide">Ms. Maria Santos</h2>
          <p className="text-xs text-gray-400 mt-1">Science Department</p>
        </div>

        {/* Main Navigation */}
        <div className="px-4">
          <p className="text-xs font-bold text-gray-500 mb-3 px-2 tracking-wider">MAIN</p>
          <div className="space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-amber-400 text-[#1A1C29] font-semibold shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-[#2A2D3E]'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-[#1A1C29]' : ''} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Navigation */}
        <div className="px-4 mt-8">
          <p className="text-xs font-bold text-gray-500 mb-3 px-2 tracking-wider">ACCOUNT</p>
          <div className="space-y-1">
            {accountLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-amber-400 text-[#1A1C29] font-semibold shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-[#2A2D3E]'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-[#1A1C29]' : ''} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-4 pb-8 pt-4">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-[#2A2D3E] rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;