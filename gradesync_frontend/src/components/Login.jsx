import React, { useState } from 'react';
import { Layers, CheckCircle2, Eye, EyeOff, Lock, User, Key, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strength = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          username: employeeId, 
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        
        localStorage.setItem('auth_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        window.location.reload(); 
      } else {

        setErrorMsg(data.detail || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg('Network error. Is your Django server running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    alert("Password successfully updated! Logging you in...");
    setIsFirstLogin(false);
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-[#0B0F19] relative">

      <div className="hidden lg:flex flex-col w-[55%] p-16 relative overflow-hidden justify-center border-r border-gray-800">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Layers className="text-[#0B0F19]" size={28} />
            </div>
            <span className="text-3xl font-serif font-bold text-white tracking-wide">
              Grade<span className="text-amber-400">Sync</span>
            </span>
          </div>

          <h1 className="text-6xl font-serif font-bold text-white leading-[1.15] mb-6">
            Teaching made<br/>
            <span className="text-amber-400 italic">smarter,</span><br/>
            not harder.
          </h1>
          
          <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-md">
            Your all-in-one classroom companion — manage grades, attendance, schedules, and student records with ease.
          </p>

          <div className="flex flex-wrap gap-4">
            {['Grade Tracking', '4-Period Exams', 'Attendance', 'Class Schedules', 'Student Records'].map(feature => (
              <div key={feature} className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm text-gray-300 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-16 text-gray-600 text-xs font-medium">
          © BugSplat 2026 GradeSync · For Filipino Educators
        </div>
      </div>


      <div className="w-full lg:w-[45%] bg-[#111827] flex items-center justify-center p-8 sm:p-16 relative z-10">
        <div className="max-w-md w-full">
          
          <div className="mb-10">
            <p className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Welcome Back</p>
            <h2 className="text-4xl font-serif font-bold text-white mb-3">Sign in to GradeSync</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Enter your credentials provided by your school administrator.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle size={18} />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 tracking-wider">EMPLOYEE ID / USERNAME</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500" />
                </div>
                <input 
                  type="text" 
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. 2021-0042 or admin"
                  className="w-full bg-[#1A2234] border border-gray-700/50 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors placeholder-gray-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 tracking-wider">PASSWORD</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#1A2234] border border-gray-700/50 text-white text-sm rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors placeholder-gray-600"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-amber-600 disabled:cursor-not-allowed text-[#0B0F19] font-bold text-base py-3.5 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.15)] hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>

          </form>

          <div className="mt-12 pt-8 border-t border-gray-800/50 text-center">
            <p className="text-xs font-medium text-gray-600 mb-6 uppercase tracking-wider">For school use only</p>
            <p className="text-sm text-gray-500">
              Having trouble signing in?<br/>
              Contact your <span className="text-gray-300 font-medium">school administrator</span> for assistance.
            </p>
          </div>
        </div>
      </div>

      {isFirstLogin && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl max-w-105 w-full p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-amber-400 blur-xl opacity-60" />

            <div className="mb-8">
              <div className="w-12 h-12 rounded-full border border-gray-700 bg-[#1A2234] flex items-center justify-center mb-6 shadow-inner">
                <Key className="text-amber-400" size={24} />
              </div>
              <p className="text-amber-400 text-xs font-bold tracking-[0.15em] uppercase mb-2">First Login Detected</p>
              <h3 className="text-3xl font-serif font-bold text-white mb-3">Set Your Password</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You're logging in for the <strong className="text-white">first time</strong>. For your security, please create a new personal password before continuing.
              </p>
            </div>

            <form onSubmit={handlePasswordResetSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 tracking-wider">NEW PASSWORD</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-500" />
                  </div>
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-[#1A2234] border border-gray-700/50 text-white text-sm rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors placeholder-gray-600"
                    required
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: 'length', text: 'At least 8 characters' },
                  { id: 'uppercase', text: 'One uppercase letter (A–Z)' },
                  { id: 'number', text: 'One number (0–9)' },
                  { id: 'special', text: 'One special character (!@#$...)' }
                ].map((req) => (
                  <div key={req.id} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className={strength[req.id] ? "text-emerald-500" : "text-gray-600"} />
                    <span className={`text-xs ${strength[req.id] ? "text-gray-300" : "text-gray-500"}`}>{req.text}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-gray-400 tracking-wider">CONFIRM PASSWORD</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-500" />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full bg-[#1A2234] border border-gray-700/50 text-white text-sm rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors placeholder-gray-600"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#92733A] hover:bg-amber-500 text-[#0B0F19] font-bold text-base py-3.5 rounded-xl transition-colors mt-4">
                Set New Password
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;