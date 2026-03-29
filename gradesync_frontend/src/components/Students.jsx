import React, { useState, useEffect } from 'react';
import { Search, Users, Loader2, UserPlus, X, Save } from 'lucide-react';

const Students = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    student_number: '',
    first_name: '',
    last_name: '',
    sex: 'M'
  });

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  });

  const fetchStudents = () => {
    fetch('http://127.0.0.1:8000/api/grading/enrollments/', {
      method: 'GET',
      headers: getAuthHeaders()
    })
      .then(res => res.json())
      .then(data => {
        setEnrollments(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch students:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/grading/quick-enroll/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ student_number: '', first_name: '', last_name: '', sex: 'M' });
        fetchStudents();
      } else {
        alert("Failed to add student. Please check your inputs.");
      }
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = enrollments.filter(enrollment => {
    if (!enrollment.student) return false; 
    const fullName = `${enrollment.student.first_name} ${enrollment.student.last_name}`.toLowerCase();
    const studentNum = (enrollment.student.student_number || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || studentNum.includes(searchLower);
  });

  return (
    <div className="max-w-6xl animate-in fade-in duration-300 relative">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">My Students</h1>
          <p className="text-gray-500 mt-1">Manage and view your class rosters</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm text-sm"
        >
          <UserPlus size={18} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-t-2xl border border-gray-100 flex items-center justify-between shadow-sm">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or student number..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          <Users size={16} className="text-amber-500" />
          <span>Total: {filteredStudents.length}</span>
        </div>
      </div>

      <div className="bg-white border-x border-b border-gray-100 rounded-b-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider">STUDENT NO.</th>
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider">NAME</th>
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider">SEX</th>
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider">SUBJECT & SECTION</th>
                <th className="p-4 text-xs font-bold text-gray-500 tracking-wider">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading roster...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((enrollment) => {
                  const student = enrollment.student;
                  const sectionName = enrollment.class_field?.section?.name || 'N/A';
                  const subjectCode = enrollment.class_field?.subject?.code || 'N/A';
                  
                  return (
                    <tr key={enrollment.enrollment_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-semibold text-[#1A1C29] text-sm">{student.student_number}</td>
                      <td className="p-4">
                        <div className="font-bold text-[#1A1C29]">{student.last_name}, {student.first_name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{student.email || 'No email provided'}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{student.sex === 'M' ? 'Male' : 'Female'}</td>
                      <td className="p-4">
                        <div className="text-sm font-semibold text-[#1A1C29]">{subjectCode}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{sectionName}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {student.standing || 'Regular'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1A1C29]/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-serif font-bold text-[#1A1C29]">Quick Enroll Student</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">STUDENT NUMBER *</label>
                  <input 
                    type="text" 
                    name="student_number"
                    required
                    placeholder="e.g. 2026-0099"
                    value={formData.student_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">FIRST NAME *</label>
                    <input 
                      type="text" 
                      name="first_name"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">LAST NAME *</label>
                    <input 
                      type="text" 
                      name="last_name"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 tracking-wider mb-1.5">SEX</label>
                  <select 
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-bold bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 text-[#1A1C29] transition-colors shadow-sm"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>{isSaving ? 'Enrolling...' : 'Enroll Student'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      
    </div>
  );
};

export default Students;