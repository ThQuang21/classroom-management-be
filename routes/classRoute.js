const express = require('express');
const router = express.Router();
const { 
    createClass,
    getClassByClassCode,
    listClassesByTeacherId
} = require('../controllers/class');

router.post('/', createClass);
router.get('/:classCode', getClassByClassCode);
router.get('/teacher/:teacherId', listClassesByTeacherId);

module.exports = router;
