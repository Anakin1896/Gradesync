import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Activities = () => {

  const [selectedClass, setSelectedClass] = useState('Gen. Biology 2 - STEM A');
  const [periodFilter, setPeriodFilter] = useState('All Periods');
  const [typeFilter, setTypeFilter] = useState('All');

  const [activities] = useState([
    {
      id: 1,
      period: 'Pre-Midterm',
      title: 'Quiz 1 – Cell Biology',
      type: 'Quiz',
      date: 'Jan 10, 2026',
      perfectScore: 50,
      classAvg: 42.3,
      highest: 49,
      lowest: 30,
    },
    {
      id: 2,
      period: 'Pre-Midterm',
      title: 'Activity 1 – Lab Report',
      type: 'Activity',
      date: 'Jan 17, 2026',
      perfectScore: 100,
      classAvg: 85.7,
      highest: 98,
      lowest: 72,
    },
    {
      id: 3,
      period: 'Pre-Midterm',
      title: 'Pre-Midterm Exam',
      type: 'Exam',
      date: 'Jan 28, 2026',
      perfectScore: 100,
      classAvg: 80.2,
      highest: 95,
      lowest: 62,
    },
    {
      id: 4,
      period: 'Midterm',
      title: 'Quiz 2 – Genetics',
      type: 'Quiz',
      date: 'Feb 12, 2026',
      perfectScore: 50,
      classAvg: 39.8,
      highest: 50,
      lowest: 28,
    },
    {
      id: 5,
      period: 'Midterm',
      title: 'Midterm Exam',
      type: 'Exam',
      date: 'Feb 25, 2026',
      perfectScore: 100,
      classAvg: 82.5,
      highest: 97,
      lowest: 58,
    }
  ]);

  const getTypeBadge = (type) => {
    switch(type) {
      case 'Quiz': return <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">Quiz</span>;
      case 'Activity': return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">Activity</span>;
      case 'Exam': return <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold">Exam</span>;
      default: return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">{type}</span>;
    }
  };

  let filteredActivities = activities;

  if (typeFilter !== 'All') {
    const typeMap = { 'Quizzes': 'Quiz', 'Activities': 'Activity', 'Exams': 'Exam' };
    filteredActivities = filteredActivities.filter(a => a.type === typeMap[typeFilter]);
  }

  if (periodFilter !== 'All Periods') {
    filteredActivities = filteredActivities.filter(a => a.period === periodFilter);
  }

  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    if (!groups[activity.period]) groups[activity.period] = [];
    groups[activity.period].push(activity);
    return groups;
  }, {});

  const periodOrder = ['Pre-Midterm', 'Midterm', 'Pre-Finals', 'Finals'];

  return (
    <div className="max-w-6xl">

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Activities & Exams</h1>
        <p className="text-gray-500 mt-1">Quizzes, activities, and exam records</p>
      </div>

      <div className="flex justify-between items-end mb-6">

        <div className="flex gap-4">
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm min-w-[220px]"
          >
            <option>Gen. Biology 2 - STEM A</option>
            <option>Physics 1 - STEM B</option>
          </select>

          <select 
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm min-w-[160px]"
          >
            <option>All Periods</option>
            <option>Pre-Midterm</option>
            <option>Midterm</option>
            <option>Pre-Finals</option>
            <option>Finals</option>
          </select>
        </div>

        <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm">
          <Plus size={18} />
          <span>Add Activity</span>
        </button>
      </div>

      <div className="flex gap-3 mb-8">
        {['All', 'Quizzes', 'Activities', 'Exams'].map((tab) => (
          <button
            key={tab}
            onClick={() => setTypeFilter(tab)}
            className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
              typeFilter === tab 
                ? 'bg-amber-400 border-amber-400 text-[#1A1C29] shadow-sm' 
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {periodOrder.map(period => {
        const periodActivities = groupedActivities[period];
        if (!periodActivities || periodActivities.length === 0) return null;

        return (
          <div key={period} className="mb-8">

            <div className="flex items-center gap-4 mb-4 pl-2">
              <h2 className="text-[11px] font-bold text-indigo-500 tracking-widest uppercase bg-indigo-50 px-3 py-1 rounded">
                {period}
              </h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 w-[30%]">TITLE</th>
                    <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400">TYPE</th>
                    <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400">DATE</th>
                    <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-center">PERFECT SCORE</th>
                    <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-center">CLASS AVG</th>
                    <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-center">HIGHEST</th>
                    <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-center">LOWEST</th>
                  </tr>
                </thead>
                <tbody>
                  {periodActivities.map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 text-sm font-bold text-[#1A1C29]">{activity.title}</td>
                      <td className="py-4 px-6">{getTypeBadge(activity.type)}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-medium">{activity.date}</td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-medium text-center">{activity.perfectScore}</td>
                      <td className="py-4 px-6 text-sm font-bold text-[#1A1C29] text-center">{activity.classAvg}</td>
                      <td className="py-4 px-6 text-sm font-bold text-emerald-500 text-center">{activity.highest}</td>
                      <td className="py-4 px-6 text-sm font-bold text-red-500 text-center">{activity.lowest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        );
      })}

      {Object.keys(groupedActivities).length === 0 && (
        <div className="p-12 text-center text-gray-500 font-medium bg-white rounded-2xl border border-gray-200">
          No activities found for the selected filters.
        </div>
      )}

    </div>
  );
};

export default Activities;