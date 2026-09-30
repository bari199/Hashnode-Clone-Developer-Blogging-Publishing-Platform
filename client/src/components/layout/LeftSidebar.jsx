import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Home,
  LayoutGrid,
  Search,
  Hash,
  PenLine,
  FileText,
  Users,
  MessageSquare,
  Bookmark,
  Settings,
  User,
  LogOut,
  ChevronsUpDown,
  PanelLeft,
  Grip,
} from "lucide-react";

import useAuth from "../../hooks/useAuth.js";
import SidebarItem from "./SidebarItem.jsx";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.jsx";

const SectionLabel = ({ children, collapsed }) =>
  collapsed ? (
    <div className="mx-2 my-3 h-px bg-white/[0.06]" />
  ) : (
    <p className="mb-1 mt-5 px-3 text-xs font-medium text-zinc-500">
      {children}
    </p>
  );

// Single row inside the profile popup
const MenuItem = ({ icon: Icon, label, onClick, danger = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm transition ${
      danger
        ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
        : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
    }`}
  >
    <Icon className="h-4 w-4 shrink-0" />
    <span className="truncate">{label}</span>
  </button>
);

const LeftSidebar = ({ collapsed = false, onToggle, onNavigate }) => {
  const { user, status, logout } = useAuth();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const footerRef = useRef(null);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
    onNavigate?.();
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  // =====================================================
  // Close the profile popup on: outside click, Escape,
  // route change, and sidebar expand/collapse
  // =====================================================

  useEffect(() => {
    if (!menuOpen) return;

    const onMouseDown = (e) => {
      if (footerRef.current && !footerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, collapsed]);

  // Shared props for every sidebar item
  const item = (path) => ({
    to: path,
    active: isActive(path),
    collapsed,
    onClick: onNavigate,
  });

  return (
    <div className="flex h-full flex-col">
      {/* =====================================================
          HEADER: LOGO + TOGGLE
      ===================================================== */}

      <div
        className={`flex h-16 shrink-0 items-center ${
          collapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        {!collapsed && (
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <span className="text-sm font-bold">H</span>
            </div>

            <span className="text-lg font-bold tracking-tight">
              Node
              <span className="text-zinc-400">Clone</span>
            </span>
          </Link>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="
            flex h-8 w-8 items-center justify-center
            rounded-md
            text-zinc-400
            transition
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>

      {/* =====================================================
          SCROLLABLE NAV
      ===================================================== */}

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3">
        <nav className="space-y-1">
          <SidebarItem icon={Home} label="Home" {...item("/")} />

          <SidebarItem icon={LayoutGrid} label="Feed" {...item("/feeds")} />

          <SidebarItem icon={Hash} label="Tags" {...item("/tags")} />

          <SidebarItem
            icon={Search}
            label="Search"
            collapsed={collapsed}
            onClick={() => go("/search")}
            trailing={
              <span className="flex items-center gap-1">
                <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-zinc-400">
                  Ctrl
                </kbd>

                <kbd className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-zinc-400">
                  K
                </kbd>
              </span>
            }
          />
        </nav>

        <SectionLabel collapsed={collapsed}>Author</SectionLabel>

        <nav className="space-y-1">
          <SidebarItem icon={PenLine} label="Write" {...item("/editor/new")} />

          <SidebarItem icon={FileText} label="Drafts" {...item("/dashboard")} />
        </nav>

        <SectionLabel collapsed={collapsed}>Community</SectionLabel>

        <nav className="space-y-1">
          <SidebarItem icon={Users} label="Authors" {...item("/authors")} />

          <SidebarItem
            icon={MessageSquare}
            label="Discussions"
            {...item("/discussions")}
          />
        </nav>
      </div>

      {/* =====================================================
          FOOTER: ACCOUNT + MORE
          (popup lives INSIDE the sidebar's stacking context,
           so it can never render behind the sidebar)
      ===================================================== */}

      <div
        ref={footerRef}
        className="relative shrink-0 space-y-1 border-t border-white/[0.06] p-3"
      >
        {status === "authenticated" ? (
          <>
            {/* ---------- PROFILE POPUP ---------- */}
            {menuOpen && (
              <div
                role="menu"
                className={`
                  absolute z-50
                  rounded-xl border border-white/[0.08]
                  bg-[#1a1d23] p-1.5 text-white shadow-2xl shadow-black/50
                  animate-in fade-in zoom-in-95 duration-150
                  ${
                    collapsed
                      ? "bottom-3 left-full ml-2 w-64"
                      : "bottom-full left-3 right-3 mb-2"
                  }
                `}
              >
                {/* User info */}
                <div className="flex min-w-0 items-center gap-2.5 px-2.5 py-2.5">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />

                    <AvatarFallback className="bg-zinc-800 text-xs">
                      {initial}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user?.name}</p>

                    <p className="truncate text-[11px] text-zinc-500">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <MenuItem
                  icon={User}
                  label="Profile"
                  onClick={() => go(`/profile/${user?._id}`)}
                />
                <MenuItem
                  icon={Bookmark}
                  label="Bookmarks"
                  onClick={() => go("/bookmarks")}
                />
                <MenuItem
                  icon={Settings}
                  label="Settings"
                  onClick={() => go("/settings")}
                />

                <div className="my-1.5 h-px bg-white/[0.08]" />

                <MenuItem
                  icon={LogOut}
                  label="Sign out"
                  danger
                  onClick={handleLogout}
                />
              </div>
            )}

            {/* ---------- PROFILE TRIGGER ---------- */}
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              title={collapsed ? user?.name : undefined}
              onClick={() => setMenuOpen((open) => !open)}
              className={`
                flex w-full items-center rounded-lg text-sm text-zinc-200
                outline-none transition hover:bg-white/[0.05]
                ${menuOpen ? "bg-white/[0.05]" : ""}
                ${collapsed ? "h-10 justify-center" : "gap-3 px-3 py-2"}
              `}
            >
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />

                <AvatarFallback className="bg-zinc-800 text-[10px] text-white">
                  {initial}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <>
                  <span className="flex-1 truncate text-left">
                    {user?.name}
                  </span>

                  <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" />
                </>
              )}
            </button>
          </>
        ) : (
          <SidebarItem
            icon={User}
            label="Login"
            to="/login"
            collapsed={collapsed}
            onClick={onNavigate}
          />
        )}

        <SidebarItem
          icon={Grip}
          label="More"
          collapsed={collapsed}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default LeftSidebar;
