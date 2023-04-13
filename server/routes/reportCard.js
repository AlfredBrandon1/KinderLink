const express = require('express');
const router = express.Router();
const ReportCard = require('../models/ReportCardModel');

// Get all report cards
router.get('/', async (req, res) => {
  try {
    const reportCards = await ReportCard.find();
    res.json(reportCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific report card by ID
router.get('/:id', getReportCard, (req, res) => {
  res.json(res.reportCard);
});

// Create a new report card
router.post('/', async (req, res) => {
  const reportCard = new ReportCard({
    studentId: req.body.studentId,
    teacherId: req.body.teacherId,
    schoolYear: req.body.schoolYear,
    gradeLevel: req.body.gradeLevel,
    subjects: req.body.subjects,
    average: req.body.average,
    comments: req.body.comments
  });

  try {
    const newReportCard = await reportCard.save();
    res.status(201).json(newReportCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing report card
router.patch('/:id', getReportCard, async (req, res) => {
  if (req.body.studentId != null) {
    res.reportCard.studentId = req.body.studentId;
  }

  if (req.body.teacherId != null) {
    res.reportCard.teacherId = req.body.teacherId;
  }

  if (req.body.schoolYear != null) {
    res.reportCard.schoolYear = req.body.schoolYear;
  }

  if (req.body.gradeLevel != null) {
    res.reportCard.gradeLevel = req.body.gradeLevel;
  }

  if (req.body.subjects != null) {
    res.reportCard.subjects = req.body.subjects;
  }

  if (req.body.average != null) {
    res.reportCard.average = req.body.average;
  }

  if (req.body.comments != null) {
    res.reportCard.comments = req.body.comments;
  }

  try {
    const updatedReportCard = await res.reportCard.save();
    res.json(updatedReportCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a report card by ID
router.delete('/:id', async (req, res) => {
    try {
      const reportCard = await ReportCard.findOneAndDelete({ _id: req.params.id });
      if (!reportCard) {
        return res.status(404).json({ message: 'Report card not found' });
      }
      res.json({ message: 'Report card deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Middleware function to get a specific report card by ID
async function getReportCard(req, res, next) {
  try {
    const reportCard = await ReportCard.findById(req.params.id);
    if (reportCard == null) {
      return res.status(404).json({ message: 'Report card not found' });
    }
    res.reportCard = reportCard;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
