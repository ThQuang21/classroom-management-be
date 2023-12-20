const express = require('express');
const router = express.Router();
const { 
  createGradeReviews,
  getGradeReviewsByClassCodeAndStudentId
} = require('../controllers/gradeReview');

router.post('/', createGradeReviews);
router.get('/:classCode/:studentId', getGradeReviewsByClassCodeAndStudentId);


module.exports = router;