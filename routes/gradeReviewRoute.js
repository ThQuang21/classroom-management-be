const express = require('express');
const router = express.Router();
const { 
  createGradeReviews,
  getGradeReviewsByClassCodeAndStudentId,
  addCommentByClassCodeStudentIdAndGradeCompositionId
} = require('../controllers/gradeReview');

router.post('/', createGradeReviews);
router.get('/:classCode/:studentId', getGradeReviewsByClassCodeAndStudentId);
router.post('/add-comments', addCommentByClassCodeStudentIdAndGradeCompositionId);

module.exports = router;