const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    //Child`s basic info
  schoolId: String,
  userType: String,
  firstName: String,
  middleName: String,
  lastName: String,
  sex: String,
  birthdate: Date,
  address: String,

  //Parent`s basic info
  contactFirstName: String,
  contactMiddleName: String,
  contactLastName: String,
  Relationship: String,
  contactEmail: String,
  contactPhone: String,

  password: String
}, {versionKey: false});

module.exports = mongoose.model('StudentModel', StudentSchema);