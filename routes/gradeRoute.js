const express = require('express');
const router = express.Router();
const { 
  createGrades,
  getGradesByClassCode,
  getGradesByGradeComposition,
  updateGradeByClassCodeAndStudentId
} = require('../controllers/grade');

router.post('/createManyByImport', createGrades);
router.get('/:classCode', getGradesByClassCode);
router.get('/grade-composition/:gradeComposition', getGradesByGradeComposition);
router.put('/updateGrades/:classCode', updateGradeByClassCodeAndStudentId);


module.exports = router;