const Notification = require('../models/notification');
const StatusCodes = require('http-status-codes');

async function createNotification(req, res) {
  try {
    const notificationData = req.body;
    const notification = await Notification.create(notificationData);

    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      data: notification,
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: 'bad_request',
        message: err.message,
      },
    });
  }
}

async function getAllNotificationByUserId(req, res) {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ receiverIds: userId }).sort({ createdAt: -1 });

    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      data: notifications,
    });
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: 'bad_request',
        message: err.message,
      },
    });
  }
}


module.exports = { 
  createNotification,
  getAllNotificationByUserId
};