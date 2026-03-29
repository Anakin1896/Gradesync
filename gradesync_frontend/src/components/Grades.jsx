import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Edit3, FileSpreadsheet, Loader2, Award, X, Save } from 'lucide-react';

const Grades = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  });

  const fetchGrades = () => {
    fetch('http://127.0.0.1:8000/api/grading/enrollments/', {
      method: 'GET',
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        setEnrollments(data);
        if (data.length > 0 && !selectedClassId) {
          const firstClassId = data.find(e => e.class_field)?.class_field?.class_id;
          if (firstClassId) setSelectedClassId(firstClassId.toString());
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch grades:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) fetchGrades();
  }, []);

  const openGradeModal = (enrollment) => {
    setSelectedEnrollment(enrollment);

    setGradeInput(enrollment.final_grade !== null ? enrollment.final_grade : '');
    setIsGradeModalOpen(true);
  };

  const closeGradeModal = () => {
    setIsGradeModalOpen(false);
    setSelectedEnrollment(null);
    setGradeInput('');
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    setIsSavingGrade(true);

    const numericGrade = parseFloat(gradeInput);

    let remarks = "Failed";
    if (numericGrade >= 75) remarks = "Passed";
    else if (numericGrade >= 70) remarks = "Conditional";

    try {

      const response = await fetch(`http://127.0.0.1:8000/api/grading/enrollments/${selectedEnrollment.enrollment_id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          final_grade: numericGrade.toFixed(2),
          remarks: remarks
        })
      });

      if (response.ok) {

        setEnrollments(prev => prev.map(enrollment => 
          enrollment.enrollment_id === selectedEnrollment.enrollment_id 
            ? { ...enrollment, final_grade: numericGrade.toFixed(2), remarks: remarks } 
            : enrollment
        ));
        closeGradeModal();
      } else {
        alert("Failed to save grade. Please check the value.");
      }
    } catch (err) {
      console.error("Error saving grade:", err);
      alert("Network error occurred.");
    } finally {
      setIsSavingGrade(false);
    }
  };

  const uniqueClasses = [];
  const classMap = new Map();
  
  enrollments.forEach(e => {
    if (e.class_field && !classMap.has(e.class_field.class_id)) {
      classMap.set(e.class_field.class_id, true);
      const subjectCode = e.class_field.subject?.code || 'Unknown Subject';
      let sectionName = e.class_field.section?.name || 'Unknown Block';
      const programCode = e.student?.program?.code || '';
      if (programCode && !sectionName.includes(programCode)) sectionName = `${programCode} ${sectionName}`;
      uniqueClasses.push({ id: e.class_field.class_id.toString(), displayName: `${subjectCode} — ${sectionName}` });
    }
  });

  const currentClassStudents = enrollments.filter(e => {
    if (!e.student || !e.class_field) return false;
    const matchesClass = e.class_field.class_id.toString() === selectedClassId;
    const fullName = `${e.student.first_name} ${e.student.last_name}`.toLowerCase();
    const studentNum = (e.student.student_number || '').toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || studentNum.includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="max-w-6xl animate-in fade-in duration-300 relative">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Gradebook</h1>
          <p className="text-gray-500 mt-1">Manage and evaluate student performance</p>
        </div>
        <button className="flex items-center space-x-2 bg-white border border-gray-200 hover:border-amber-400 hover:text-amber-600 text-gray-600 px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm text-sm">
          <FileSpreadsheet size={18} />
          <span>Export Grades</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-t-2xl border border-gray-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <div className="bg-white p-1.5 rounded shadow-sm text-amber-500"><BookOpen size={18} /></div>
          <select 
            value={selectedClassId} 
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-[#1A1C29] focus:ring-0 cursor-pointer pr-8 py-1 focus:outline-none"
          >
            {uniqueClasses.length === 0 ? <option value="">No classes available</option> : uniqueClasses.map(cls => <option key={cls.id} value={cls.id}>{cls.displayName}</option>)}
          </select>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
        </div>
      </div>

      <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider">STUDENT</th>
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider text-center">FINAL GRADE</th>
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider text-center">REMARKS</th>
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-2" size={24} />Loading gradebook...</td></tr>
              ) : currentClassStudents.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500 font-medium">No students enrolled in this class yet.</td></tr>
              ) : (
                currentClassStudents.map((e) => {
                  const hasGrade = e.final_grade !== null && e.final_grade !== undefined;
                  const finalGrade = hasGrade ? Number(e.final_grade).toFixed(2) : '--';
                  
                  let remarkColor = "bg-gray-50 text-gray-500 border-gray-200";
                  if (e.remarks === "Passed") remarkColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
                  if (e.remarks === "Failed") remarkColor = "bg-red-50 text-red-600 border-red-200";
                  if (e.remarks === "Conditional") remarkColor = "bg-amber-50 text-amber-600 border-amber-200";

                  return (
                    <tr key={e.enrollment_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-[#1A1C29]">{e.student.last_name}, {e.student.first_name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{e.student.student_number}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-lg font-bold ${hasGrade ? 'text-[#1A1C29]' : 'text-gray-300'}`}>{finalGrade}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${remarkColor}`}>
                          {e.remarks || 'No Grade'}
                        </span>
                      </td>
                      <td className="p-4 text-right">

                        <button 
                          onClick={() => openGradeModal(e)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-lg transition-colors border border-amber-200"
                        >
                          <Edit3 size={14} />
                          <span>{hasGrade ? 'Edit Grade' : 'Input Grade'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isGradeModalOpen && selectedEnrollment && (
        <div className="fixed inset-0 bg-[#1A1C29]/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Award size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#1A1C29]">Student Grade</h2>
                  <p className="text-xs text-gray-500 font-medium">{selectedEnrollment.student.last_name}, {selectedEnrollment.student.first_name}</p>
                </div>
              </div>
              <button onClick={closeGradeModal} className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1.5 rounded-lg border border-gray-200 shadow-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGrade}>
              <div className="p-6">
                <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">FINAL GRADE (0 - 100)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    max="100"
                    required
                    autoFocus
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 bg-white border-2 border-gray-200 rounded-xl text-2xl font-bold text-[#1A1C29] focus:outline-none focus:border-amber-400 text-center transition-colors"
                    placeholder="e.g. 85.50"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
                
                {/* Visual Hint for Remarks */}
                <div className="mt-4 flex justify-between text-xs font-semibold text-gray-400">
                  <span>Failed: &lt; 70</span>
                  <span>Cond: 70 - 74</span>
                  <span>Passed: &ge; 75</span>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeGradeModal}
                  disabled={isSavingGrade}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingGrade || !gradeInput}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 text-[#1A1C29] transition-colors shadow-sm"
                >
                  {isSavingGrade ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Grade</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Grades;