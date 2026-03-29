import React, { useState, useEffect } from 'react';
import { Search, Users, Loader2, UserPlus } from 'lucide-react';

const Students = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    fetch('http://127.0.0.1:8000/api/grading/enrollments/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
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
  }, []);

  const filteredStudents = enrollments.filter(enrollment => {
    
    if (!enrollment.student) return false; 
    
    const fullName = `${enrollment.student.first_name} ${enrollment.student.last_name}`.toLowerCase();
    const studentNum = (enrollment.student.student_number || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) || studentNum.includes(searchLower);
  });

  return (
    <div className="max-w-6xl animate-in fade-in duration-300">

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#1A1C29]">My Students</h1>
          <p className="text-gray-500 mt-1">Manage and view your class rosters</p>
        </div>

        <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm text-sm">
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
                    No students found. Try adjusting your search!
                  </td>
                </tr>
              ) : (
                filteredStudents.map((enrollment) => {
                  const student = enrollment.student;
                  const sectionName = enrollment.class_field?.section?.name || 'N/A';
                  const subjectCode = enrollment.class_field?.subject?.code || 'N/A';
                  
                  return (
                    <tr key={enrollment.enrollment_id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-semibold text-[#1A1C29] text-sm">
                        {student.student_number}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-[#1A1C29]">
                          {student.last_name}, {student.first_name} {student.middle_name || ''}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{student.email || 'No email provided'}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {student.sex === 'M' ? 'Male' : student.sex === 'F' ? 'Female' : 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-semibold text-[#1A1C29]">{subjectCode}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{sectionName}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          student.standing === 'Regular' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          student.standing === 'Conditional' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-red-50 text-red-600 border border-red-100'
                        }`}>
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
      
    </div>
  );
};

export default Students;