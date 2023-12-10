const express = require('express');
const router = express.Router();
const { 
    createClass,
    listClassesByTeacherId
} = require('../controllers/class');

router.post('/', createClass);
router.get('/:teacherId', listClassesByTeacherId);


module.exports = router;
