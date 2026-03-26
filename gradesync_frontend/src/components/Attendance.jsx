import React, { useState } from 'react';
import { Plus, Save, Calendar, Search } from 'lucide-react';

const Attendance = () => {

  const [selectedClass, setSelectedClass] = useState('Grade 10 - Newton');
  const [selectedMonth, setSelectedMonth] = useState('September 2025');

  const [students] = useState([
    { id: 1, name: 'Alvarez, Sofia M.' },
    { id: 2, name: 'Bautista, Luis T.' },
    { id: 3, name: 'Cruz, Isabella R.' },
    { id: 4, name: 'Domingo, Mateo K.' },
    { id: 5, name: 'Enriquez, Chloe J.' },
  ]);

  const [dates, setDates] = useState(['Sep 01', 'Sep 03', 'Sep 05', 'Sep 08', 'Sep 10']);

  const [records, setRecords] = useState({
    '1-Sep 01': 'P', '2-Sep 01': 'P', '3-Sep 01': 'P', '4-Sep 01': 'A', '5-Sep 01': 'P',
    '1-Sep 03': 'P', '2-Sep 03': 'L', '3-Sep 03': 'P', '4-Sep 03': 'P', '5-Sep 03': 'P',
  });

  const toggleAttendance = (studentId, date) => {
    const key = `${studentId}-${date}`;
    const currentStatus = records[key];
    
    let nextStatus = 'P'; // Default to Present
    if (currentStatus === 'P') nextStatus = 'A'; // Present -> Absent
    else if (currentStatus === 'A') nextStatus = 'L'; // Absent -> Late
    else if (currentStatus === 'L') nextStatus = null; // Late -> Empty

    setRecords({
      ...records,
      [key]: nextStatus
    });
  };

  const handleAddDate = () => {
    const newDate = window.prompt("Enter new class date (e.g., Sep 12):");
    if (newDate && !dates.includes(newDate)) {
      setDates([...dates, newDate]);
    }
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'P': return 'bg-emerald-100 text-emerald-700 font-bold border-emerald-200';
      case 'A': return 'bg-red-100 text-red-700 font-bold border-red-200';
      case 'L': return 'bg-amber-100 text-amber-700 font-bold border-amber-200';
      default: return 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl">

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Attendance</h1>
          <p className="text-gray-500 mt-1">Manage and track daily student attendance</p>
        </div>
        <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
          <Save size={18} />
          <span>Save Records</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-[#FCFBF8]">

          <div className="flex gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">SECTION</label>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer min-w-[180px]"
              >
                <option>Grade 10 - Newton</option>
                <option>Grade 10 - Einstein</option>
                <option>Grade 11 - Stem A</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">MONTH</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer min-w-[150px]"
              >
                <option>August 2025</option>
                <option>September 2025</option>
                <option>October 2025</option>
              </select>
            </div>
          </div>

          <div className="flex items-end h-full">
            <button 
              onClick={handleAddDate}
              className="flex items-center space-x-2 bg-white border border-gray-200 hover:border-amber-400 hover:text-amber-600 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors mt-4"
            >
              <Plus size={16} />
              <span>Add Date</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">

                <th className="p-4 font-semibold text-sm text-gray-600 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] min-w-[200px]">
                  Student Name
                </th>

                {dates.map((date, index) => (
                  <th key={index} className="p-4 font-semibold text-xs text-center text-gray-500 min-w-[80px]">
                    <div className="flex flex-col items-center">
                      <Calendar size={14} className="mb-1 text-gray-400" />
                      {date}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, rowIndex) => (
                <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">

                  <td className="p-4 text-sm font-medium text-[#1A1C29] sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    {rowIndex + 1}. {student.name}
                  </td>

                  {dates.map((date, colIndex) => {
                    const status = records[`${student.id}-${date}`];
                    return (
                      <td key={colIndex} className="p-2 text-center">
                        <button
                          onClick={() => toggleAttendance(student.id, date)}
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center mx-auto transition-all ${getStatusStyle(status)}`}
                          title="Click to cycle: Present -> Absent -> Late -> Empty"
                        >
                          {status || '-'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-6 justify-end text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-400"></span> P = Present</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400"></span> A = Absent</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400"></span> L = Late</div>
        </div>

      </div>
    </div>
  );
};

export default Attendance;