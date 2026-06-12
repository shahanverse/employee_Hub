import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Design',
  'Product Management'
];

const EmployeeForm = ({ initialData, onSubmit, isLoading, serverError }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    department: '',
    designation: '',
    salary: '',
    joiningDate: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      // Format date to YYYY-MM-DD for date input
      let formattedDate = '';
      if (initialData.joiningDate) {
        const d = new Date(initialData.joiningDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split('T')[0];
        }
      }

      setFormData({
        employeeId: initialData.employeeId || '',
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        department: initialData.department || '',
        designation: initialData.designation || '',
        salary: initialData.salary || '',
        joiningDate: formattedDate,
        status: initialData.status || 'Active'
      });
    }
  }, [initialData]);

  // Client side validation rules
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'employeeId':
        if (!value.trim()) error = 'Employee ID is required';
        break;
      case 'fullName':
        if (!value.trim()) error = 'Full Name is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'department':
        if (!value) error = 'Please select a department';
        break;
      case 'designation':
        if (!value.trim()) error = 'Designation is required';
        break;
      case 'salary':
        if (value === undefined || value === '') {
          error = 'Salary is required';
        } else {
          const num = Number(value);
          if (isNaN(num) || num <= 0) {
            error = 'Salary must be a positive number';
          }
        }
        break;
      case 'joiningDate':
        if (!value) error = 'Joining Date is required';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched = {};
    const validationErrors = {};
    
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
      const err = validateField(key, formData[key]);
      if (err) {
        validationErrors[key] = err;
      }
    });

    setTouched(allTouched);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl flex items-start space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to save employee</p>
            <p className="mt-1 text-red-300/90">{serverError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee ID */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="employeeId">
            Employee ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={!!initialData} // Lock Employee ID on edit mode
            placeholder="EMP001"
            className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
              errors.employeeId && touched.employeeId
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/20'
            } ${initialData ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.employeeId && touched.employeeId && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400 mr-1.5"></span>
              {errors.employeeId}
            </p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="fullName">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
              errors.fullName && touched.fullName
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/20'
            }`}
          />
          {errors.fullName && touched.fullName && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400 mr-1.5"></span>
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="email">
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="johndoe@company.com"
            className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
              errors.email && touched.email
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/20'
            }`}
          />
          {errors.email && touched.email && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400 mr-1.5"></span>
              {errors.email}
            </p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="department">
            Department <span className="text-red-400">*</span>
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 transition duration-200 ${
              errors.department && touched.department
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/20'
            }`}
          >
            <option value="" disabled className="bg-slate-900 text-slate-500">Select Department</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept} className="bg-slate-900 text-white">
                {dept}
              </option>
            ))}
          </select>
          {errors.department && touched.department && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400 mr-1.5"></span>
              {errors.department}
            </p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="designation">
            Designation <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Software Engineer"
            className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
              errors.designation && touched.designation
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/20'
            }`}
          />
          {errors.designation && touched.designation && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400 mr-1.5"></span>
              {errors.designation}
            </p>
          )}
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="salary">
            Salary (USD) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="60000"
            min="0"
            step="any"
            className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition duration-200 ${
              errors.salary && touched.salary
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/20'
            }`}
          />
          {errors.salary && touched.salary && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400 mr-1.5"></span>
              {errors.salary}
            </p>
          )}
        </div>

        {/* Joining Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="joiningDate">
            Joining Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            id="joiningDate"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-slate-800/60 border rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 transition duration-200 ${
              errors.joiningDate && touched.joiningDate
                ? 'border-red-500 focus:ring-red-500/20'
                : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/20'
            }`}
          />
          {errors.joiningDate && touched.joiningDate && (
            <p className="text-red-400 text-xs mt-1.5 flex items-center">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400 mr-1.5"></span>
              {errors.joiningDate}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2" htmlFor="status">
            Employment Status <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center space-x-6 mt-3">
            <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300 select-none">
              <input
                type="radio"
                name="status"
                value="Active"
                checked={formData.status === 'Active'}
                onChange={handleChange}
                className="w-4 h-4 text-sky-500 bg-slate-800 border-slate-700 focus:ring-sky-500/20 focus:ring-2"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
            <label className="flex items-center space-x-2.5 cursor-pointer text-slate-300 select-none">
              <input
                type="radio"
                name="status"
                value="Inactive"
                checked={formData.status === 'Inactive'}
                onChange={handleChange}
                className="w-4 h-4 text-sky-500 bg-slate-800 border-slate-700 focus:ring-sky-500/20 focus:ring-2"
              />
              <span className="text-sm font-medium">Inactive</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl border border-slate-700 transition duration-150 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-sky-500/20 transition duration-150"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Update Employee' : 'Add Employee'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
