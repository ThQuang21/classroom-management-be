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
    inviteByEmail,
    updateGradeCompositionByClassCode,
    getGradeCompositionByClassCode
} = require('../controllers/class');

router.post('/', createClass);
router.get('/:classCode', getClassByClassCode);
router.get('/:invitationCode', getClassByInvitationCode);
router.get('/list-classes-by-teacher/:teacherId', listClassesByTeacherId);
router.get('/list-classes-by-student/:studentId', listClassesByStudentId);
router.post('/join-class', joinClassByLink);
router.post('/join-class-by-code', joinClassByCode);

//Invite
router.post('/invite-by-email', inviteByEmail)

//People
router.get('/get-people/:classCode', getPeopleByClassCode);

//Grade
router.get('/:classCode/gradeCompositions', getGradeCompositionByClassCode)
router.put('/:classCode/gradeCompositions', updateGradeCompositionByClassCode)

module.exports = router;
