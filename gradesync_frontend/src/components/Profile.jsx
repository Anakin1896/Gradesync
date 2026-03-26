import React from 'react';
import { Edit3 } from 'lucide-react';

const Profile = () => {
  
  const teacherData = {
    name: "Ms. Maria B. Santos",
    role: "Science Department · Teacher II",
    email: "maria.santos@deped.gov.ph",
    employeeNo: "2021-0042",
    department: "Science",
    school: "Naga City NHS",
    subjectsHandled: 5
  };

  return (
    <div className="max-w-3xl">
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-[#1A1C29] flex items-center justify-center bg-[#1A1C29] shrink-0 shadow-md">
            <span className="text-4xl font-serif font-bold text-amber-400">M</span>
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#1A1C29]">{teacherData.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{teacherData.role}</p>
            <p className="text-sm text-amber-600 mt-1">{teacherData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#FCFBF8] p-4 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">EMPLOYEE NO.</p>
            <p className="font-semibold text-[#1A1C29]">{teacherData.employeeNo}</p>
          </div>
          <div className="bg-[#FCFBF8] p-4 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">DEPARTMENT</p>
            <p className="font-semibold text-[#1A1C29]">{teacherData.department}</p>
          </div>
          <div className="bg-[#FCFBF8] p-4 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">SCHOOL</p>
            <p className="font-semibold text-[#1A1C29]">{teacherData.school}</p>
          </div>
          <div className="bg-[#FCFBF8] p-4 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">SUBJECTS HANDLED</p>
            <p className="font-semibold text-[#1A1C29]">{teacherData.subjectsHandled}</p>
          </div>
        </div>

        <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
          <Edit3 size={18} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;