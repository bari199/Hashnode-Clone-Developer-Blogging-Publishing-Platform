import { Bell } from "lucide-react";

import useNotifications from "../../hooks/useNotifications.js";

const NotificationBell = ({ onClick }) => {
  const { unreadCount } = useNotifications();

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-lg p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />

      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
