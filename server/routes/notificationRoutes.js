const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notificationsController");

router.route("/").get(notificationsController.getAllNotifications);

router
    .route("/:id")
    .get(notificationsController.getNotificationById)
    .post(notificationsController.createNotification)
    .patch(notificationsController.updateNotificationById);


router.route("/read").get(notificationsController.getAllReadNotifications);
router.route("/unread").get(notificationsController.getAllUnreadNotifications);
router.route("/read/:id").patch(notificationsController.markNotificationAsRead);
router.route("/unread/:id").patch(notificationsController.markNotificationAsUnread);
router.route("/user/:id").get(notificationsController.getAllNotificationsForUser);
router.route("/user/:id/read").get(notificationsController.getAllReadNotificationsForUser);
router.route("/user/:id/unread").get(notificationsController.getAllUnreadNotificationsForUser);
router.route("/user/:id/read/:notificationId").patch(notificationsController.markNotificationAsReadForUser);
router.route("/user/:id/unread/:notificationId").patch(notificationsController.markNotificationAsUnreadForUser);
router.route("/user/:id/:notificationId").get(notificationsController.getNotificationByIdForUser);
router.route("/user/:id").post(notificationsController.sendNotificationToUser);
router.route("/user/:id/delete/:notificationId").delete(notificationsController.deleteNotificationById);




module.exports = router;

