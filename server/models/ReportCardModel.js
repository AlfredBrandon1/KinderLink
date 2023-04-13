const mongoose = require('mongoose');

const ReportCardSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentModel'
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherModel'
    },
    schoolYear: String,
    gradeLevel: Number,
    subjects: [
        {
            name: String,
            grade: Number,
            comments: String
        }
    ],
    average: Number,
    comments: String,
    created: {
        type: Date,
        default: Date.now
    }
}, {versionKey: false});

module.exports = mongoose.model('ReportCardModel', ReportCardSchema);
