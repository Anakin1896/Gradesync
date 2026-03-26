import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const Attendance = () => {

  const [selectedClass, setSelectedClass] = useState('Gen. Biology 2 - STEM A');
  const [selectedMonth, setSelectedMonth] = useState('March 2026');

  const [students] = useState([
    { id: 1, name: 'Alcantara, Juan M.' },
    { id: 2, name: 'Bautista, Ana R.' },
    { id: 3, name: 'Cruz, Carlo P.' },
    { id: 4, name: 'Dela Rosa, Mia C.' },
    { id: 5, name: 'Enriquez, Paolo S.' },
  ]);

  const [dates, setDates] = useState(['MAR 3', 'MAR 5', 'MAR 10', 'MAR 12', 'MAR 17', 'MAR 19', 'MAR 24', 'MAR 26']);

  const [records, setRecords] = useState({
    '1-MAR 3': 'P', '1-MAR 5': 'P', '1-MAR 10': 'P', '1-MAR 12': 'L', '1-MAR 17': 'P', '1-MAR 19': 'P', '1-MAR 24': 'P', '1-MAR 26': 'P',
    '2-MAR 3': 'P', '2-MAR 5': 'P', '2-MAR 10': 'P', '2-MAR 12': 'P', '2-MAR 17': 'P', '2-MAR 19': 'P', '2-MAR 24': 'P', '2-MAR 26': 'P',
    '3-MAR 3': 'P', '3-MAR 5': 'A', '3-MAR 10': 'A', '3-MAR 12': 'P', '3-MAR 17': 'L', '3-MAR 19': 'P', '3-MAR 24': 'A', '3-MAR 26': 'P',
    '4-MAR 3': 'P', '4-MAR 5': 'P', '4-MAR 10': 'P', '4-MAR 12': 'E', '4-MAR 17': 'P', '4-MAR 19': 'P', '4-MAR 24': 'P', '4-MAR 26': 'P',
    '5-MAR 3': 'A', '5-MAR 5': 'A', '5-MAR 10': 'P', '5-MAR 12': 'A', '5-MAR 17': 'P', '5-MAR 19': 'A', '5-MAR 24': 'P', '5-MAR 26': 'P',
  });

  const toggleAttendance = (studentId, date) => {
    const key = `${studentId}-${date}`;
    const currentStatus = records[key];
    
    let nextStatus = 'P';
    if (currentStatus === 'P') nextStatus = 'A';
    else if (currentStatus === 'A') nextStatus = 'L';
    else if (currentStatus === 'L') nextStatus = 'E';
    else if (currentStatus === 'E') nextStatus = null;

    setRecords({
      ...records,
      [key]: nextStatus
    });
  };

  const handleAddDate = () => {
    const newDate = window.prompt("Enter new class date (e.g., MAR 28):");
    if (newDate && !dates.includes(newDate.toUpperCase())) {
      setDates([...dates, newDate.toUpperCase()]);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'P': return 'text-emerald-500';
      case 'A': return 'text-red-500';
      case 'L': return 'text-amber-500';
      case 'E': return 'text-blue-500';
      default: return 'text-gray-300';
    }
  };

  const calculateTotals = (studentId) => {
    let present = 0;
    let absent = 0;
    let totalMarked = 0;

    dates.forEach(date => {
      const status = records[`${studentId}-${date}`];
      if (status) totalMarked++;
      if (status === 'P') present++;
      if (status === 'A') absent++;
    });

    const rate = totalMarked === 0 ? 0 : Math.round((present / totalMarked) * 100);
    return { present, absent, rate };
  };

  const getRateBadgeStyle = (rate) => {
    if (rate >= 90) return 'bg-emerald-100 text-emerald-700';
    if (rate >= 75) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="max-w-6xl">

      <div className="flex justify-between items-end mb-6">
        <div className="flex gap-4">
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm min-w-55"
          >
            <option>Gen. Biology 2 - STEM A</option>
            <option>Physics 1 - STEM B</option>
          </select>

          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer shadow-sm"
          >
            <option>March 2026</option>
            <option>February 2026</option>
          </select>
        </div>

        <button 
          onClick={handleAddDate}
          className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Add Date</span>
        </button>
      </div>

      <div className="flex items-center gap-6 mb-4 px-1 text-sm text-gray-500 font-medium">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500"></span> Present</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500"></span> Absent</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500"></span> Late</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-blue-500"></span> Excused</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 font-semibold text-[11px] tracking-wider text-gray-400 sticky left-0 bg-white z-10 w-48">
                  STUDENT
                </th>

                {dates.map((date, index) => (
                  <th key={index} className="py-4 px-2 font-semibold text-[11px] tracking-wider text-gray-400 text-center w-16">
                    {date}
                  </th>
                ))}

                <th className="py-4 px-4 font-semibold text-[11px] tracking-wider text-gray-400 text-center w-20 border-l border-gray-100">PRESENT</th>
                <th className="py-4 px-4 font-semibold text-[11px] tracking-wider text-gray-400 text-center w-20">ABSENT</th>
                <th className="py-4 px-4 font-semibold text-[11px] tracking-wider text-gray-400 text-center w-20">RATE</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const totals = calculateTotals(student.id);
                
                return (
                  <tr key={student.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">

                    <td className="py-4 px-6 text-sm font-semibold text-[#1A1C29] sticky left-0 bg-white group-hover:bg-gray-50/50">
                      {student.name}
                    </td>

                    {dates.map((date, colIndex) => {
                      const status = records[`${student.id}-${date}`];
                      return (
                        <td key={colIndex} className="py-4 px-2 text-center">
                          <button
                            onClick={() => toggleAttendance(student.id, date)}
                            className={`w-full h-8 flex items-center justify-center font-bold text-sm transition-colors hover:bg-gray-100 rounded cursor-pointer ${getStatusColor(status)}`}
                          >
                            {status || '-'}
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-4 px-4 text-center font-semibold text-sm text-emerald-500 border-l border-gray-100">{totals.present}</td>
                    <td className="py-4 px-4 text-center font-semibold text-sm text-red-500">{totals.absent}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block w-14 text-center ${getRateBadgeStyle(totals.rate)}`}>
                        {totals.rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;