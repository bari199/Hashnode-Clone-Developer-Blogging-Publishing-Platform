import { createContext, useCallback, useEffect, useState } from "react";

import api from "../api/axios.js";
import useSocket from "../hooks/useSocket.js";
import useAuth from "../hooks/useAuth.js";

export const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
  const { socket, connected } = useSocket();
  const { status } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const fetchNotifications = useCallback(async () => {
    if (status !== "authenticated") {
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/notifications");

      setNotifications(response.data?.notifications || []);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  }, [status]);

  // ==========================================
  // LOAD UNREAD COUNT
  // ==========================================

  const fetchUnreadCount = useCallback(async () => {
    if (status !== "authenticated") {
      return;
    }

    try {
      const response = await api.get("/notifications/unread-count");

      // Backend returns: { count }
      setUnreadCount(response.data?.count || 0);
    } catch (error) {
      console.error(
        "Failed to load unread notification count:",
        error.response?.data?.message || error.message,
      );
    }
  }, [status]);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    if (status !== "authenticated") {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
    fetchUnreadCount();
  }, [status, fetchNotifications, fetchUnreadCount]);

  // ==========================================
  // REALTIME NOTIFICATION
  // ==========================================

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleNewNotification = (notification) => {
      console.log("New notification:", notification);

      setNotifications((currentNotifications) => {
        const alreadyExists = currentNotifications.some(
          (item) => item._id === notification._id,
        );

        if (alreadyExists) {
          return currentNotifications;
        }

        return [notification, ...currentNotifications];
      });

      setUnreadCount((currentCount) => currentCount + 1);
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, connected]);

  // ==========================================
  // MARK ONE AS READ
  // ==========================================

  const markAsRead = async (notificationId) => {
    try {
      const currentNotification = notifications.find(
        (notification) => notification._id === notificationId,
      );

      // Already read হলে API call/count change
      // করার দরকার নেই
      if (!currentNotification) {
        return;
      }

      if (currentNotification.isRead) {
        return;
      }

      await api.patch(`/notifications/${notificationId}/read`);

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification,
        ),
      );

      setUnreadCount((currentCount) => Math.max(0, currentCount - 1));
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // ==========================================
  // DELETE NOTIFICATION
  // ==========================================

  const deleteNotification = async (notificationId) => {
    try {
      const currentNotification = notifications.find(
        (notification) => notification._id === notificationId,
      );

      if (!currentNotification) {
        return;
      }

      await api.delete(`/notifications/${notificationId}`);

      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (notification) => notification._id !== notificationId,
        ),
      );

      // Unread notification delete করলে
      // unread count-ও কমবে
      if (!currentNotification.isRead) {
        setUnreadCount((currentCount) => Math.max(0, currentCount - 1));
      }
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error.response?.data?.message || error.message,
      );
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,

        fetchNotifications,
        fetchUnreadCount,

        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
