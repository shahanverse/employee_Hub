const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const ADMINS_FILE = path.join(DATA_DIR, 'admins.json');
const EMPLOYEES_FILE = path.join(DATA_DIR, 'employees.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ADMINS_FILE)) {
  fs.writeFileSync(ADMINS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(EMPLOYEES_FILE)) {
  fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify([]));
}

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Helper to filter array like MongoDB queries
function filterEmployees(employees, query) {
  let result = [...employees];
  
  if (query.department) {
    result = result.filter(e => e.department === query.department);
  }
  if (query.status) {
    result = result.filter(e => e.status === query.status);
  }
  if (query.$or) {
    // query.$or is [{fullName: {$regex, $options}}, {email: {$regex, $options}}]
    result = result.filter(e => 
      query.$or.some(cond => {
        const key = Object.keys(cond)[0];
        const regexStr = cond[key].$regex;
        const regex = new RegExp(regexStr, 'i');
        return regex.test(e[key] || '');
      })
    );
  }
  return result;
}

// Mock Admin Model Mappings
const MockAdmin = {
  findOne: async (query) => {
    const admins = readData(ADMINS_FILE);
    if (query.$or) {
      const match = admins.find(a => 
        query.$or.some(condition => {
          const key = Object.keys(condition)[0];
          const val = String(condition[key]).toLowerCase();
          return String(a[key] || '').toLowerCase() === val;
        })
      );
      if (match) {
        return {
          ...match,
          matchPassword: async function(enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.password);
          }
        };
      }
      return null;
    }
    return null;
  },
  create: async (data) => {
    const admins = readData(ADMINS_FILE);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newAdmin = {
      _id: 'admin_' + Date.now(),
      username: data.username,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    admins.push(newAdmin);
    writeData(ADMINS_FILE, admins);
    
    return {
      ...newAdmin,
      matchPassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      }
    };
  },
  findById: (id) => {
    const query = {
      select: function(fields) {
        return this;
      },
      exec: async function() {
        const admins = readData(ADMINS_FILE);
        const admin = admins.find(a => a._id === id);
        if (admin) {
          return {
            ...admin,
            matchPassword: async function(enteredPassword) {
              return await bcrypt.compare(enteredPassword, this.password);
            }
          };
        }
        return null;
      },
      then: function(resolve, reject) {
        return this.exec().then(resolve, reject);
      }
    };
    return query;
  }
};

// Mock Employee Model Mappings
const MockEmployee = {
  findOne: async (query) => {
    const employees = readData(EMPLOYEES_FILE);
    const key = Object.keys(query)[0];
    const match = employees.find(e => String(e[key]).toLowerCase() === String(query[key]).toLowerCase());
    if (!match) return null;
    return createMongooseDocWrapper(match);
  },
  create: async (data) => {
    const employees = readData(EMPLOYEES_FILE);
    const newEmp = {
      _id: 'emp_' + Date.now(),
      employeeId: data.employeeId,
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      department: data.department,
      designation: data.designation,
      salary: Number(data.salary),
      joiningDate: new Date(data.joiningDate),
      status: data.status || 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    employees.push(newEmp);
    writeData(EMPLOYEES_FILE, employees);
    return createMongooseDocWrapper(newEmp);
  },
  findById: async (id) => {
    const employees = readData(EMPLOYEES_FILE);
    const emp = employees.find(e => e._id === id);
    if (!emp) return null;
    return createMongooseDocWrapper(emp);
  },
  countDocuments: async (query = {}) => {
    const employees = readData(EMPLOYEES_FILE);
    return filterEmployees(employees, query).length;
  },
  distinct: async (field) => {
    const employees = readData(EMPLOYEES_FILE);
    const vals = employees.map(e => e[field]).filter(Boolean);
    return [...new Set(vals)];
  },
  find: (query = {}) => {
    const employees = readData(EMPLOYEES_FILE);
    const filtered = filterEmployees(employees, query);
    
    // Return a chainable object for Mongoose query builder
    const chain = {
      data: filtered,
      sort: function(sortObj) {
        if (!sortObj) return this;
        const field = Object.keys(sortObj)[0];
        const dir = sortObj[field];
        this.data.sort((a, b) => {
          let valA = a[field];
          let valB = b[field];
          if (typeof valA === 'string') {
            return dir === 1 ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return dir === 1 ? valA - valB : valB - valA;
        });
        return this;
      },
      skip: function(n) {
        this.data = this.data.slice(n);
        return this;
      },
      limit: function(n) {
        this.data = this.data.slice(0, n);
        return this;
      },
      exec: async function() {
        return this.data.map(createMongooseDocWrapper);
      },
      then: function(resolve) {
        resolve(this.data.map(createMongooseDocWrapper));
      }
    };
    return chain;
  }
};

// Wrap document to mimic Mongoose instances
function createMongooseDocWrapper(doc) {
  const wrapper = {
    ...doc,
    save: async function() {
      const emps = readData(EMPLOYEES_FILE);
      const idx = emps.findIndex(e => e._id === this._id);
      if (idx !== -1) {
        // Capture any fields updated on 'this'
        const updated = {
          _id: this._id,
          employeeId: this.employeeId,
          fullName: this.fullName,
          email: this.email,
          department: this.department,
          designation: this.designation,
          salary: Number(this.salary),
          joiningDate: new Date(this.joiningDate),
          status: this.status,
          createdAt: this.createdAt,
          updatedAt: new Date()
        };
        emps[idx] = updated;
        writeData(EMPLOYEES_FILE, emps);
        return createMongooseDocWrapper(updated);
      }
      throw new Error('Employee not found to save');
    },
    deleteOne: async function() {
      const emps = readData(EMPLOYEES_FILE);
      const filtered = emps.filter(e => e._id !== this._id);
      writeData(EMPLOYEES_FILE, filtered);
      return { deletedCount: 1 };
    }
  };
  return wrapper;
}

module.exports = { MockAdmin, MockEmployee };
