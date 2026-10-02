import { Bell, Check, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";

import useNotifications from "../../hooks/useNotifications.js";

const getNotificationText = (notification) => {
  const senderName = notification.sender?.name || "Someone";

  return `${senderName} ${notification.message}`;
};

const getNotificationLink = (notification) => {
  if (notification.post?.slug) {
    return `/post/${notification.post.slug}`;
  }

  if (notification.tag?.slug) {
    return `/tag/${notification.tag.slug}`;
  }

  if (notification.sender?._id) {
    return `/profile/${notification.sender._id}`;
  }

  return null;
};

const NotificationItem = ({ notification, onClose }) => {
  const { markAsRead, deleteNotification } = useNotifications();

  const link = getNotificationLink(notification);

  const handleRead = async () => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    await deleteNotification(notification._id);
  };

  const content = (
    <div
      className={`group relative border-b border-white/5 px-4 py-4 transition hover:bg-white/[0.04] ${
        !notification.isRead ? "bg-white/[0.02]" : ""
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        {notification.sender?.avatarUrl ? (
          <img
            src={notification.sender.avatarUrl}
            alt={notification.sender?.name || "User"}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
            {notification.sender?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1 pr-6">
          <p
            className={`text-sm leading-5 ${
              notification.isRead ? "text-gray-400" : "text-gray-200"
            }`}
          >
            {getNotificationText(notification)}
          </p>

          {notification.post?.title && (
            <p className="mt-1 truncate text-xs text-gray-500">
              {notification.post.title}
            </p>
          )}

          <p className="mt-1 text-xs text-gray-600">
            {new Date(notification.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Unread indicator */}
        {!notification.isRead && (
          <span className="absolute right-3 top-5 h-2 w-2 rounded-full bg-blue-400" />
        )}

        {/* Actions */}
        <div className="absolute bottom-3 right-3 hidden items-center gap-1 group-hover:flex">
          {!notification.isRead && (
            <button
              type="button"
              onClick={handleRead}
              className="rounded-md p-1.5 text-gray-500 transition hover:bg-white/10 hover:text-white"
              title="Mark as read"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md p-1.5 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!link) {
    return content;
  }

  return (
    <Link
      to={link}
      onClick={async () => {
        await handleRead();
        onClose();
      }}
    >
      {content}
    </Link>
  );
};

const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, loading, markAllAsRead } =
    useNotifications();

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      <div
        className="
          fixed
          inset-0
          z-[190]
          bg-black/60
          backdrop-blur-sm
          md:hidden
        "
        onClick={onClose}
      />

      {/* =====================================================
          NOTIFICATION PANEL
      ===================================================== */}
      <div
        onClick={(event) => event.stopPropagation()}
        className="
          fixed
          left-1/2
          top-20
          z-[200]
          w-[calc(100vw-24px)]
          max-w-[380px]
          -translate-x-1/2
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-[#101014]
          shadow-2xl

          md:absolute
          md:left-auto
          md:right-0
          md:top-full
          md:mt-3
          md:w-[380px]
          md:max-w-none
          md:translate-x-0
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Notifications</h3>

            {unreadCount > 0 && (
              <p className="mt-0.5 text-xs text-gray-500">
                {unreadCount} unread
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="
                  rounded-md
                  px-2
                  py-1.5
                  text-xs
                  text-gray-400
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
              >
                Mark all read
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-md
                p-1.5
                text-gray-500
                transition
                hover:bg-white/10
                hover:text-white
              "
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[calc(100vh-120px)] overflow-y-auto md:max-h-[480px]">
          {loading && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-gray-500">Loading notifications...</p>
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="px-4 py-14 text-center">
              <Bell className="mx-auto h-9 w-9 text-gray-600" />

              <p className="mt-3 text-sm font-medium text-gray-300">
                No notifications
              </p>

              <p className="mt-1 text-xs text-gray-600">
                You're all caught up.
              </p>
            </div>
          )}

          {!loading && notifications.length > 0 && (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
