import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import EmployeeForm from '../components/EmployeeForm';
import { UserCheck, AlertCircle, ArrowLeft } from 'lucide-react';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Custom API hook instances
  const { data: employee, loading: loadingFetch, error: errorFetch, get } = useApi();
  const { put, loading: loadingSubmit, error: errorSubmit } = useApi();
  
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    if (id) {
      get(`/employees/${id}`).catch(err => {
        console.error('Error fetching employee:', err);
      });
    }
  }, [id, get]);

  const handleSubmit = async (formData) => {
    setServerError(null);
    try {
      await put(`/employees/${id}`, formData);
      // Success: redirect back to dashboard
      navigate('/');
    } catch (err) {
      console.error('Update Employee Submit Error:', err);
      setServerError(err.message || 'Failed to update employee details');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loadingFetch ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <svg className="animate-spin h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-slate-450 text-sm">Retrieving employee record...</p>
          </div>
        ) : errorFetch ? (
          <div className="glass rounded-3xl border border-slate-800 p-8 text-center max-w-md mx-auto space-y-4">
            <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 text-red-400 inline-block">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Record Not Found</h3>
            <p className="text-slate-400 text-sm">
              We couldn't retrieve the requested employee. It might have been deleted or the ID is incorrect.
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium transition duration-155"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </Link>
          </div>
        ) : (
          <div className="glass rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Form Header */}
            <div className="px-8 py-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-900/40">
              <div className="bg-sky-500/10 p-2 rounded-xl border border-sky-500/20 text-sky-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit Employee Profile</h2>
                <p className="text-slate-400 text-xs mt-0.5">Modify settings and details for {employee?.fullName}</p>
              </div>
            </div>

            {/* Form Container */}
            <div className="p-8">
              <EmployeeForm
                initialData={employee}
                onSubmit={handleSubmit}
                isLoading={loadingSubmit}
                serverError={serverError || errorSubmit}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EditEmployee;
