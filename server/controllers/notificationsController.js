const Notification = require("../models/Notification");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all notifications
// @route GET /notifications
// @access public
const getAllNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find().lean();
    res.json(notifications);
    });

const getAllReadNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ read: true }).lean();
    res.json(notifications);
    });

const getAllUnreadNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ read: false }).lean();
    res.json(notifications);
    });

// @desc Get a notification by id
// @route GET /notifications/:id
// @access private
const getNotificationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id
    }).select("-__v");
    if (!notification)
        return res.status(404).json({ error: "No notification found!" });
    return res.status(200).json(notification);
    });

// @desc Create a new notification
// @route POST /notifications
// @access private
const createNotification = asyncHandler(async (req, res) => {
    const { userId, from, message, subject } = req.body;
    if (!userId || !from || !message || !subject) {
        return res.status(400).json({ error: "All fields are required!" });
        }
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found!" });
    const notification = await Notification.create({
        userId,
        from,
        message,
        subject,
        });
    return res.status(201).json(notification);
    });

// @desc Update a notification by id
// @route PATCH /notifications/:id
// @access private
const updateNotificationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { read } = req.body;
    const {from, message, subject } = req.body;

    const notification = await Notification
        .findOne
        ({
            _id: id
        });
    if (!notification)
        return res.status(404).json({ error: "No notification found!" });
    notification.read = read;
    notification.from = from;
    notification.message = message;
    notification.subject = subject;
    const result = await notification.save();
    return res.status(200).json(notification);
    });

// @desc Delete a notification by id
// @route DELETE /notifications/:id
// @access private
const deleteNotificationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id });
    if (!notification)
        return res.status(404).json({ error: "No notification found!" });
    await notification.remove();
    return res.status(200).json({ message: "Notification deleted!" });
    });

// change a notification to read
const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id });
    if (!notification)
        return res.status(404).json({ error: "No notification found!" });
    notification.read = true;
    await notification.save();
    return res.status(200).json({ message: "Notification marked as read!" });
    });

// change a notification to unread
const markNotificationAsUnread = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id });
    if (!notification)
        return res.status(404).json({ error: "No notification found!" });
    notification.read = false;
    await notification.save();
    return res.status(200).json({ message: "Notification marked as unread!" });
    });

// post a new notification users notification list
const postNotification = asyncHandler(async (req, res) => {
    const { userId, from, message, subject } = req.body;
    if (!userId || !from || !message || !subject) {
        return res.status(400).json({ error: "All fields are required!" });
        }
    const user
        = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ error: "User not found!" });
    const notification = await Notification.create({ userId, from, message, subject });
    user.notifications.push(notification);
    await user.save();
    return res.status(201).json(notification);
    });


// delete a notification from users notification list
const deleteNotificationFromUser = asyncHandler(async (req, res) => {
    const { userId, notificationId } = req.body;
    if (!userId || !notificationId) {
        return res.status(400).json({ error: "All fields are required!" });
        }
    const user = await User
        .findOne
        ({
            _id: userId
        });
    if (!user) return res.status(404).json({ error: "User not found!" });
    const notification = await Notification
        .findOne
        ({
            _id: notificationId
        });
    if (!notification)
        return res.status(404).json({ error: "No notification found!" });
    user.notifications.pull(notification);
    await user.save();
    return res.status(200).json({ message: "Notification deleted!" });
    });

// @desc Get all notifications for a user
// @route GET /notifications/user/:id
// @access private
const getAllNotificationsForUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user
        = await User.findOne({ _id: id }).populate("notifications");
    if (!user) return res.status(404).json({ error: "User not found!" });
    return res.status(200).json(user.notifications);
    });

// @desc Get all read notifications for a user
// @route GET /notifications/user/:id/read
// @access private
const getAllReadNotificationsForUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User
        .findOne
        ({
            _id: id
        }).populate("notifications");
    if (!user) return res.status(404).json({ error: "User not found!" });
    const readNotifications = user.notifications.filter(
        (notification) => notification.read === true
        );
    return res.status(200).json(readNotifications);
    });

// @desc Get all unread notifications for a user
// @route GET /notifications/user/:id/unread
// @access private
const getAllUnreadNotificationsForUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User
        .findOne
        ({
            _id: id
        }).populate("notifications");
    if (!user) return res.status(404).json({ error: "User not found!" });
    const unreadNotifications = user.notifications.filter(
        (notification) => notification.read === false
        );
    return res.status(200).json(unreadNotifications);
    });

// @desc Get a notification by id for a user
// @route GET /notifications/user/:id/:notificationId
// @access private
const getNotificationByIdForUser = asyncHandler(async (req, res) => {
    const { id, notificationId } = req.params;
    const user = await User
        .findOne
        ({
            _id: id 
        }).populate("notifications");
    if (!user) return res.status(404).json({ error: "User not found!" });
    const notification = user.notifications.find(
        (notification) => notification._id == notificationId
        );
    if (!notification)
        return res.status(404).json({ error: "No notification found!" });
    return res.status(200).json(notification);
    });

// @desc Send a notification to a user from a user
// @route POST /notifications/user/:id
// @access private
const sendNotificationToUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { from, message, subject } = req.body;
    if (!from || !message || !subject) {
        return res.status(400).json({ error: "All fields are required!" });
        }
    const user = await User
        .findOne
        ({
            _id: id
        });
    if (!user) return res.status(404).json({ error: "User not found!" });
    const notification = await Notification.create({ userId: id, from, message, subject });
    user.notifications.push(notification);
    await user.save();
    return res.status(201).json(notification);
    });





module.exports = {
    getAllNotifications,
    getAllReadNotifications,
    getAllUnreadNotifications,
    getNotificationById,
    createNotification,
    updateNotificationById,
    deleteNotificationById,
    markNotificationAsRead,
    markNotificationAsUnread,
    };

