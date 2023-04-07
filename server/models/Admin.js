const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  schoolId: String,
  firstName: String,
  middleName: String,
  lastName: String,
  sex: String,
  email: String,
  phone: String,
  password: String
}, {versionKey: false});

module.exports = mongoose.model('Admin', AdminSchema);