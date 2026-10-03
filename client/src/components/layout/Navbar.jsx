import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import UserSearch from "../user/UserSearch.jsx";
import NotificationBell from "../notification/NotificationBell.jsx";
import NotificationDropdown from "../notification/NotificationDropdown.jsx";

import {
  PenLine,
  Moon,
  Sun,
  Menu,
  LogOut,
  LayoutDashboard,
  Tags,
  Search,
  X,
} from "lucide-react";

import useAuth from "../../hooks/useAuth.js";
import { useTheme } from "../../context/ThemeContext.jsx";

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
  const { theme, toggleTheme } = useTheme();

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
    setShowNotifications(false);
  };

  // =====================================
  // Mobile Search Close
  // =====================================

  const handleCloseMobileSearch = () => {
    setShowMobileSearch(false);
  };

  // =====================================
  // Theme
  // =====================================

  const isDark = theme === "dark";

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
          border-border
          bg-background/95
          text-foreground
          backdrop-blur-xl
          transition-colors
          duration-200
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
                  bg-primary
                  text-primary-foreground
                  transition-colors
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
                Node <span className="text-muted-foreground">Clone</span>
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
                text-muted-foreground
                hover:bg-accent
                hover:text-accent-foreground
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
                  text-muted-foreground
                  hover:bg-accent
                  hover:text-accent-foreground
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
                  text-muted-foreground
                  hover:bg-accent
                  hover:text-accent-foreground
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
              onClick={toggleTheme}
              className="
                h-9
                w-9
                text-muted-foreground
                hover:bg-accent
                hover:text-accent-foreground
              "
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
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
                      ring-offset-background
                      focus-visible:ring-2
                      focus-visible:ring-ring
                      sm:ml-2
                    "
                    aria-label="User menu"
                  >
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage
                        src={user?.avatarUrl || ""}
                        alt={user?.name || "User"}
                      />

                      <AvatarFallback
                        className="
                          bg-muted
                          text-xs
                          text-muted-foreground
                        "
                      >
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
                    border-border
                    bg-popover
                    text-popover-foreground
                  "
                >
                  {/* User Information */}

                  <div className="px-3 py-3">
                    <p className="truncate text-sm font-medium">{user?.name}</p>

                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator className="bg-border" />

                  {/* Dashboard */}

                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="
                      cursor-pointer
                      text-foreground
                      focus:bg-accent
                      focus:text-accent-foreground
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
                      text-foreground
                      focus:bg-accent
                      focus:text-accent-foreground
                    "
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={user?.avatarUrl || ""}
                        alt={user?.name || "User"}
                      />

                      <AvatarFallback className="bg-muted text-[9px] text-muted-foreground">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border" />

                  {/* Logout */}

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="
                      cursor-pointer
                      text-red-500
                      focus:bg-red-500/10
                      focus:text-red-500
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
                      text-muted-foreground
                      hover:bg-accent
                      hover:text-accent-foreground
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
                      bg-primary
                      text-primary-foreground
                      hover:bg-primary/90
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
                text-muted-foreground
                hover:bg-accent
                hover:text-accent-foreground
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
            border-border
            bg-background
            shadow-2xl
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
                border-border
                px-4
                py-3
              "
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />

                <p className="text-sm font-medium text-foreground">
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
                  text-muted-foreground
                  transition
                  hover:bg-accent
                  hover:text-accent-foreground
                "
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Component */}

            <div className="px-4 py-3">
              <div className="w-full">
                <UserSearch mobile />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
