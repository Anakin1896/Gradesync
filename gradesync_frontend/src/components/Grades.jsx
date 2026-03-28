import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const Grades = () => {
  const [selectedClass, setSelectedClass] = useState('Gen. Biology 2 - STEM A');

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setIsLoading(false);
  }, []);

  const getRemarkBadge = (remark) => {
    switch(remark) {
      case 'Passed': return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Passed</span>;
      case 'Conditional': return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Conditional</span>;
      case 'Failed': return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">Failed</span>;
      default: return <span>{remark}</span>;
    }
  };

  return (
    <div className="max-w-6xl">
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
          <Download size={18} />
          <span>Export Grades</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
        <h2 className="text-lg font-serif font-bold text-[#1A1C29] mb-6 px-2">
          Grade Summary – 4 Grading Periods
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 font-semibold text-[11px] tracking-wider text-gray-400 w-[25%]">STUDENT</th>
                <th className="py-4 px-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold tracking-wider uppercase">Pre-Mid</span>
                </th>
                <th className="py-4 px-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold tracking-wider uppercase">Midterm</span>
                </th>
                <th className="py-4 px-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold tracking-wider uppercase">Pre-Finals</span>
                </th>
                <th className="py-4 px-4 text-center">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold tracking-wider uppercase">Finals</span>
                </th>
                <th className="py-4 px-4 font-semibold text-[11px] tracking-wider text-gray-400 text-center">FINAL GRADE</th>
                <th className="py-4 px-4 font-semibold text-[11px] tracking-wider text-gray-400 text-center">REMARKS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">Loading grades...</td>
                </tr>
              ) : tableData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500 italic">No grading data found.</td>
                </tr>
              ) : (
                tableData.map((student) => (
                  <tr key={student.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-sm font-semibold text-[#1A1C29]">{student.name}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600 text-center">{student.preMid || '-'}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600 text-center">{student.midterm || '-'}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600 text-center">{student.preFinals || '-'}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600 text-center">{student.finals || '-'}</td>
                    <td className={`py-4 px-4 text-sm font-bold text-center ${student.finalGrade < 75 ? 'text-red-500' : 'text-[#1A1C29]'}`}>
                      {student.finalGrade ? student.finalGrade.toFixed(1) : '-'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {getRemarkBadge(student.remark || 'N/A')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Grades;