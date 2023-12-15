const express = require('express');
const router = express.Router();
const { 
  createGrades,
  getGradesByClassCode
} = require('../controllers/grade');

router.post('/createManyByImport', createGrades);
router.get('/:classCode', getGradesByClassCode);


module.exports = router;