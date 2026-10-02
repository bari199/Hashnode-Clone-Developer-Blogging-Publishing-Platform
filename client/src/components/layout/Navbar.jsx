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
  Search,
  X,
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

const Navbar = ({ className = "", onMenuClick, showLogo = true }) => {
  const { user, status, logout } = useAuth();

  const navigate = useNavigate();

  // =====================================
  // Notification State
  // =====================================

  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef(null);

  // =====================================
  // Mobile Search State
  // =====================================

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // =====================================
  // Logout
  // =====================================

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  // =====================================
  // Notification Outside Click
  // =====================================

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

  // =====================================
  // Notification Escape
  // =====================================

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

  // =====================================
  // Mobile Search Escape
  // =====================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowMobileSearch(false);
      }
    };

    if (showMobileSearch) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showMobileSearch]);

  // =====================================
  // Mobile Search Open
  // =====================================

  const handleOpenMobileSearch = () => {
    setShowMobileSearch(true);

    // Close notification when search opens
    setShowNotifications(false);
  };

  // =====================================
  // Mobile Search Close
  // =====================================

  const handleCloseMobileSearch = () => {
    setShowMobileSearch(false);
  };

  // =====================================
  // UI
  // =====================================

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className={`
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
          ${className}
        `}
      >
        <div
          className="
            mx-auto
            flex
            h-16
            max-w-none
            items-center
            gap-2
            px-3
            sm:gap-3
            sm:px-5
            lg:gap-4
            lg:px-8
          "
        >
          {/* =====================================================
              LOGO
          ===================================================== */}

          <div
            className={`
              flex
              shrink-0
              items-center
              ${showLogo ? "" : "lg:hidden"}
            `}
          >
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  text-black
                "
              >
                <span className="text-sm font-bold">H</span>
              </div>

              <span
                className="
                  hidden
                  text-lg
                  font-bold
                  tracking-tight
                  sm:block
                "
              >
                Node
                <span className="text-zinc-400">Clone</span>
              </span>
            </Link>
          </div>

          {/* =====================================================
              DESKTOP USER SEARCH
          ===================================================== */}

          <div
            className="
              hidden
              max-w-xl
              min-w-0
              flex-1
              md:block
            "
          >
            <UserSearch />
          </div>

          {/* =====================================================
              RIGHT SIDE
          ===================================================== */}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-0.5
              sm:gap-1
            "
          >
            {/* =========================================
                MOBILE SEARCH
            ========================================= */}

            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenMobileSearch}
              className="
                h-9
                w-9
                text-zinc-400
                hover:bg-white/[0.05]
                hover:text-white
                md:hidden
              "
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* =========================================
                NOTIFICATIONS
            ========================================= */}

            <div ref={notificationRef} className="relative">
              <NotificationBell
                onClick={() => {
                  setShowNotifications((current) => !current);

                  setShowMobileSearch(false);
                }}
              />

              {showNotifications && (
                <NotificationDropdown
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* =========================================
                TAGS
            ========================================= */}

            <Link to="/tags" className="hidden sm:block">
              <Button
                variant="ghost"
                className="
                  gap-2
                  text-zinc-400
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <Tags className="h-4 w-4" />

                <span className="hidden lg:inline">Tags</span>
              </Button>
            </Link>

            {/* =========================================
                WRITE
            ========================================= */}

            <Link to="/editor/new" className="hidden sm:block">
              <Button
                variant="ghost"
                className="
                  gap-2
                  text-zinc-300
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <PenLine className="h-4 w-4" />

                <span className="hidden lg:inline">Write</span>
              </Button>
            </Link>

            {/* =========================================
                THEME
            ========================================= */}

            <Button
              variant="ghost"
              size="icon"
              className="
                h-9
                w-9
                text-zinc-400
                hover:bg-white/[0.05]
                hover:text-white
              "
              aria-label="Toggle theme"
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
                    type="button"
                    className="
                      ml-1
                      rounded-full
                      outline-none
                      ring-offset-[#08090b]
                      focus-visible:ring-2
                      focus-visible:ring-white/20
                      sm:ml-2
                    "
                    aria-label="User menu"
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
                  sideOffset={8}
                  className="
                    z-[200]
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

              <div className="ml-1 flex items-center gap-1 sm:ml-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="
                      px-2
                      text-zinc-400
                      hover:bg-white/[0.05]
                      hover:text-white
                      sm:px-3
                    "
                  >
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    className="
                      px-3
                      bg-white
                      text-black
                      hover:bg-zinc-200
                      sm:px-4
                    "
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* =========================================
                MOBILE MENU
            ========================================= */}

            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="
                ml-0.5
                h-9
                w-9
                text-zinc-400
                hover:bg-white/[0.05]
                hover:text-white
                lg:hidden
              "
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE SEARCH MODAL
      ===================================================== */}

      {showMobileSearch && (
        <div
          className="
            fixed
            inset-x-0
            top-16
            z-[120]
            border-b
            border-white/[0.08]
            bg-[#08090b]
            shadow-2xl
            shadow-black/40
            md:hidden
          "
        >
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Search Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-white/[0.07]
                px-4
                py-3
              "
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-zinc-500" />

                <p className="text-sm font-medium text-zinc-300">
                  Search people
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseMobileSearch}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  text-zinc-500
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Component */}

            <div className="px-4 py-3">
              <div className="relative z-[130] w-full">
                <UserSearch />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
