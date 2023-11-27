const express = require('express');
const { register, login, activateAccount } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/activate/:email/:activeCode', activateAccount);

module.exports = router;