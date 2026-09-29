import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// Get notifications
router.get("/", authMiddleware, getNotifications);

// Get unread notification count
router.get("/unread-count", authMiddleware, getUnreadNotificationCount);

// Mark all as read
router.patch("/read-all", authMiddleware, markAllNotificationsAsRead);

// Mark single notification as read
router.patch("/:id/read", authMiddleware, markNotificationAsRead);

// Delete notification
router.delete("/:id", authMiddleware, deleteNotification);

export default router;
