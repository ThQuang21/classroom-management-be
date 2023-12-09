const express = require('express');
const router = express.Router();
const { 
    createClass
} = require('../controllers/class');

router.post('/', createClass);

module.exports = router;
