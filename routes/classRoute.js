const express = require('express');
const router = express.Router();
const { 
    createClass,
    getClassByClassCode,
    listClassesByTeacherId,
    listClassesByStudentId,
    getClassByInvitationCode,
    joinClassByLink,
    joinClassByCode,
    getPeopleByClassCode,
    inviteByEmail,
    updateGradeCompositionByClassCode,
    getGradeCompositionByClassCode,
    updateFinalizeInGradeComposition,
    getAllClasses,
    updateClassName,
    removeTeacher,
    removeStudent
} = require('../controllers/class');

router.post('/', createClass);
router.get('/get-all', getAllClasses);
router.get('/:classCode', getClassByClassCode);
router.get('/invite/:invitationCode', getClassByInvitationCode);
router.get('/list-classes-by-teacher/:teacherId', listClassesByTeacherId);
router.get('/list-classes-by-student/:studentId', listClassesByStudentId);
router.post('/join-class', joinClassByLink);
router.post('/join-class-by-code', joinClassByCode);
router.put('/updateClassName/:classCode', updateClassName);
router.delete('/removeTeacher/:classCode/:teacherId', removeTeacher);
router.delete('/removeStudent/:classCode/:studentId', removeStudent);


//Invite
router.post('/invite-by-email', inviteByEmail)

//People
router.get('/get-people/:classCode', getPeopleByClassCode);

//Grade
router.get('/:classCode/gradeCompositions', getGradeCompositionByClassCode)
router.put('/:classCode/gradeCompositions', updateGradeCompositionByClassCode)
router.put('/updateFinalized/:classCode', updateFinalizeInGradeComposition)


module.exports = router;
