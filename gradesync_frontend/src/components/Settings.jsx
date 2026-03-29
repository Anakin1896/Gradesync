import React, { useState, useEffect } from 'react';
import { Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const Settings = () => {

  const [settings, setSettings] = useState({
    notifications_enabled: true,
    active_school_year: '2025-2026',
    grading_system: '75 (CHED)',
    language: 'English (PH)'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accounts/settings/', {
      method: 'GET',
      headers: getAuthHeaders(),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setSettings(data);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch settings:", err);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/settings/', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSaveMessage({ text: 'Settings saved successfully!', type: 'success' });
        setTimeout(() => setSaveMessage({ text: '', type: '' }), 3000); 
      } else {
        setSaveMessage({ text: 'Failed to save settings.', type: 'error' });
      }
    } catch (error) {
      console.error("Error saving:", error);
      setSaveMessage({ text: 'Network error occurred.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl animate-in fade-in duration-300">

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 max-w-2xl">
        <h2 className="text-xl font-serif font-bold text-[#1A1C29] mb-6">App Settings</h2>

        <div className="space-y-6">

          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <h3 className="font-bold text-[#1A1C29] text-sm">Notifications</h3>
              <p className="text-sm text-gray-500 mt-0.5">Grade deadlines, attendance reminders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="notifications_enabled"
                checked={settings.notifications_enabled}
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <h3 className="font-bold text-[#1A1C29] text-sm">School Year</h3>
              <p className="text-sm text-gray-500 mt-0.5">Current active school year</p>
            </div>
            <select 
              name="active_school_year"
              value={settings.active_school_year}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer min-w-35"
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <h3 className="font-bold text-[#1A1C29] text-sm">Grading System</h3>
              <p className="text-sm text-gray-500 mt-0.5">Passing grade threshold</p>
            </div>
            <select 
              name="grading_system"
              value={settings.grading_system}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer min-w-35"
            >
              <option value="75 (DepEd)">75 (CHED)</option>
              <option value="60 (Standard)">60 (Standard)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <h3 className="font-bold text-[#1A1C29] text-sm">Language</h3>
              <p className="text-sm text-gray-500 mt-0.5">Interface language</p>
            </div>
            <select 
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-[#1A1C29] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer min-w-35"
            >
              <option value="English (PH)">English (PH)</option>
              <option value="Tagalog">Tagalog</option>
            </select>
          </div>

          <div className="pt-6 flex items-center gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-200 text-[#1A1C29] px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
            
            {saveMessage.text && (
              <span className={`text-sm font-semibold flex items-center gap-1.5 animate-in fade-in ${saveMessage.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                {saveMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {saveMessage.text}
              </span>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Settings;