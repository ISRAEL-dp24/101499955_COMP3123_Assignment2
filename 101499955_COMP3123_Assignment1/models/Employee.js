const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  date_of_joining: { type: Date, required: true },
  department: { type: String, required: true },
  
  profilePicture: { type: String, default: null }
});

module.exports = mongoose.model('Employee', employeeSchema);
