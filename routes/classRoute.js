const express = require('express');
const router = express.Router();
const { 
    createClass,
    getClassByClassCode,
    listClassesByTeacherId,
    listClassesByStudentId,
    joinClassByLink,
    joinClassByCode
} = require('../controllers/class');

router.post('/', createClass);
router.get('/:classCode', getClassByClassCode);
router.get('/list-classes-by-teacher/:teacherId', listClassesByTeacherId);
router.get('/list-classes-by-student/:studentId', listClassesByStudentId);
router.post('/join-class', joinClassByLink);
router.post('/join-class-by-code', joinClassByCode);


module.exports = router;
