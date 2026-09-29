import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const { type } = req.query;

    const filter = {
      recipient: userId,
    };

    if (
      type &&
      [
        "like",
        "comment",
        "upvote",
        "mention",
        "follow_user",
        "follow_tag",
      ].includes(type)
    ) {
      filter.type = type;
    }

    const notifications = await Notification.find(filter)
      .populate("sender", "name username avatarUrl")
      .populate("post", "title slug")
      .populate("comment", "content")
      .populate("tag", "name slug")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};

export const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    return res.status(200).json({
      count,
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);

    return res.status(500).json({
      message: "Failed to fetch unread notification count",
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    return res.status(500).json({
      message: "Failed to update notification",
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);

    return res.status(500).json({
      message: "Failed to update notifications",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    return res.status(500).json({
      message: "Failed to delete notification",
    });
  }
};
