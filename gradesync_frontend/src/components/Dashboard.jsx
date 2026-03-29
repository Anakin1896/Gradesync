import React, { useState, useEffect, useMemo } from 'react';
import { Layers, Users, CalendarDays, AlertTriangle, ArrowRight, Plus } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const [todayClasses, setTodayClasses] = useState([]);
  const [subjectsData, setSubjectsData] = useState([]);
  const [scheduleRows, setScheduleRows] = useState([]);
  const [gradeCompletion, setGradeCompletion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [kpiStats, setKpiStats] = useState({
    subjectsHandled: 0,
    activeToday: 0,
    totalStudents: 0,
    classesToday: 0,
    nextClassTime: '--:--',
    pendingGrades: 0
  });

  const [userName, setUserName] = useState('');

  const calendarData = useMemo(() => {
    const today = new Date();
    const currentMonthYear = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ date: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isToday: i === today.getDate(),

        hasEvent: [5, 12, 18, 22].includes(i) 
      });
    }
    return { currentMonthYear, days };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    fetch('http://127.0.0.1:8000/api/grading/dashboard/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.kpiStats) setKpiStats(data.kpiStats);
        if (data.todayClasses) setTodayClasses(data.todayClasses);
        if (data.subjectsData) setSubjectsData(data.subjectsData);
        if (data.scheduleRows) setScheduleRows(data.scheduleRows);
        if (data.gradeCompletion) setGradeCompletion(data.gradeCompletion);
        
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard data:", err);
        setIsLoading(false);
      });

    fetch('http://127.0.0.1:8000/api/accounts/profile/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const prefix = data.title_prefix ? `${data.title_prefix} ` : '';
        const lastName = data.last_name || '';
        setUserName(`${prefix}${lastName}`);
      })
      .catch(err => console.error("Failed to fetch name:", err));
      
  }, []);

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-4 gap-6 mb-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-amber-400 p-5 shadow-sm">
          <Layers className="text-indigo-400 mb-3" size={24} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1C29]">
            {isLoading ? '-' : kpiStats.subjectsHandled}
          </h2>
          <p className="text-sm font-semibold text-gray-500 mt-1">Subjects Handled</p>
          <p className="text-xs text-gray-400 mt-1">{isLoading ? '-' : kpiStats.activeToday} active today</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-emerald-400 p-5 shadow-sm">
          <Users className="text-indigo-800 mb-3" size={24} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1C29]">
            {isLoading ? '-' : kpiStats.totalStudents}
          </h2>
          <p className="text-sm font-semibold text-gray-500 mt-1">Total Students</p>
          <p className="text-xs text-gray-400 mt-1">Across all sections</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-blue-400 p-5 shadow-sm">
          <CalendarDays className="text-indigo-300 mb-3" size={24} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1C29]">
            {isLoading ? '-' : kpiStats.classesToday}
          </h2>
          <p className="text-sm font-semibold text-gray-500 mt-1">Classes Today</p>
          <p className="text-xs text-gray-400 mt-1">Next: {isLoading ? '--:--' : kpiStats.nextClassTime}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-purple-400 p-5 shadow-sm">
          <AlertTriangle className="text-amber-400 mb-3" size={24} />
          <h2 className="text-3xl font-serif font-bold text-[#1A1C29]">
            {isLoading ? '-' : kpiStats.pendingGrades}
          </h2>
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
              {todayClasses.length === 0 && !isLoading ? (
                <p className="text-sm text-gray-500 italic">No classes scheduled for today.</p>
              ) : (
                todayClasses.map((cls) => (
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
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-serif font-bold text-[#1A1C29] mb-4">{calendarData.currentMonthYear}</h2>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-[10px] font-bold text-gray-400 tracking-wider py-1">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {calendarData.days.map((day, i) => (
                <div key={i} className="py-1.5 flex flex-col items-center justify-center relative">
                  {day.date === null ? (
                    <span className="text-transparent">0</span>
                  ) : day.isToday ? (
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
              {gradeCompletion.length === 0 && !isLoading ? (
                <p className="text-sm text-gray-500 italic">No grading data available.</p>
              ) : (
                gradeCompletion.map((subject, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-[#1A1C29]">{subject.name}</span>
                      <span className="font-bold text-[#1A1C29]">{subject.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className={`${subject.percentage < 60 ? 'bg-red-500' : 'bg-amber-400'} h-1.5 rounded-full`} 
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
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
            {scheduleRows.length === 0 && !isLoading ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-sm text-gray-500 italic border-b border-gray-50">
                  No classes scheduled.
                </td>
              </tr>
            ) : (
              scheduleRows.map((row, i) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
      {subjectsData.length === 0 && !isLoading ? (
        <p className="col-span-full text-center py-12 text-gray-500 italic">No subjects assigned yet.</p>
      ) : (
        subjectsData.map((sub, i) => (
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
        ))
      )}
    </div>
  );

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {userName || 'Loading...'} — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
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