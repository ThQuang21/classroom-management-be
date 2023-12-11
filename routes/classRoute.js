const express = require('express');
const router = express.Router();
const { 
    createClass,
    getClassByClassCode,
    listClassesByTeacherId,
    listClassesByStudentId,
    joinClassByLink,
    joinClassByCode,
    getPeopleByClassCode,
    inviteByEmail
} = require('../controllers/class');

router.post('/', createClass);
router.get('/:classCode', getClassByClassCode);
router.get('/list-classes-by-teacher/:teacherId', listClassesByTeacherId);
router.get('/list-classes-by-student/:studentId', listClassesByStudentId);
router.post('/join-class', joinClassByLink);
router.post('/join-class-by-code', joinClassByCode);

router.get('/get-people/:classCode', getPeopleByClassCode);

router.post('/invite-by-email', inviteByEmail)


module.exports = router;
