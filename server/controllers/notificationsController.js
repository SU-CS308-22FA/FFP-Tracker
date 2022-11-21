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

const getNotificationById = asyncHandler(async (req, res) => {
    const { id } = req.params.id;
    const notification = await Notification.findOne({ _id: id }).lean();
    if (!notification) 
        return res.status(404).json({ error: "Notification not found!" });
    return res.status(200).json(notification);
});


// create a new notification with a sender and reciever
const createNotification = asyncHandler(async (req, res) => {
    const { reciever, sender, message, subject } = req.body;
    if (!reciever || !sender || !message || !subject) {
        return res.status(400).json({ error: "All fields are required!" });
    }
    const notification = await Notification.create({
        reciever: reciever,
        sender: sender,
        message: message,
        subject: subject,
        read: false,
    });
    return res.status(201).json(notification);
});



// update a notification by notification id
const updateNotificationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { read, sender, reciever, subject, message} = req.body;
    if (!read || !sender || !reciever || !subject || !message) {
        return res.status(400).json({ error: "All fields are required to update a notification!" });
    }
    const notification = await Notification.findOne({ _id: id });
    if (!notification) 
        return res.status(404).json({ error: "Notification not found!" });
    notification.read.set(read);
    notification.sender.set(sender);
    notification.reciever.set(reciever);
    notification.subject.set(subject);
    notification.message.set(message);
    const result = await notification.save();
    return res.status(200).json(notification);
});

// @desc make a notification read
// @route PATCH /notifications/:id
// @access public
const markAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification
        .findOne ({ _id: id })
        .lean();
    if (!notification)
        return res.status(404).json({ error: "Notification not found!" });
    notification.read.set(true);
    notification.read = true;

    const result = await notification.save();
    return res.status(200).json(notification);
});


// @desc delete a notification by id
// @route DELETE /notifications/:id
// @access public
const deleteNotificationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await Notification
        .findOne
        ({
            _id: id
        })
        .lean();
    if (!notification)
        return res.status(404).json({ error: "Notification not found!" });
    const result = await Notification.deleteOne({ _id: id });
    return res.status(200).json({ message: "Notification deleted!" });
});    


module.exports = {
    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotificationById,
    markAsRead,
    deleteNotificationById,
};



