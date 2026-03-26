import React, { useState } from 'react';
import { Plus, FileText, CheckCircle, Clock, Calendar, MoreVertical, BookOpen, Presentation } from 'lucide-react';

const Activities = () => {
  const [filter, setFilter] = useState('All');

  const [activities] = useState([
    {
      id: 1,
      title: "Cell Division Lab Report",
      type: "Assignment",
      class: "Gen. Biology 2 - STEM A",
      dueDate: "Mar 28, 2026",
      status: "Pending",
      submissions: 38,
      totalStudents: 40,
    },
    {
      id: 2,
      title: "Unit 2 Quiz: Genetics",
      type: "Quiz",
      class: "Gen. Biology 2 - STEM A",
      dueDate: "Mar 25, 2026",
      status: "Graded",
      submissions: 40,
      totalStudents: 40,
    },
    {
      id: 3,
      title: "Newton's Laws Worksheet",
      type: "Assignment",
      class: "Physics 1 - STEM B",
      dueDate: "Mar 27, 2026",
      status: "Pending",
      submissions: 30,
      totalStudents: 35,
    },
    {
      id: 4,
      title: "Ecosystem Diorama",
      type: "Project",
      class: "Gen. Biology 2 - STEM A",
      dueDate: "Apr 15, 2026",
      status: "Upcoming",
      submissions: 0,
      totalStudents: 40,
    },
    {
      id: 5,
      title: "Midterm Examination",
      type: "Quiz",
      class: "Physics 1 - STEM B",
      dueDate: "Mar 20, 2026",
      status: "Graded",
      submissions: 35,
      totalStudents: 35,
    }
  ]);

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Assignment': return <FileText size={20} className="text-blue-500" />;
      case 'Quiz': return <BookOpen size={20} className="text-purple-500" />;
      case 'Project': return <Presentation size={20} className="text-pink-500" />;
      default: return <FileText size={20} className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Graded': 
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5"><CheckCircle size={14}/> Graded</span>;
      case 'Pending': 
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center gap-1.5"><Clock size={14}/> Needs Grading</span>;
      case 'Upcoming': 
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center gap-1.5"><Calendar size={14}/> Upcoming</span>;
      default: return null;
    }
  };

  const filteredActivities = filter === 'All' 
    ? activities 
    : activities.filter(a => a.type === filter);

  return (
    <div className="max-w-5xl">

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Activities</h1>
          <p className="text-gray-500 mt-1">Manage assignments, quizzes, and projects</p>
        </div>
        <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
          <Plus size={18} />
          <span>Create Activity</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="flex border-b border-gray-100 bg-[#FCFBF8] px-6 pt-4 gap-6">
          {['All', 'Assignment', 'Quiz', 'Project'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-4 text-sm font-semibold transition-colors relative ${
                filter === tab ? 'text-[#1A1C29]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}{tab !== 'All' ? 's' : ''}

              {filter === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-100">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 mt-1">
                  {getTypeIcon(activity.type)}
                </div>
                <div>
                  <h3 className="font-bold text-[#1A1C29] text-lg group-hover:text-amber-600 transition-colors cursor-pointer">
                    {activity.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500 font-medium">
                    <span className="text-[#1A1C29] bg-gray-100 px-2 py-0.5 rounded text-xs">{activity.class}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} className="text-gray-400"/> Due: {activity.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-1">SUBMISSIONS</p>
                  <p className="font-semibold text-[#1A1C29]">
                    <span className={activity.submissions === activity.totalStudents ? 'text-emerald-500' : ''}>
                      {activity.submissions}
                    </span>
                    <span className="text-gray-400"> / {activity.totalStudents}</span>
                  </p>
                </div>

                <div className="w-32 flex justify-end">
                  {getStatusBadge(activity.status)}
                </div>

                <button className="p-2 text-gray-400 hover:text-[#1A1C29] hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="p-12 text-center text-gray-500 font-medium">
            No activities found for this category.
          </div>
        )}

      </div>
    </div>
  );
};

export default Activities;