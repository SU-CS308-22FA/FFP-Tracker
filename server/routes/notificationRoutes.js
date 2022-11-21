const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notificationsController");

router.route("/")
    .get(notificationsController.getAllNotifications)
    .post(notificationsController.createNotification)
    ;


router
    .route("/:id")
    .get(notificationsController.getNotificationById)
    //.patch(notificationsController.updateNotificationById)
    .patch(notificationsController.markAsRead)
    .delete(notificationsController.deleteNotificationById)
    ;

module.exports = router;

