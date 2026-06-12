import React from 'react';
import { Edit2, Trash2, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const EmployeeTable = ({
  employees = [],
  loading = false,
  sortBy = '',
  sortOrder = 'asc',
  onSort = () => {},
  onEdit = () => {},
  onDelete = () => {},
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  onPageChange = () => {}
}) => {

  const handleSortClick = (field) => {
    onSort(field);
  };

  const SortHeader = ({ field, label }) => {
    const isActive = sortBy === field;
    return (
      <th 
        onClick={() => handleSortClick(field)}
        className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-800/40 select-none group transition duration-150"
      >
        <div className="flex items-center space-x-1.5">
          <span>{label}</span>
          <ArrowUpDown className={`w-3 h-3 transition duration-150 ${
            isActive ? 'text-sky-400' : 'text-slate-600 group-hover:text-slate-400'
          }`} />
        </div>
      </th>
    );
  };

  if (!loading && employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 glass rounded-2xl border border-slate-850">
        <div className="bg-slate-800/50 p-4 rounded-full border border-slate-700/30 mb-4">
          <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">No Employees Found</h3>
        <p className="text-slate-400 text-sm text-center max-w-sm">
          We couldn't find any employee records matching your current filters and search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead>
            <tr className="bg-slate-900/80">
              <SortHeader field="employeeId" label="Employee ID" />
              <SortHeader field="fullName" label="Name" />
              <SortHeader field="department" label="Department" />
              <SortHeader field="designation" label="Designation" />
              <SortHeader field="salary" label="Salary" />
              <SortHeader field="status" label="Status" />
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider select-none">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-transparent">
            {employees.map((employee) => (
              <tr key={employee._id} className="hover:bg-slate-800/20 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-sky-400 font-semibold">
                  {employee.employeeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-white">{employee.fullName}</div>
                  <div className="text-xs text-slate-400">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                  {employee.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                  {employee.designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                  ${Number(employee.salary).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    employee.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-500/10 text-slate-400 border-slate-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      employee.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-400'
                    }`}></span>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      onClick={() => onEdit(employee._id)}
                      title="Edit Employee"
                      className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition duration-150"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(employee)}
                      title="Delete Employee"
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition duration-150"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/20 rounded-2xl border border-slate-800/80">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-slate-700 text-sm font-medium rounded-lg text-slate-300 bg-slate-850 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-700 text-sm font-medium rounded-lg text-slate-300 bg-slate-850 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-slate-400">
                Showing page <span className="font-semibold text-white">{currentPage}</span> of <span className="font-semibold text-white">{totalPages}</span> (<span className="font-semibold text-slate-300">{totalResults}</span> employees total)
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-slate-700 bg-slate-800 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition duration-150"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  const isCurrent = pageNumber === currentPage;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => onPageChange(pageNumber)}
                      className={`relative inline-flex items-center px-3.5 py-2 border text-sm font-medium transition duration-150 ${
                        isCurrent
                          ? 'z-10 bg-sky-600 border-sky-600 text-white hover:bg-sky-500'
                          : 'border-slate-700 bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-slate-700 bg-slate-800 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition duration-150"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
