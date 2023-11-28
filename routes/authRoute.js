const express = require('express');
const { register, login, activateAccount, resentCode } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/activate/:email/:activeCode', activateAccount);
router.post('/activate/resent-code', resentCode);


module.exports = router;