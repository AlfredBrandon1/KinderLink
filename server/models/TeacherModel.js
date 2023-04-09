const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  schoolId: String,
  userType: String,
  firstName: String,
  middleName: String,
  lastName: String,
  sex: String,
  email: String,
  phone: String,
  password: String
}, {versionKey: false});

module.exports = mongoose.model('TeacherModel', TeacherSchema);