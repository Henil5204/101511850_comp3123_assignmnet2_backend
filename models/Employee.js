const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [30, 'First name cannot exceed 30 characters']
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [30, 'Last name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please provide a valid email address'
    ]
  },
  position: {
    type: String,
    default: 'New hire',
    trim: true,
    maxlength: [100, 'Position cannot exceed 100 characters']
  },
  department: {
    type: String,
    default: 'Not assigned',
    trim: true,
    maxlength: [100, 'Department cannot exceed 100 characters']
  },
  salary: {
    type: Number,
    default: 0,
    min: [0, 'Salary cannot be negative']
  },
  date_of_joining: {
    type: Date,
    required: [true, 'Date of joining is required'],
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= new Date(); // cannot join in the future
      },
      message: 'Date of joining cannot be in the future'
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update updated_at before every save
employeeSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Also update updated_at before findOneAndUpdate
employeeSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
