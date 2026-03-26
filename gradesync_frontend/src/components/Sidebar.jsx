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
    <div className="w-64 h-full bg-[#1A1C29] text-white flex flex-col shrink-0">

      <div className="shrink-0">
        <div className="pt-6 pb-4 px-6">
          <h1 className="text-2xl font-serif font-bold text-amber-400">
            Grade<span className="text-white">Sync</span>
          </h1>
        </div>

        <div className="flex flex-col items-center pb-4 border-b border-gray-700 mx-6 mb-2">
          <div className="w-20 h-20 rounded-full border-2 border-amber-400 flex items-center justify-center bg-[#2A2D3E] mb-3">
            <span className="text-3xl font-serif font-bold text-amber-400">M</span>
          </div>
          <h2 className="font-semibold text-lg tracking-wide">Ms. Maria Santos</h2>
          <p className="text-xs text-gray-400 mt-1">Science Department</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">

        <div className="mb-4">
          <p className="text-[11px] font-bold text-gray-500 mb-2 px-2 tracking-wider">MAIN</p>
          
          <div className="space-y-0.5">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
       
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl transition-colors text-sm ${
                    isActive 
                      ? 'bg-amber-400 text-[#1A1C29] font-semibold shadow-md' 
                      : 'text-gray-400 hover:text-white hover:bg-[#2A2D3E]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#1A1C29]' : ''} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-gray-500 mb-2 px-2 tracking-wider">ACCOUNT</p>
          <div className="space-y-0.5">
            {accountLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-xl transition-colors text-sm ${
                    isActive 
                      ? 'bg-amber-400 text-[#1A1C29] font-semibold shadow-md' 
                      : 'text-gray-400 hover:text-white hover:bg-[#2A2D3E]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#1A1C29]' : ''} />
                  <span>{link.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="shrink-0 px-4 py-4 border-t border-gray-800">
        <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-[#2A2D3E] rounded-xl transition-colors">
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;