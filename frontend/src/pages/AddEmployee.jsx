import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import EmployeeForm from '../components/EmployeeForm';
import { UserPlus } from 'lucide-react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const { post, loading, error } = useApi();
  const [serverError, setServerError] = useState(null);

  const handleSubmit = async (formData) => {
    setServerError(null);
    try {
      await post('/employees', formData);
      // Success: redirect back to dashboard
      navigate('/');
    } catch (err) {
      console.error('Add Employee Submit Error:', err);
      setServerError(err.message || 'Failed to register employee');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="glass rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="px-8 py-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/40">
            <div className="bg-sky-500/10 p-2 rounded-xl border border-sky-500/20 text-sky-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Register New Employee</h2>
              <p className="text-slate-400 text-xs mt-0.5">Enter details below to create a new personnel profile</p>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <EmployeeForm
              onSubmit={handleSubmit}
              isLoading={loading}
              serverError={serverError || error}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddEmployee;
