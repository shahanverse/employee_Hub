import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Users, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Administrator';
  const email = localStorage.getItem('email') || 'admin@company.com';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-lg border-b border-slate-800">
      <Link to="/" className="flex items-center space-x-3 text-sky-400 hover:text-sky-300 transition duration-150">
        <div className="bg-sky-500/10 p-2 rounded-lg border border-sky-500/20">
          <Users className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Employee<span className="text-sky-500">Hub</span>
        </span>
      </Link>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/50">
          <div className="bg-sky-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-semibold uppercase">
            {username.charAt(0)}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 leading-none">{username}</p>
            <p className="text-[10px] text-slate-400">{email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 hover:border-red-500/30 transition duration-200 text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
