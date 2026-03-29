import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Loader2, X, Save } from 'lucide-react';

const Activities = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', type: 'Quiz', period: 'Pre-Midterm', perfect_score: 100, date: ''
  });

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/grading/enrollments/', { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => {
        const uniqueClasses = [];
        const classMap = new Map();
        data.forEach(e => {
          if (e.class_field && !classMap.has(e.class_field.class_id)) {
            classMap.set(e.class_field.class_id, true);
            const sub = e.class_field.subject?.code || 'Subject';
            let sec = e.class_field.section?.name || 'Block';
            const prog = e.student?.program?.code || '';
            if (prog && !sec.includes(prog)) sec = `${prog} ${sec}`;
            uniqueClasses.push({ id: e.class_field.class_id.toString(), name: `${sub} — ${sec}` });
          }
        });
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) setSelectedClassId(uniqueClasses[0].id);
      })
      .catch(err => console.error(err));
  }, []);

  const fetchActivities = () => {
    if (!selectedClassId) return;
    setIsLoading(true);
    fetch(`http://127.0.0.1:8000/api/grading/class-activities/${selectedClassId}/`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => { setActivities(data); setIsLoading(false); })
      .catch(err => { console.error(err); setIsLoading(false); });
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedClassId]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/grading/class-activities/${selectedClassId}/`, {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', type: 'Quiz', period: 'Pre-Midterm', perfect_score: 100, date: '' });
        fetchActivities(); 
      }
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  const filteredActivities = activities.filter(a => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Quizzes' && a.type === 'Quiz') return true;
    if (activeTab === 'Exams' && a.type === 'Exam') return true;
    if (activeTab === 'Activities' && (a.type === 'Activity' || a.type === 'Project')) return true;
    return false;
  });
  
  const groupedActivities = filteredActivities.reduce((acc, current) => {
    if (!acc[current.period]) acc[current.period] = [];
    acc[current.period].push(current);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl animate-in fade-in duration-300 relative pb-10">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Activities</h1>
          <p className="text-gray-500 mt-1">Manage quizzes, exams, and class activities</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm text-sm">
          <Plus size={18} /><span>Add Activity</span>
        </button>
      </div>

      <div className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-fit mb-8">
        <div className="bg-amber-50 p-1.5 rounded-lg text-amber-600"><BookOpen size={18} /></div>
        <select 
          value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}
          className="bg-transparent border-none text-sm font-bold text-[#1A1C29] focus:ring-0 cursor-pointer pr-8 py-1 focus:outline-none"
        >
          {classes.length === 0 ? <option value="">No classes available</option> : classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="flex space-x-2 mb-8">
        {['All', 'Quizzes', 'Activities', 'Exams'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
              activeTab === tab ? 'bg-amber-400 text-[#1A1C29] shadow-sm' : 'text-gray-500 hover:bg-gray-100 bg-white border border-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-400"><Loader2 className="animate-spin" size={32} /></div>
      ) : Object.keys(groupedActivities).length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium text-lg">No activities found for this tab.</p>
        </div>
      ) : (
        Object.entries(groupedActivities).map(([period, items]) => (
          <div key={period} className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">{period}</h3>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-4 text-[11px] font-bold text-gray-400 tracking-wider w-1/3">TITLE</th>
                    <th className="p-4 text-[11px] font-bold text-gray-400 tracking-wider">TYPE</th>
                    <th className="p-4 text-[11px] font-bold text-gray-400 tracking-wider">DATE</th>
                    <th className="p-4 text-[11px] font-bold text-gray-400 tracking-wider text-center">PERFECT SCORE</th>
                    <th className="p-4 text-[11px] font-bold text-gray-400 tracking-wider text-center">CLASS AVG</th>
                    <th className="p-4 text-[11px] font-bold text-gray-400 tracking-wider text-center">HIGHEST</th>
                    <th className="p-4 text-[11px] font-bold text-gray-400 tracking-wider text-center">LOWEST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map(item => {
                    let badgeColor = "bg-gray-50 text-gray-600";
                    if (item.type === 'Quiz') badgeColor = "bg-blue-50 text-blue-600 font-bold";
                    if (item.type === 'Activity') badgeColor = "bg-emerald-50 text-emerald-600 font-bold";
                    if (item.type === 'Exam') badgeColor = "bg-purple-50 text-purple-600 font-bold";
                    if (item.type === 'Project') badgeColor = "bg-orange-50 text-orange-600 font-bold";

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                        <td className="p-4 font-bold text-[#1A1C29] text-sm group-hover:text-amber-600 transition-colors">{item.title}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] ${badgeColor}`}>{item.type}</span>
                        </td>
                        <td className="p-4 text-sm text-gray-500 font-medium">{item.date}</td>
                        <td className="p-4 text-center text-sm font-semibold text-gray-400">{item.perfect_score}</td>
                        <td className="p-4 text-center font-bold text-[#1A1C29]">{item.class_avg}</td>
                        <td className="p-4 text-center font-bold text-emerald-500">{item.highest}</td>
                        <td className="p-4 text-center font-bold text-red-400">{item.lowest}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1A1C29]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold text-[#1A1C29]">New Activity</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:bg-gray-100 p-1.5 rounded-lg"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddActivity}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">TITLE *</label>
                  <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Quiz 1 - Cell Biology" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:border-amber-400 focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">TYPE</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:border-amber-400 focus:outline-none">
                      <option value="Quiz">Quiz</option><option value="Activity">Activity</option><option value="Exam">Exam</option><option value="Project">Project</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">GRADING PERIOD</label>
                    <select value={formData.period} onChange={(e) => setFormData({...formData, period: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:border-amber-400 focus:outline-none">
                      <option value="Pre-Midterm">Pre-Midterm</option><option value="Midterm">Midterm</option><option value="Pre-Finals">Pre-Finals</option><option value="Finals">Finals</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">PERFECT SCORE</label>
                    <input type="number" required min="1" value={formData.perfect_score} onChange={(e) => setFormData({...formData, perfect_score: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:border-amber-400 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">DATE GIVEN</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:border-amber-400 focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-bold bg-amber-400 hover:bg-amber-500 text-[#1A1C29] transition-colors shadow-sm">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} <span>Create Activity</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;