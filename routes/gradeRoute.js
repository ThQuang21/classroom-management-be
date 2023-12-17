const express = require('express');
const router = express.Router();
const { 
  createGrades,
  getGradesByClassCode,
  getGradesByGradeComposition
} = require('../controllers/grade');

router.post('/createManyByImport', createGrades);
router.get('/:classCode', getGradesByClassCode);
router.get('/grade-composition/:gradeComposition', getGradesByGradeComposition);


module.exports = router;