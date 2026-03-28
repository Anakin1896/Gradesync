import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2 } from 'lucide-react';

const Students = () => {
  const [selectedClass, setSelectedClass] = useState('Gen. Biology 2 - STEM A');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // API Fetch will go here
    setIsLoading(false);
  }, []);

  const getStandingBadge = (standing) => {
    switch(standing) {
      case 'Regular': return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Regular</span>;
      case 'Conditional': return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Conditional</span>;
      case 'At Risk': return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">At Risk</span>;
      default: return <span>{standing}</span>;
    }
  };

  const getSexBadge = (sex) => {
    return sex === 'M' 
      ? <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">M</span>
      : <span className="px-2.5 py-1 rounded-md bg-pink-50 text-pink-600 text-xs font-bold">F</span>;
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl relative">
      <div className="flex justify-between items-end mb-6">
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm min-w-55"
        >
          <option>Gen. Biology 2 - STEM A</option>
          <option>Physics 1 - STEM B</option>
        </select>

        <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm">
          <Plus size={18} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 w-12">#</th>
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400">STUDENT</th>
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400">STUDENT NO.</th>
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-center">SEX</th>
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-center">STANDING</th>
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-center">AVG GRADE</th>
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-center">ATTENDANCE</th>
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">Loading students...</td>
                </tr>
              ) : tableData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500 italic">No students enrolled in this class.</td>
                </tr>
              ) : (
                tableData.map((student, index) => (
                  <tr key={student.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-400">{index + 1}</td>
                    <td className="py-4 px-6 text-sm font-bold text-[#1A1C29]">{student.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-500">{student.studentNo}</td>
                    <td className="py-4 px-6 text-center">{getSexBadge(student.sex)}</td>
                    <td className="py-4 px-6 text-center">{getStandingBadge(student.standing)}</td>
                    <td className={`py-4 px-6 text-sm font-bold text-center ${student.avgGrade < 75 ? 'text-red-500' : 'text-[#1A1C29]'}`}>
                      {student.avgGrade.toFixed(1)}
                    </td>
                    <td className={`py-4 px-6 text-sm font-bold text-center ${student.attendance < 80 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {student.attendance}%
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => openEditModal(student)}
                        className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center justify-end gap-1 w-full transition-colors"
                      >
                        Edit <Edit2 size={14} className="ml-1"/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1A1C29]/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold text-[#1A1C29]">Edit Student</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">FULL NAME</label>
                <input 
                  type="text" 
                  defaultValue={editingStudent?.name}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">STUDENT NO.</label>
                  <input 
                    type="text" 
                    defaultValue={editingStudent?.studentNo}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">SEX</label>
                  <select 
                    defaultValue={editingStudent?.sex}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">STANDING</label>
                <select 
                  defaultValue={editingStudent?.standing}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                >
                  <option value="Regular">Regular</option>
                  <option value="Conditional">Conditional</option>
                  <option value="At Risk">At Risk</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={closeModal}
                className="px-5 py-2 rounded-lg text-sm font-bold bg-amber-400 hover:bg-amber-500 text-[#1A1C29] transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;