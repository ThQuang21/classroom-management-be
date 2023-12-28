const express = require('express');
const router = express.Router();
const { 
  createNotification,
  getAllNotificationByUserId
} = require('../controllers/notification');

router.post('/', createNotification);
router.get('/:userId', getAllNotificationByUserId);




module.exports = router;