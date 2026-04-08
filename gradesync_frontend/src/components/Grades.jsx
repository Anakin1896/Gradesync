import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Edit3, FileSpreadsheet, Loader2, X, Save, Calculator, AlertCircle } from 'lucide-react';

const Grades = () => {
  const [classes, setClasses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [isSavingGrade, setIsSavingGrade] = useState(false);

  const [manualFinal, setManualFinal] = useState('');
  const [manualRemarks, setManualRemarks] = useState('');

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  });

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([
      fetch('http://127.0.0.1:8000/api/grading/dashboard/', { headers: getAuthHeaders() }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/api/grading/enrollments/', { headers: getAuthHeaders() }).then(res => res.json())
    ])
    .then(([dashData, enrollData]) => {
      if (dashData.classes) {

        setClasses(dashData.classes);
        if (dashData.classes.length > 0) setSelectedClassId(dashData.classes[0].id.toString());
      }
      setEnrollments(enrollData);
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Failed to fetch gradebook data:", err);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) fetchData();
  }, []);

  const selectedClass = classes.find(c => c.id.toString() === selectedClassId);

  const template = selectedClass?.grading_template || null;
  const periods = template?.items || [];
  const hasTemplate = periods.length > 0;

  const getPeriodGrade = (enrollment, templateItem) => {
    if (!enrollment.period_grades) return null;
    const pg = enrollment.period_grades.find(g => 
      (g.period && g.period.period_id === templateItem.period) || 
      g.period === templateItem.period
    );
    return pg && pg.computed_grade ? parseFloat(pg.computed_grade).toFixed(1) : '--';
  };

  const calculateProjectedFinal = (enrollment) => {
    let finalScore = 0;
    let totalWeightApplied = 0;
    let hasGrades = false;

    periods.forEach(p => {
      const grade = getPeriodGrade(enrollment, p);
      if (grade !== '--') {
        finalScore += parseFloat(grade) * (parseFloat(p.weight_percentage) / 100);
        totalWeightApplied += parseFloat(p.weight_percentage);
        hasGrades = true;
      }
    });

    if (!hasGrades) return { grade: null, remarks: 'No Grade' };

    const projectedFinal = (finalScore / (totalWeightApplied / 100)).toFixed(2);
    
    let remarks = "Failed";
    if (projectedFinal >= 75) remarks = "Passed";
    else if (projectedFinal >= 70) remarks = "Conditional";

    return { grade: projectedFinal, remarks };
  };

  const openGradeModal = (enrollment) => {
    setSelectedEnrollment(enrollment);
    const projected = calculateProjectedFinal(enrollment);

    setManualFinal(enrollment.final_grade || projected.grade || '');
    setManualRemarks(enrollment.remarks || projected.remarks);
    
    setIsGradeModalOpen(true);
  };

  const closeGradeModal = () => {
    setIsGradeModalOpen(false);
    setSelectedEnrollment(null);
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    setIsSavingGrade(true);

    const payload = {
      final_grade: manualFinal || null,
      remarks: manualRemarks !== "No Grade" ? manualRemarks : null
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/grading/enrollments/${selectedEnrollment.enrollment_id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setEnrollments(prev => prev.map(enrollment => 
          enrollment.enrollment_id === selectedEnrollment.enrollment_id 
            ? { ...enrollment, ...payload } 
            : enrollment
        ));
        closeGradeModal();
      } else {
        alert("Failed to save final grade. Please check the network tab.");
      }
    } catch (err) {
      console.error("Error saving grade:", err);
      alert("Network error occurred.");
    } finally {
      setIsSavingGrade(false);
    }
  };

  const currentClassStudents = enrollments.filter(e => {
    if (!e.student || !e.class_field) return false;
    const matchesClass = e.class_field.class_id.toString() === selectedClassId;
    const fullName = `${e.student.first_name} ${e.student.last_name}`.toLowerCase();
    const studentNum = (e.student.student_number || '').toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || studentNum.includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleExportGrades = () => {
    if (currentClassStudents.length === 0 || !hasTemplate) {
      alert("Cannot export. Make sure students are enrolled and a grading template is assigned.");
      return;
    }

    const headers = [
      "Student ID", "Last Name", "First Name", "Program", "Year Level", 
      ...periods.map(p => p.name),
      "Overall Final Grade", "Remarks"
    ];

    const csvRows = [headers.join(",")];

    currentClassStudents.forEach(e => {
      const student = e.student || {};
      const dynamicPeriodGrades = periods.map(p => getPeriodGrade(e, p));
      
      const row = [
        student.student_number || '',
        `"${student.last_name || ''}"`, 
        `"${student.first_name || ''}"`,
        student.program?.code || 'N/A',
        student.current_year_level || '',
        ...dynamicPeriodGrades,
        e.final_grade || '',
        e.remarks || ''
      ];
      
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const safeClassName = selectedClass ? `${selectedClass.subject}_${selectedClass.section}`.replace(/[^a-z0-9]/gi, '_') : 'Class';
    const filename = `Grades_${safeClassName}.csv`;

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl animate-in fade-in duration-300 relative pb-10">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">Gradebook</h1>
          <p className="text-gray-500 mt-1">Manage and evaluate student performance</p>
        </div>

        <button 
          onClick={handleExportGrades}
          disabled={!hasTemplate}
          className="flex items-center space-x-2 bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm text-sm"
        >
          <FileSpreadsheet size={18} />
          <span>Export Grades</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-t-2xl border border-gray-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <div className="bg-white p-1.5 rounded shadow-sm text-amber-500"><BookOpen size={18} /></div>
          <select 
            value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-transparent border-none text-sm font-bold text-[#1A1C29] focus:ring-0 cursor-pointer pr-8 py-1 focus:outline-none"
          >
            {classes.length === 0 ? <option value="">No classes available</option> : classes.map(cls => <option key={cls.id} value={cls.id}>{cls.subject} — {cls.section}</option>)}
          </select>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400" />
        </div>
      </div>

      {!hasTemplate && !isLoading ? (
        <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl p-16 flex flex-col items-center justify-center text-center">
          <AlertCircle className="text-amber-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-[#1A1C29]">No Grading Template Assigned</h3>
          <p className="text-gray-500 mt-2 max-w-md">
            To view the gradebook, this class needs a grading rule set. Go to the <b>Dashboard</b>, edit this class, and assign a Grading Template from the dropdown.
          </p>
        </div>
      ) : (
        <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-225">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-[11px] font-bold text-gray-500 tracking-wider border-r border-gray-100">STUDENT</th>

                  {periods.map((p, idx) => (
                    <th key={idx} className="p-4 text-[11px] font-bold text-gray-500 tracking-wider text-center border-r border-gray-100/50">
                      {p.name.toUpperCase()} <span className="text-[9px] block text-amber-600/70">{p.weight_percentage}%</span>
                    </th>
                  ))}

                  <th className="p-4 text-[11px] font-bold text-[#1A1C29] tracking-wider text-center bg-amber-50/30">FINAL GRADE</th>
                  <th className="p-4 text-[11px] font-bold text-gray-500 tracking-wider text-center">REMARKS</th>
                  <th className="p-4 text-[11px] font-bold text-gray-500 tracking-wider text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={periods.length + 4} className="p-12 text-center text-gray-500"><Loader2 className="animate-spin mx-auto mb-2" size={28} />Loading gradebook...</td></tr>
                ) : currentClassStudents.length === 0 ? (
                  <tr><td colSpan={periods.length + 4} className="p-12 text-center text-gray-500 font-medium">No students enrolled in this class yet.</td></tr>
                ) : (
                  currentClassStudents.map((e) => {
                    const hasFinal = e.final_grade !== null && e.final_grade !== undefined;
                    const finalGrade = hasFinal ? Number(e.final_grade).toFixed(2) : '--';
                    
                    let remarkColor = "bg-gray-50 text-gray-500 border-gray-200";
                    if (e.remarks === "Passed") remarkColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    if (e.remarks === "Failed") remarkColor = "bg-red-50 text-red-600 border-red-200";
                    if (e.remarks === "Conditional") remarkColor = "bg-amber-50 text-amber-600 border-amber-200";

                    return (
                      <tr key={e.enrollment_id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 border-r border-gray-100">
                          <div className="font-bold text-[#1A1C29]">{e.student.last_name}, {e.student.first_name}</div>
                          <div className="text-[11px] font-semibold text-gray-400 mt-0.5">{e.student.student_number}</div>
                        </td>

                        {periods.map((p, idx) => (
                          <td key={idx} className="p-4 text-center font-bold text-gray-600 border-r border-gray-100/50">
                            {getPeriodGrade(e, p)}
                          </td>
                        ))}

                        <td className="p-4 text-center bg-amber-50/30">
                          <span className={`text-lg font-bold ${hasFinal ? 'text-[#1A1C29]' : 'text-gray-300'}`}>{finalGrade}</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${remarkColor}`}>
                            {e.remarks || 'No Grade'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => openGradeModal(e)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs rounded-lg transition-colors border border-amber-200"
                          >
                            <Edit3 size={14} />
                            <span>Finalize</span>
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
      )}

      {isGradeModalOpen && selectedEnrollment && (
        <div className="fixed inset-0 bg-[#1A1C29]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <Calculator size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#1A1C29]">Finalize Grade</h2>
                  <p className="text-xs text-gray-500 font-medium">{selectedEnrollment.student.last_name}, {selectedEnrollment.student.first_name}</p>
                </div>
              </div>
              <button onClick={closeGradeModal} className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1.5 rounded-lg border border-gray-200 shadow-sm">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGrade}>
              <div className="p-6">
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                  <h3 className="text-[10px] font-bold text-gray-500 tracking-wider mb-3 uppercase">Computed Period Grades</h3>
                  <div className="space-y-2">
                    {periods.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-600">{p.name} <span className="text-xs text-gray-400 ml-1">({p.weight_percentage}%)</span></span>
                        <span className="font-bold text-[#1A1C29]">{getPeriodGrade(selectedEnrollment, p)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-center relative overflow-hidden mb-6">
                  <p className="text-xs font-bold text-amber-700/70 tracking-wider mb-3">OFFICIAL FINAL GRADE</p>
                  
                  <div className="flex justify-center items-center gap-4">
                    <div className="relative w-32">
                      <input 
                        type="number" step="0.01" min="0" max="100" 
                        value={manualFinal} onChange={(e) => setManualFinal(e.target.value)} 
                        className="w-full text-3xl font-black text-center bg-white border border-amber-200 rounded-lg py-2 focus:outline-none focus:border-amber-400 text-[#1A1C29]" 
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <select 
                      value={manualRemarks} 
                      onChange={(e) => setManualRemarks(e.target.value)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer bg-white"
                    >
                      <option value="Passed">PASSED</option>
                      <option value="Conditional">CONDITIONAL</option>
                      <option value="Failed">FAILED</option>
                      <option value="No Grade">NO GRADE YET</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-400 italic font-medium">
                  The final grade is auto-calculated based on your template. You can manually adjust it here if needed before locking it in.
                </p>

              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                <button type="button" onClick={closeGradeModal} disabled={isSavingGrade} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSavingGrade} className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 text-[#1A1C29] transition-colors shadow-sm">
                  {isSavingGrade ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Lock Official Grade</span>
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