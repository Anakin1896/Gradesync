import React, { useState } from 'react';
import { Layers, Users, CalendarDays, AlertTriangle, ArrowRight, Plus } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const todayClasses = [
    { id: 1, time: '7:30 AM', title: 'General Biology 2', section: 'Grade 11 – STEM A · 40 students', room: 'Rm 201', dot: 'bg-indigo-500', isCurrent: false },
    { id: 2, time: '10:00 AM', title: 'Earth Science', section: 'Grade 11 – STEM B · 38 students', room: 'Rm 105', dot: 'bg-amber-400', isCurrent: true },
    { id: 3, time: '1:00 PM', title: 'Chemistry', section: 'Grade 12 – STEM A · 36 students', room: 'Lab 3', dot: 'bg-emerald-500', isCurrent: false },
    { id: 4, time: '3:00 PM', title: 'Research 1', section: 'Grade 12 – STEM B · 28 students', room: 'Rm 310', dot: 'bg-blue-500', isCurrent: false },
  ];

  const calendarDays = [
    { date: 2, hasEvent: false }, { date: 3, hasEvent: true }, { date: 4, hasEvent: false }, { date: 5, hasEvent: false }, { date: 6, hasEvent: true }, { date: 7, hasEvent: false }, { date: 8, hasEvent: false },
    { date: 9, hasEvent: false }, { date: 10, hasEvent: false }, { date: 11, hasEvent: true }, { date: 12, hasEvent: false }, { date: 13, hasEvent: false }, { date: 14, hasEvent: false }, { date: 15, hasEvent: false },
    { date: 16, hasEvent: false }, { date: 17, hasEvent: false }, { date: 18, hasEvent: true }, { date: 19, hasEvent: false }, { date: 20, hasEvent: false }, { date: 21, hasEvent: false }, { date: 22, hasEvent: false },
    { date: 23, hasEvent: false }, { date: 24, hasEvent: false }, { date: 25, hasEvent: false }, { date: 26, isToday: true }, { date: 27, hasEvent: false }, { date: 28, hasEvent: false }, { date: 29, hasEvent: false },
    { date: 30, hasEvent: false }, { date: 31, hasEvent: false }
  ];

  const subjectsData = [
    { title: 'General Biology 2', section: 'Grade 11 – STEM A · 40 students', acts: 12, avg: 87.4, icon: '🧬', bg: 'bg-purple-100' },
    { title: 'Earth Science', section: 'Grade 11 – STEM B · 38 students', acts: 9, avg: 82.1, icon: '🌍', bg: 'bg-amber-100' },
    { title: 'Chemistry', section: 'Grade 12 – STEM A · 36 students', acts: 14, avg: 79.8, icon: '🛸', bg: 'bg-emerald-100' },
    { title: 'Research 1', section: 'Grade 12 – STEM B · 28 students', acts: 7, avg: 91.2, icon: '🔬', bg: 'bg-blue-100' },
  ];

  const scheduleRows = [
    { time: '7:30–8:30', m: { title: 'Gen. Bio 2', sub: 'STEM-A Rm201', color: 'bg-purple-50 text-purple-600' }, t: null, w: { title: 'Gen. Bio 2', sub: 'STEM-A Rm201', color: 'bg-purple-50 text-purple-600' }, th: null, f: { title: 'Gen. Bio 2', sub: 'STEM-A Rm201', color: 'bg-purple-50 text-purple-600' } },
    { time: '10:00–11:00', m: null, t: { title: 'Earth Sci', sub: 'STEM-B Rm105', color: 'bg-amber-50 text-amber-700' }, w: null, th: { title: 'Earth Sci', sub: 'STEM-B Rm105', color: 'bg-amber-50 text-amber-700' }, f: null },
    { time: '1:00–2:00', m: { title: 'Chemistry', sub: 'G12-A Lab3', color: 'bg-emerald-50 text-emerald-600' }, t: null, w: { title: 'Chemistry', sub: 'G12-A Lab3', color: 'bg-emerald-50 text-emerald-600' }, th: null, f: { title: 'Chemistry', sub: 'G12-A Lab3', color: 'bg-emerald-50 text-emerald-600' } },
    { time: '3:00–4:00', m: null, t: { title: 'Research 1', sub: 'G12-B Rm310', color: 'bg-blue-50 text-blue-600' }, w: null, th: { title: 'Research 1', sub: 'G12-B Rm310', color: 'bg-blue-50 text-blue-600' }, f: null },
  ];


  const renderOverview = () => (
    <>
      <div className="grid grid-cols-4 gap-6 mb-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-amber-400 p-5 shadow-sm">
          <Layers className="text-indigo-400 mb-3" size={24} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1C29]">5</h2>
          <p className="text-sm font-semibold text-gray-500 mt-1">Subjects Handled</p>
          <p className="text-xs text-gray-400 mt-1">3 active today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-emerald-400 p-5 shadow-sm">
          <Users className="text-indigo-800 mb-3" size={24} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1C29]">142</h2>
          <p className="text-sm font-semibold text-gray-500 mt-1">Total Students</p>
          <p className="text-xs text-gray-400 mt-1">Across all sections</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-blue-400 p-5 shadow-sm">
          <CalendarDays className="text-indigo-300 mb-3" size={24} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1C29]">4</h2>
          <p className="text-sm font-semibold text-gray-500 mt-1">Classes Today</p>
          <p className="text-xs text-gray-400 mt-1">Next: 10:00 AM</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-purple-400 p-5 shadow-sm">
          <AlertTriangle className="text-amber-400 mb-3" size={24} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1C29]">7</h2>
          <p className="text-sm font-semibold text-gray-500 mt-1">Pending Grades</p>
          <p className="text-xs text-gray-400 mt-1">Due this week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-serif font-bold text-[#1A1C29]">Today's Classes</h2>
              <button className="text-sm font-semibold text-amber-500 flex items-center gap-1 hover:text-amber-600 transition-colors">
                View all <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {todayClasses.map((cls) => (
                <div key={cls.id} className={`flex items-center justify-between p-4 rounded-xl border ${cls.isCurrent ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-[#FCFBF8] border-gray-100'}`}>
                  <div className="flex items-center gap-6 w-32 shrink-0">
                    <span className="text-sm font-semibold text-gray-500">{cls.time}</span>
                    <div className={`w-2.5 h-2.5 rounded-full ${cls.dot}`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1A1C29] text-base">{cls.title}</h3>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">{cls.section}</p>
                  </div>
                  <div className={`text-sm font-bold ${cls.isCurrent ? 'text-amber-600' : 'text-gray-400'}`}>
                    {cls.room}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-serif font-bold text-[#1A1C29] mb-4">March 2026</h2>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[10px] font-bold text-gray-400 tracking-wider py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              <div className="py-1.5"></div>
              <div className="py-1.5 text-[#1A1C29]">1</div>
              {calendarDays.map((day, i) => (
                <div key={i} className="py-1.5 flex flex-col items-center justify-center relative">
                  {day.isToday ? (
                    <span className="w-7 h-7 flex items-center justify-center bg-amber-400 text-[#1A1C29] font-bold rounded-full shadow-sm">{day.date}</span>
                  ) : (
                    <span className="text-[#1A1C29]">{day.date}</span>
                  )}
                  {day.hasEvent && !day.isToday && <span className="w-1 h-1 bg-blue-500 rounded-full absolute bottom-0.5"></span>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-serif font-bold text-[#1A1C29] mb-6">Grade Completion</h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-[#1A1C29]">Gen. Biology 2</span><span className="font-bold text-[#1A1C29]">92%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '92%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-[#1A1C29]">Earth Science</span><span className="font-bold text-[#1A1C29]">78%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '78%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-[#1A1C29]">Chemistry</span><span className="font-bold text-[#1A1C29]">55%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{ width: '55%' }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderSchedule = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-bold text-[#1A1C29]">Weekly Schedule</h2>
        <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm">
          <Plus size={16} />
          <span>Add Class</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-200">
          <thead>
            <tr className="border-b border-gray-100">
              {['TIME', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'].map(th => (
                <th key={th} className="py-4 px-4 font-semibold text-[11px] tracking-wider text-gray-400">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-5 px-4 text-sm font-semibold text-gray-500 w-28">{row.time}</td>
                {['m', 't', 'w', 'th', 'f'].map(day => (
                  <td key={day} className="py-5 px-4 w-48">
                    {row[day] ? (
                      <div className={`px-3 py-2 rounded-lg inline-block ${row[day].color}`}>
                        <p className="font-bold text-sm leading-tight">{row[day].title}</p>
                        <p className="text-[10px] font-semibold opacity-80 mt-0.5">{row[day].sub}</p>
                      </div>
                    ) : (
                      <span className="text-gray-300 font-bold">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
      {subjectsData.map((sub, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${sub.bg}`}>
              {sub.icon}
            </div>
            <div>
              <h3 className="font-bold text-[#1A1C29] text-lg">{sub.title}</h3>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{sub.section}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">ACTIVITIES</p>
              <p className="font-bold text-[#1A1C29] text-lg">{sub.acts}</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">CLASS AVERAGE</p>
              <p className="font-bold text-[#1A1C29] text-lg">{sub.avg}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Ms. Santos — Thursday, March 26, 2026</p>
      </div>

      <div className="flex border-b border-gray-200 mb-8 gap-8">
        {['Overview', 'Today\'s Schedule', 'Subjects'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold transition-colors relative ${
              activeTab === tab ? 'text-[#1A1C29]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && renderOverview()}
      {activeTab === 'Today\'s Schedule' && renderSchedule()}
      {activeTab === 'Subjects' && renderSubjects()}
      
    </div>
  );
};

export default Dashboard;