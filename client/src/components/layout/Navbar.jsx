import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import UserSearch from "../user/UserSearch.jsx";
import NotificationBell from "../notification/NotificationBell.jsx";
import NotificationDropdown from "../notification/NotificationDropdown.jsx";
import {
  PenLine,
  Moon,
  Menu,
  LogOut,
  LayoutDashboard,
  Tags,
} from "lucide-react";

import useAuth from "../../hooks/useAuth.js";

import { Button } from "../ui/button.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.jsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";

const Navbar = () => {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showNotifications]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showNotifications]);

  return (
    <nav
      className="
        fixed
        inset-x-0
        top-0
        z-[100]
        h-16
        border-b
        border-white/[0.07]
        bg-[#08090b]/95
        text-white
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-16
          max-w-[1500px]
          items-center
          gap-4
          px-5
          lg:px-8
        "
      >
        {/* =====================================================
            LOGO
        ===================================================== */}

        <div className="flex shrink-0 items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <span className="text-sm font-bold">H</span>
            </div>

            <span className="text-lg font-bold tracking-tight">
              Node
              <span className="text-zinc-400">Clone</span>
            </span>
          </Link>
        </div>

        {/* =====================================================
            USER SEARCH
        ===================================================== */}

        <div className="hidden max-w-xl flex-1 md:block">
          <UserSearch />
        </div>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <div className="ml-auto flex shrink-0 items-center gap-1">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="
              text-zinc-400
              hover:bg-white/[0.05]
              hover:text-white
              md:hidden
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Button>{" "}
          <div ref={notificationRef} className="relative">
            <NotificationBell
              onClick={() => setShowNotifications((current) => !current)}
            />

            {showNotifications && (
              <NotificationDropdown
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>
          {/* Tags */}
          <Link to="/tags">
            <Button
              variant="ghost"
              className="
                hidden
                gap-2
                text-zinc-400
                hover:bg-white/[0.05]
                hover:text-white
                sm:flex
              "
            >
              <Tags className="h-4 w-4" />
              Tags
            </Button>
          </Link>
          {/* Write */}
          <Link to="/editor/new">
            <Button
              variant="ghost"
              className="
                hidden
                gap-2
                text-zinc-300
                hover:bg-white/[0.05]
                hover:text-white
                sm:flex
              "
            >
              <PenLine className="h-4 w-4" />
              Write
            </Button>
          </Link>
          {/* Theme */}
          <Button
            variant="ghost"
            size="icon"
            className="
              text-zinc-400
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <Moon className="h-4 w-4" />
          </Button>
          {/* =================================================
              AUTHENTICATED USER
          ================================================= */}
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    ml-2
                    rounded-full
                    outline-none
                    ring-offset-[#08090b]
                    focus-visible:ring-2
                    focus-visible:ring-white/20
                  "
                >
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarImage
                      src={user?.avatarUrl || ""}
                      alt={user?.name || "User"}
                    />

                    <AvatarFallback className="bg-zinc-800 text-xs text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="
                  w-56
                  border-white/[0.08]
                  bg-[#111214]
                  text-white
                "
              >
                {/* User Information */}

                <div className="px-3 py-3">
                  <p className="truncate text-sm font-medium">{user?.name}</p>

                  <p className="truncate text-xs text-zinc-500">
                    {user?.email}
                  </p>
                </div>

                <DropdownMenuSeparator className="bg-white/[0.08]" />

                {/* Dashboard */}

                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="
                    cursor-pointer
                    text-zinc-300
                    focus:bg-white/[0.06]
                    focus:text-white
                  "
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>

                {/* Profile */}

                <DropdownMenuItem
                  onClick={() => navigate(`/profile/${user?._id}`)}
                  className="
                    cursor-pointer
                    text-zinc-300
                    focus:bg-white/[0.06]
                    focus:text-white
                  "
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarImage
                      src={user?.avatarUrl || ""}
                      alt={user?.name || "User"}
                    />

                    <AvatarFallback className="bg-zinc-700 text-[9px]">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  Profile
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/[0.08]" />

                {/* Logout */}

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="
                    cursor-pointer
                    text-red-400
                    focus:bg-red-500/10
                    focus:text-red-300
                  "
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* =================================================
               GUEST USER
            ================================================= */

            <div className="ml-2 flex items-center gap-1">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="
                    text-zinc-400
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  Login
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  className="
                    bg-white
                    text-black
                    hover:bg-zinc-200
                  "
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="
              ml-1
              text-zinc-400
              hover:bg-white/[0.05]
              hover:text-white
              lg:hidden
            "
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
