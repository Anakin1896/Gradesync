import React, { useState, useEffect } from 'react';
import { Edit2, Loader2 } from 'lucide-react';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}` 
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setError("Please log in to view your profile.");
      setIsLoading(false);
      return;
    }

    fetch('http://127.0.0.1:8000/api/accounts/profile/', {
      method: 'GET',
      headers: getAuthHeaders(),
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        setProfileData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data. Your session may have expired.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 font-medium bg-red-50/50 rounded-xl border border-red-100 max-w-4xl">
        {error}
      </div>
    );
  }

  const prefix = profileData.title_prefix ? `${profileData.title_prefix} ` : '';
  const mi = profileData.middle_initial ? `${profileData.middle_initial} ` : '';
  const fullName = `${prefix}${profileData.first_name} ${mi}${profileData.last_name}`;

  const initial = profileData.first_name ? profileData.first_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-4xl animate-in fade-in duration-300">

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
        

        <div className="flex items-start gap-6 mb-10 border-b border-gray-50 pb-8">

          <div className="w-24 h-24 rounded-full bg-[#1A1C29] flex items-center justify-center border-4 border-amber-400 shrink-0 shadow-sm">
            <span className="text-4xl font-serif font-bold text-amber-400">{initial}</span>
          </div>
          
          <div className="pt-2">
            <h2 className="text-2xl font-serif font-bold text-[#1A1C29]">{fullName}</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {profileData.department || 'No Department'} · {profileData.position_title || profileData.role}
            </p>
            <p className="text-sm font-medium text-amber-500 mt-1">
              {profileData.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">

          <div className="bg-[#FCFBF8] p-5 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">EMPLOYEE NO.</p>
            <p className="font-bold text-[#1A1C29] text-lg">{profileData.employee_id || 'N/A'}</p>
          </div>

          <div className="bg-[#FCFBF8] p-5 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">DEPARTMENT</p>
            <p className="font-bold text-[#1A1C29] text-lg">{profileData.department || 'N/A'}</p>
          </div>

          <div className="bg-[#FCFBF8] p-5 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">SCHOOL</p>
            <p className="font-bold text-[#1A1C29] text-lg">{profileData.school_name || 'N/A'}</p>
          </div>

          <div className="bg-[#FCFBF8] p-5 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">SUBJECTS HANDLED</p>
            <p className="font-bold text-[#1A1C29] text-lg">5</p> 
          </div>

        </div>

        <button className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 text-[#1A1C29] px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm text-sm">
          <Edit2 size={16} />
          <span>Edit Profile</span>
        </button>

      </div>
    </div>
  );
};

export default Profile;