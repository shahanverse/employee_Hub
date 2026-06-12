const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Full Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0.01, 'Salary must be a positive number']
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining Date is required']
  },
  status: {
    type: String,
    required: [true, 'Employment Status is required'],
    enum: {
      values: ['Active', 'Inactive'],
      message: 'Status must be either Active or Inactive'
    },
    default: 'Active'
  }
}, {
  timestamps: true
});

const MongooseEmployee = mongoose.model('Employee', employeeSchema);
const { MockEmployee } = require('./mockDb');

const EmployeeProxy = new Proxy(function() {}, {
  construct: function(target, args) {
    const activeModel = global.useMockDb ? MockEmployee : MongooseEmployee;
    return new activeModel(...args);
  },
  get: function (target, prop) {
    const activeModel = global.useMockDb ? MockEmployee : MongooseEmployee;
    const value = activeModel[prop];
    if (typeof value === 'function') {
      return value.bind(activeModel);
    }
    return value;
  }
});

module.exports = EmployeeProxy;
