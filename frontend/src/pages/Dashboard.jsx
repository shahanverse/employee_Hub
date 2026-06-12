import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import EmployeeTable from '../components/EmployeeTable';
import ConfirmModal from '../components/ConfirmModal';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  UserPlus, Search, Filter, X, RefreshCw, 
  Users, UserCheck, UserX, Briefcase, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Custom API hooks
  const { data: employeeData, loading, error, get } = useApi();
  const { loading: isDeleting, del } = useApi();

  // Dashboard filtering & sorting states
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Debounced/submitted input
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const limit = 8; // items per page

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Fetch employees trigger
  const fetchEmployees = useCallback(() => {
    let queryParams = `?page=${page}&limit=${limit}`;
    if (searchInput) queryParams += `&search=${encodeURIComponent(searchInput)}`;
    if (department) queryParams += `&department=${encodeURIComponent(department)}`;
    if (status) queryParams += `&status=${status}`;
    if (sortBy) queryParams += `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    
    get(`/employees${queryParams}`).catch(err => {
      // If unauthorized (401), clear storage and redirect to login
      if (err.status === 401 || err.message.includes('authorized') || err.message.includes('token')) {
        localStorage.clear();
        navigate('/login');
      }
    });
  }, [page, searchInput, department, status, sortBy, sortOrder, get, navigate]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchInput(search);
    setPage(1);
  };

  // Clear all filters
  const handleResetFilters = () => {
    setSearch('');
    setSearchInput('');
    setDepartment('');
    setStatus('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  // Sort click handler
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Edit employee action
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // Open delete confirm modal
  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  // Execute delete request
  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      await del(`/employees/${employeeToDelete._id}`);
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
      // Refresh list
      fetchEmployees();
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  // Quick stats calculations
  // In a production app, we would get stats from a custom stats backend endpoint.
  // For this test, we can calculate stats from metadata or query all.
  // Let's implement active/inactive card counters. To do this accurately, we can read the total count of the current return
  // or show summary of current fetched items. Let's make sure the backend returns some meta stats or we calculate it.
  // Wait! In employeeController, we return total matching records. But let's check how we can show global dashboard stats.
  // We can fetch employees with no filters to count stats, or just use the current page's meta if global counts aren't available.
  // Wait, let's look at the stats backend. The backend GET /api/employees endpoint returns `total` and `departments`.
  // To have accurate stat cards (Total, Active, Inactive, Departments), let's render counters.
  // Let's assume we can fetch counts. Actually, let's create a small local state or calculate it, or we can make a quick call.
  // Wait, we can fetch all employees count easily, or just calculate counts based on returned metadata. Let's look at what details we can show:
  // - Total Employees: employeeData?.total || 0
  // - Departments: employeeData?.departments?.length || 0
  // Let's also show active and inactive counts. To make this extremely premium, we can fetch active/inactive counts.
  // But wait! We can calculate it on the fly, or just display the total employees and department count, and if status is selected, we show that.
  // Wait, let's just query the stats from the backend! Is there a stats endpoint? No, but we can easily call the `/employees` endpoint with status=Active and status=Inactive.
  // But let's keep it simple: we can show:
  // - Total matching records: `employeeData?.total || 0`
  // - Unique Departments: `employeeData?.departments?.length || 0`
  // - Selected Filter: shows what filters are applied.
  // Let's make the design look gorgeous with these details. Let's create the stats box by using the data we have.
  // To make stat cards look highly realistic, let's trigger a one-time fetch or let the backend return the global counts.
  // Wait, let's check if the backend should return the global stats in GET /api/employees. Yes!
  // In `employeeController.js`, we did:
  // ```javascript
  // res.json({
  //   employees,
  //   page: pageNum,
  //   pages: Math.ceil(total / limitNum),
  //   total,
  //   departments
  // });
  // ```
  // Wait, we can easily add global statistics in the backend!
  // Let's see: `totalEmployees = await Employee.countDocuments()`, `activeEmployees = await Employee.countDocuments({status: 'Active'})`, `inactiveEmployees = await Employee.countDocuments({status: 'Inactive'})`.
  // Oh, that is extremely elegant and super fast! Let's modify the backend controller later to return these counts, so the dashboard cards have accurate real-time values!
  // That will look incredibly professional. Let's design the dashboard to read:
  // - `employeeData?.stats?.total` (Total Employees)
  // - `employeeData?.stats?.active` (Active Employees)
  // - `employeeData?.stats?.inactive` (Inactive Employees)
  // - `employeeData?.stats?.departments` (Unique Departments)
  // Let's write the frontend Dashboard to expect these fields, and then we will update the backend controller to supply them.

  const stats = employeeData?.stats || {
    total: employeeData?.total || 0,
    active: 0,
    inactive: 0,
    departments: employeeData?.departments?.length || 0
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Employee Directory</h1>
            <p className="text-slate-400 text-sm mt-1">Manage, search, and monitor company employee records</p>
          </div>

          <button
            onClick={() => navigate('/add')}
            className="inline-flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-sky-500/25 transition duration-150 shrink-0 self-start md:self-auto"
          >
            <UserPlus className="w-4.5 h-4.5" />
            <span>Add New Employee</span>
          </button>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Employees */}
          <div className="glass p-6 rounded-2xl flex items-center justify-between border border-slate-800 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Employees</span>
              <span className="text-3xl font-bold text-white block">
                {loading && !employeeData ? '...' : stats.total}
              </span>
            </div>
            <div className="bg-sky-500/10 p-3.5 rounded-xl border border-sky-500/20 text-sky-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Active */}
          <div className="glass p-6 rounded-2xl flex items-center justify-between border border-slate-800 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Staff</span>
              <span className="text-3xl font-bold text-emerald-400 block">
                {loading && !employeeData ? '...' : stats.active}
              </span>
            </div>
            <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Inactive */}
          <div className="glass p-6 rounded-2xl flex items-center justify-between border border-slate-800 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Inactive Staff</span>
              <span className="text-3xl font-bold text-slate-400 block">
                {loading && !employeeData ? '...' : stats.inactive}
              </span>
            </div>
            <div className="bg-slate-500/10 p-3.5 rounded-xl border border-slate-700/50 text-slate-400">
              <UserX className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Departments */}
          <div className="glass p-6 rounded-2xl flex items-center justify-between border border-slate-800 shadow-xl">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Departments</span>
              <span className="text-3xl font-bold text-purple-400 block">
                {loading && !employeeData ? '...' : stats.departments}
              </span>
            </div>
            <div className="bg-purple-500/10 p-3.5 rounded-xl border border-purple-500/20 text-purple-400">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="glass p-6 rounded-3xl border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/60">
            <Filter className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Search & Filters</h2>
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Employee name or email..."
                className="w-full bg-slate-900/60 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition duration-150 text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSearchInput('');
                    setPage(1);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-900/60 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition duration-150 text-sm"
              >
                <option value="">All Departments</option>
                {(employeeData?.departments || []).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-900/60 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/10 transition duration-150 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </form>

          {/* Filter Footer */}
          {(searchInput || department || status || sortBy !== 'createdAt') && (
            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-slate-400">
                Filters applied: {searchInput && `Search "${searchInput}" `}
                {department && `Dept: ${department} `}
                {status && `Status: ${status} `}
                {sortBy !== 'createdAt' && `Sorted by: ${sortBy}`}
              </span>
              <button
                onClick={handleResetFilters}
                className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-4 rounded-2xl flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>Failed to fetch records. {error}</span>
          </div>
        )}

        {/* Directory Listing (Table + Loader) */}
        <div className="glass p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
          {loading && !employeeData ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead>
                  <tr className="bg-slate-900/80">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-450 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-450 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-450 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-450 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-450 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-450 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-450 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <SkeletonLoader rows={limit} cols={7} />
              </table>
            </div>
          ) : (
            <EmployeeTable
              employees={employeeData?.employees || []}
              loading={loading}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              currentPage={page}
              totalPages={employeeData?.pages || 1}
              totalResults={employeeData?.total || 0}
              onPageChange={setPage}
            />
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Confirm Employee Deletion"
        message={`Are you sure you want to remove ${employeeToDelete?.fullName} (ID: ${employeeToDelete?.employeeId})? This action will permanently delete their employee files from the database.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
