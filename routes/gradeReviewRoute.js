const express = require('express');
const router = express.Router();
const { 
  createGradeReviews,
  getGradeReviewsByClassCode,
  getGradeReviewsByClassCodeAndStudentId,
  addCommentByClassCodeStudentIdAndGradeCompositionId
} = require('../controllers/gradeReview');

router.post('/', createGradeReviews);
router.get('/get-by-classcode/:classCode', getGradeReviewsByClassCode);
router.get('/:classCode/:studentId', getGradeReviewsByClassCodeAndStudentId);
router.post('/add-comments', addCommentByClassCodeStudentIdAndGradeCompositionId);

module.exports = router;