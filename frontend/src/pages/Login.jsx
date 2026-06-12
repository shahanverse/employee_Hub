import React, { useState, useEffect } from 'react';
import { useNavigate as useReactNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { Lock, Mail, User, ShieldAlert, KeyRound, UserPlus, LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useReactNavigate();
  const { post, loading, error, clearError } = useApi();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // If token exists, direct to dashboard
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (isLogin) {
      if (!formData.email) {
        errors.email = 'Email or Username is required';
      }
      if (!formData.password) {
        errors.password = 'Password is required';
      }
    } else {
      if (!formData.username.trim()) {
        errors.username = 'Username is required';
      }
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        // Log in admin
        const res = await post('/auth/login', {
          emailOrUsername: formData.email,
          password: formData.password
        });
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('email', res.email);
          navigate('/');
        }
      } else {
        // Register admin
        const res = await post('/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.username);
          localStorage.setItem('email', res.email);
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-sky-500/10 p-3.5 rounded-2xl border border-sky-500/20 mb-4 shadow-inner">
            <KeyRound className="w-8 h-8 text-sky-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Employee<span className="text-sky-500">Hub</span> Portal
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {isLogin ? 'Sign in to access your administrator dashboard' : 'Create an administrator account to get started'}
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="glass p-8 rounded-3xl shadow-2xl border border-slate-800">
          {/* Tab Selector */}
          <div className="flex bg-slate-900/60 p-1 rounded-xl mb-6 border border-slate-800/80">
            <button
              onClick={() => !isLogin && switchMode()}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                isLogin 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
            <button
              onClick={() => isLogin && switchMode()}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                !isLogin 
                  ? 'bg-sky-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </button>
          </div>

          {/* API Server Errors */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-start space-x-2 text-sm">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="admin123"
                    className={`w-full bg-slate-900/60 border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition duration-200 text-sm ${
                      formErrors.username ? 'border-red-500' : 'border-slate-800'
                    }`}
                  />
                </div>
                {formErrors.username && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>
                )}
              </div>
            )}

            {/* Email Address field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="email">
                {isLogin ? 'Email Address or Username' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type={isLogin ? "text" : "email"}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={isLogin ? "admin@company.com or username" : "admin@company.com"}
                  className={`w-full bg-slate-900/60 border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition duration-200 text-sm ${
                    formErrors.email ? 'border-red-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {formErrors.email && (
                <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full bg-slate-900/60 border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition duration-200 text-sm ${
                    formErrors.password ? 'border-red-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {formErrors.password && (
                <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full bg-slate-900/60 border rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition duration-200 text-sm ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-slate-800'
                    }`}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-lg hover:shadow-sky-500/20 transition duration-150 flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Quick Info */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-500 leading-relaxed block">
              EMS Admin Portal • Clean Architecture, JWT Authentication, responsive dashboard styled with Tailwind CSS.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
