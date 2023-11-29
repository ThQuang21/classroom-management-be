const express = require('express');
const { 
    register, login, activateAccount, resentCode, forgotPassword, 
    resetPassword
} = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/activate/:email/:activeCode', activateAccount);
router.post('/activate/resent-code', resentCode);

router.patch('/forgot-password', forgotPassword);
router.patch('/reset-password', resetPassword);

module.exports = router;