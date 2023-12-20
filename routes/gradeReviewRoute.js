const express = require('express');
const router = express.Router();
const { 
  createGradeReviews,
  
} = require('../controllers/gradeReview');

router.post('/', createGradeReviews);


module.exports = router;