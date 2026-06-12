const Employee = require('../models/Employee');

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private
const createEmployee = async (req, res) => {
  const { employeeId, fullName, email, department, designation, salary, joiningDate, status } = req.body;

  try {
    // 1. Check for required fields
    if (!employeeId || !fullName || !email || !department || !designation || salary === undefined || !joiningDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 2. Validate salary (positive number)
    const salaryNumber = Number(salary);
    if (isNaN(salaryNumber) || salaryNumber <= 0) {
      return res.status(400).json({ message: 'Salary must be a positive number' });
    }

    // 3. Check for unique employeeId
    const employeeIdExists = await Employee.findOne({ employeeId });
    if (employeeIdExists) {
      return res.status(400).json({ message: `Employee ID '${employeeId}' is already registered` });
    }

    // 4. Check for unique email
    const emailExists = await Employee.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: `Email '${email}' is already registered` });
    }

    // 5. Create employee record
    const employee = await Employee.create({
      employeeId,
      fullName,
      email: email.toLowerCase(),
      department,
      designation,
      salary: salaryNumber,
      joiningDate,
      status: status || 'Active'
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error('Create Employee Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get all employees with search, filter, sort, and pagination
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
  try {
    const { search, department, status, sortBy, sortOrder, page, limit } = req.query;

    // Build query
    const query = {};

    // 1. Search filter (Name or Email)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Department filter
    if (department) {
      query.department = department;
    }

    // 3. Status filter
    if (status) {
      query.status = status;
    }

    // Sorting setup
    let sort = {};
    if (sortBy) {
      const order = sortOrder === 'desc' ? -1 : 1;
      sort[sortBy] = order;
    } else {
      sort['createdAt'] = -1; // default sort by newest created
    }

    // Pagination setup
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Get total matching count
    const total = await Employee.countDocuments(query);

    // Get paginated data
    const employees = await Employee.find(query)
      .sort(sort)
      .skip(skipNum)
      .limit(limitNum);

    // Get all unique departments (useful for filter dropdown on UI)
    const departments = await Employee.distinct('department');

    // Calculate global statistics for the dashboard cards
    const globalTotal = await Employee.countDocuments();
    const activeTotal = await Employee.countDocuments({ status: 'Active' });
    const inactiveTotal = await Employee.countDocuments({ status: 'Inactive' });

    res.json({
      employees,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
      departments,
      stats: {
        total: globalTotal,
        active: activeTotal,
        inactive: inactiveTotal,
        departments: departments.length
      }
    });
  } catch (error) {
    console.error('Get Employees Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get Employee By ID Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Update employee details
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
  const { employeeId, fullName, email, department, designation, salary, joiningDate, status } = req.body;

  try {
    // 1. Find the employee
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // 2. Validate salary if provided
    if (salary !== undefined) {
      const salaryNumber = Number(salary);
      if (isNaN(salaryNumber) || salaryNumber <= 0) {
        return res.status(400).json({ message: 'Salary must be a positive number' });
      }
      employee.salary = salaryNumber;
    }

    // 3. Check unique employeeId if it is being changed
    if (employeeId && employeeId !== employee.employeeId) {
      const employeeIdExists = await Employee.findOne({ employeeId });
      if (employeeIdExists) {
        return res.status(400).json({ message: `Employee ID '${employeeId}' is already in use by another record` });
      }
      employee.employeeId = employeeId;
    }

    // 4. Check unique email if it is being changed
    if (email && email.toLowerCase() !== employee.email) {
      const emailExists = await Employee.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ message: `Email '${email}' is already in use by another record` });
      }
      employee.email = email.toLowerCase();
    }

    // 5. Update other fields
    if (fullName) employee.fullName = fullName;
    if (department) employee.department = department;
    if (designation) employee.designation = designation;
    if (joiningDate) employee.joiningDate = joiningDate;
    if (status) employee.status = status;

    // Save changes
    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Update Employee Error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.deleteOne();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete Employee Error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};
