const express = require('express');
const router = express.Router();
const { 
  createGrades,
  getGradesByClassCode,
  getGradesByGradeComposition,
  updateGradeByClassCodeAndStudentId,
  getGradeByClassCodeAndStudentId
} = require('../controllers/grade');

router.post('/createManyByImport', createGrades);
router.get('/:classCode', getGradesByClassCode);
router.get('/grade-composition/:gradeComposition', getGradesByGradeComposition);
router.get('/student-id/:classCode/:studentId', getGradeByClassCodeAndStudentId);
router.put('/updateGrades/:classCode', updateGradeByClassCodeAndStudentId);


module.exports = router;