const express = require('express');
const router = express.Router();
const { 
    createClass,
    getClassByClassCode,
    listClassesByTeacherId,
    joinClassByLink
} = require('../controllers/class');

router.post('/', createClass);
router.get('/:classCode', getClassByClassCode);
router.get('/teacher/:teacherId', listClassesByTeacherId);
router.post('/join-class', joinClassByLink);


module.exports = router;
