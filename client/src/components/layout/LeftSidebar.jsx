import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  X,
  Loader2,
} from "lucide-react";

import useAuth from "../../hooks/useAuth.js";
import useGlobalSearch from "../../hooks/useGlobalSearch.js";

import SidebarItem from "./SidebarItem.jsx";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.jsx";

/* =========================================================
   SECTION LABEL
========================================================= */

const SectionLabel = ({ children, collapsed }) =>
  collapsed ? (
    <div className="mx-2 my-3 h-px bg-white/[0.06]" />
  ) : (
    <p className="mb-1 mt-5 px-3 text-xs font-medium text-zinc-500">
      {children}
    </p>
  );

/* =========================================================
   MENU ITEM
========================================================= */

const MenuItem = ({ icon: Icon, label, onClick, danger = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex
      w-full
      items-center
      gap-2.5
      rounded-md
      px-2.5
      py-2
      text-left
      text-sm
      transition
      ${
        danger
          ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
          : "text-zinc-300 hover:bg-white/[0.06] hover:text-white"
      }
    `}
  >
    <Icon className="h-4 w-4 shrink-0" />

    <span className="truncate">{label}</span>
  </button>
);

/* =========================================================
   SEARCH MODAL
========================================================= */

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { people, posts, tags, loading, error } = useGlobalSearch(
    query,
    activeTab,
  );

  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  /* =======================================================
     TABS
  ======================================================= */

  const tabs = [
    {
      id: "all",
      label: "All",
    },
    {
      id: "tags",
      label: "Tags",
    },
    {
      id: "posts",
      label: "Posts",
    },
    {
      id: "people",
      label: "People",
    },
  ];

  const hasQuery = query.trim().length > 0;

  /* =======================================================
     AVATAR
  ======================================================= */

  const renderAvatar = (person) => {
    if (person?.avatarUrl) {
      return (
        <img
          src={person.avatarUrl}
          alt={person?.name || "User"}
          className="
            h-10
            w-10
            shrink-0
            rounded-full
            object-cover
          "
        />
      );
    }

    return (
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white/[0.08]
          text-sm
          font-semibold
          text-white
        "
      >
        {person?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>
    );
  };

  /* =======================================================
     PEOPLE RESULTS
  ======================================================= */

  const renderPeople = (items = people) => {
    if (!items.length) {
      return (
        <div className="px-3 py-6 text-center">
          <p className="text-sm text-zinc-500">No people found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {items.map((person) => (
          <Link
            key={person._id}
            to={`/profile/${person._id}`}
            onClick={onClose}
            className="
              flex
              items-center
              gap-3
              rounded-lg
              px-3
              py-2.5
              transition
              hover:bg-white/[0.05]
            "
          >
            {renderAvatar(person)}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {person.name || "Unnamed user"}
              </p>

              {person.bio && (
                <p className="mt-0.5 truncate text-xs text-zinc-500">
                  {person.bio}
                </p>
              )}
            </div>

            <Users className="h-4 w-4 shrink-0 text-zinc-600" />
          </Link>
        ))}
      </div>
    );
  };

  /* =======================================================
     POST RESULTS
  ======================================================= */

  const renderPosts = (items = posts) => {
    if (!items.length) {
      return (
        <div className="px-3 py-6 text-center">
          <p className="text-sm text-zinc-500">No posts found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {items.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post.slug}`}
            onClick={onClose}
            className="
              flex
              gap-3
              rounded-lg
              px-3
              py-2.5
              transition
              hover:bg-white/[0.05]
            "
          >
            {/* Cover */}
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title || "Post"}
                className="
                  h-12
                  w-16
                  shrink-0
                  rounded-md
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-12
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  bg-white/[0.05]
                "
              >
                <FileText className="h-4 w-4 text-zinc-600" />
              </div>
            )}

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium text-white">
                {post.title || "Untitled post"}
              </p>

              {post.author?.name && (
                <p className="mt-1 truncate text-xs text-zinc-500">
                  by {post.author.name}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  /* =======================================================
     TAG RESULTS
  ======================================================= */

  const renderTags = (items = tags) => {
    if (!items.length) {
      return (
        <div className="px-3 py-6 text-center">
          <p className="text-sm text-zinc-500">No tags found.</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {items.map((tag) => (
          <Link
            key={tag._id}
            to={`/tag/${tag.slug}`}
            onClick={onClose}
            className="
              flex
              items-center
              gap-3
              rounded-lg
              px-3
              py-2.5
              transition
              hover:bg-white/[0.05]
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-white/[0.05]
              "
            >
              <Hash className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                #{tag.name}
              </p>

              <p className="text-xs text-zinc-500">Explore this topic</p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  /* =======================================================
     MODAL
  ======================================================= */

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[300]
        flex
        items-center
        justify-center
        p-3
        sm:p-4
      "
    >
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="
          absolute
          inset-0
          cursor-default
          bg-black/70
          backdrop-blur-sm
        "
      />

      {/* =====================================================
          MODAL CONTAINER
      ===================================================== */}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        className="
          relative
          z-10
          flex
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-white/[0.08]
          bg-[#111214]
          text-white
          shadow-2xl
          shadow-black/60
        "
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/[0.06]
            px-4
            py-3.5
            sm:px-5
          "
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white/[0.06]
              "
            >
              <Search className="h-4 w-4 text-zinc-300" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">Search</h2>

              <p className="text-[11px] text-zinc-500">
                Find people, posts and tags
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
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

        {/* ===================================================
            SEARCH INPUT + TABS
        =================================================== */}

        <div className="border-b border-white/[0.06] p-4 sm:p-5">
          {/* Search Input */}

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-white/[0.08]
              bg-white/[0.03]
              px-3.5
              py-3
              transition
              focus-within:border-white/20
            "
          >
            <Search className="h-4 w-4 shrink-0 text-zinc-500" />

            <input
              autoFocus
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder="Search people, posts, tags..."
              className="
                min-w-0
                flex-1
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-zinc-600
              "
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="
                  rounded-md
                  p-1
                  text-zinc-500
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Tabs */}

          <div className="mt-4 flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`
                  shrink-0
                  rounded-lg
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  transition
                  ${
                    activeTab === tab.id
                      ? "bg-white text-black"
                      : "text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================
            RESULTS AREA
        =================================================== */}

        <div
          className="
            max-h-[60vh]
            min-h-[180px]
            overflow-y-auto
            p-3
            sm:p-4
          "
        >
          {/* =================================================
              NO QUERY
          ================================================= */}

          {!hasQuery && (
            <div
              className="
                flex
                min-h-[180px]
                flex-col
                items-center
                justify-center
                px-4
                text-center
              "
            >
              <Search className="h-8 w-8 text-zinc-700" />

              <p className="mt-3 text-sm font-medium text-zinc-400">
                Start searching
              </p>

              <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-600">
                Search for authors, posts or tags from one place.
              </p>
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {hasQuery && loading && (
            <div
              className="
                flex
                min-h-[180px]
                items-center
                justify-center
              "
            >
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {hasQuery && !loading && error && (
            <div
              className="
                flex
                min-h-[180px]
                items-center
                justify-center
                px-4
                text-center
              "
            >
              <div>
                <p className="text-sm text-red-400">{error}</p>

                <p className="mt-1 text-xs text-zinc-600">
                  Please try another search.
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              RESULTS
          ================================================= */}

          {hasQuery && !loading && !error && (
            <>
              {/* =============================================
                  ALL
              ============================================= */}

              {activeTab === "all" && (
                <div className="space-y-5">
                  {/* PEOPLE */}

                  <section>
                    <div className="mb-2 flex items-center justify-between px-1">
                      <h3
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-zinc-500
                        "
                      >
                        People
                      </h3>

                      {people.length > 0 && (
                        <span className="text-[11px] text-zinc-600">
                          {people.length}
                        </span>
                      )}
                    </div>

                    {renderPeople()}
                  </section>

                  {/* POSTS */}

                  <section>
                    <div className="mb-2 flex items-center justify-between px-1">
                      <h3
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-zinc-500
                        "
                      >
                        Posts
                      </h3>

                      {posts.length > 0 && (
                        <span className="text-[11px] text-zinc-600">
                          {posts.length}
                        </span>
                      )}
                    </div>

                    {renderPosts()}
                  </section>

                  {/* TAGS */}

                  <section>
                    <div className="mb-2 flex items-center justify-between px-1">
                      <h3
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-zinc-500
                        "
                      >
                        Tags
                      </h3>

                      {tags.length > 0 && (
                        <span className="text-[11px] text-zinc-600">
                          {tags.length}
                        </span>
                      )}
                    </div>

                    {renderTags()}
                  </section>

                  {/* ALL EMPTY */}

                  {people.length === 0 &&
                    posts.length === 0 &&
                    tags.length === 0 && (
                      <div className="py-12 text-center">
                        <Search className="mx-auto h-8 w-8 text-zinc-700" />

                        <p className="mt-3 text-sm text-zinc-400">
                          No results found
                        </p>

                        <p className="mt-1 text-xs text-zinc-600">
                          Try a different keyword.
                        </p>
                      </div>
                    )}
                </div>
              )}

              {/* =============================================
                  PEOPLE
              ============================================= */}

              {activeTab === "people" && (
                <section>
                  <div className="mb-2 px-1">
                    <h3
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-zinc-500
                      "
                    >
                      People
                    </h3>
                  </div>

                  {renderPeople()}
                </section>
              )}

              {/* =============================================
                  POSTS
              ============================================= */}

              {activeTab === "posts" && (
                <section>
                  <div className="mb-2 px-1">
                    <h3
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-zinc-500
                      "
                    >
                      Posts
                    </h3>
                  </div>

                  {renderPosts()}
                </section>
              )}

              {/* =============================================
                  TAGS
              ============================================= */}

              {activeTab === "tags" && (
                <section>
                  <div className="mb-2 px-1">
                    <h3
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-zinc-500
                      "
                    >
                      Tags
                    </h3>
                  </div>

                  {renderTags()}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* =========================================================
   LEFT SIDEBAR
========================================================= */

const LeftSidebar = ({ collapsed = false, onToggle, onNavigate }) => {
  const { user, status, logout } = useAuth();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const footerRef = useRef(null);

  /* =======================================================
     ACTIVE ROUTE
  ======================================================= */

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  /* =======================================================
     NAVIGATE
  ======================================================= */

  const go = (path) => {
    setMenuOpen(false);

    navigate(path);

    onNavigate?.();
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    setMenuOpen(false);

    logout();

    navigate("/");

    onNavigate?.();
  };

  /* =======================================================
     SEARCH OPEN
  ======================================================= */

  const handleSearchOpen = () => {
    setMenuOpen(false);

    setSearchOpen(true);
  };

  /* =======================================================
     SEARCH CLOSE
  ======================================================= */

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  /* =======================================================
     INITIAL
  ======================================================= */

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  /* =======================================================
     PROFILE POPUP
     OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onMouseDown = (event) => {
      if (footerRef.current && !footerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);

      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  /* =======================================================
     CLOSE PROFILE MENU ON ROUTE / COLLAPSE
  ======================================================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, collapsed]);

  /* =======================================================
     CLOSE SEARCH WHEN ROUTE CHANGES
  ======================================================= */

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  /* =======================================================
     SIDEBAR ITEM PROPS
  ======================================================= */

  const item = (path) => ({
    to: path,
    active: isActive(path),
    collapsed,
    onClick: onNavigate,
  });

  return (
    <>
      <div className="flex h-full flex-col">
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className={`
            flex
            h-16
            shrink-0
            items-center
            ${collapsed ? "justify-center" : "justify-between px-4"}
          `}
        >
          {/* Logo */}

          {!collapsed && (
            <Link
              to="/"
              onClick={onNavigate}
              className="flex items-center gap-2.5"
            >
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  text-black
                "
              >
                <span className="text-sm font-bold">H</span>
              </div>

              <span className="text-lg font-bold tracking-tight">
                Node
                <span className="text-zinc-400">Clone</span>
              </span>
            </Link>
          )}

          {/* Collapse / Expand */}

          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
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

        {/* =================================================
            SCROLLABLE NAV
        ================================================= */}

        <div
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            px-3
            pb-3
          "
        >
          {/* =================================================
              MAIN NAV
          ================================================= */}

          <nav className="space-y-1">
            <SidebarItem icon={Home} label="Home" {...item("/")} />

            <SidebarItem icon={LayoutGrid} label="Feed" {...item("/feeds")} />

            <SidebarItem icon={Hash} label="Tags" {...item("/tags")} />

            {/* =================================================
                SEARCH
            ================================================= */}

            <SidebarItem
              icon={Search}
              label="Search"
              collapsed={collapsed}
              onClick={handleSearchOpen}
              trailing={
                <span className="flex items-center gap-1">
                  <kbd
                    className="
                      rounded
                      bg-white/[0.06]
                      px-1.5
                      py-0.5
                      text-[10px]
                      text-zinc-400
                    "
                  >
                    Ctrl
                  </kbd>

                  <kbd
                    className="
                      rounded
                      bg-white/[0.06]
                      px-1.5
                      py-0.5
                      text-[10px]
                      text-zinc-400
                    "
                  >
                    K
                  </kbd>
                </span>
              }
            />
          </nav>

          {/* =================================================
              AUTHOR
          ================================================= */}

          <SectionLabel collapsed={collapsed}>Author</SectionLabel>

          <nav className="space-y-1">
            <SidebarItem
              icon={PenLine}
              label="Write"
              {...item("/editor/new")}
            />

            <SidebarItem
              icon={FileText}
              label="Drafts"
              {...item("/dashboard")}
            />
          </nav>

          {/* =================================================
              COMMUNITY
          ================================================= */}

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

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          ref={footerRef}
          className="
            relative
            shrink-0
            space-y-1
            border-t
            border-white/[0.06]
            p-3
          "
        >
          {status === "authenticated" ? (
            <>
              {/* =================================================
                  PROFILE POPUP
              ================================================= */}

              {menuOpen && (
                <div
                  role="menu"
                  className={`
                    absolute
                    z-50
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-[#1a1d23]
                    p-1.5
                    text-white
                    shadow-2xl
                    shadow-black/50
                    animate-in
                    fade-in
                    zoom-in-95
                    duration-150
                    ${
                      collapsed
                        ? "bottom-3 left-full ml-2 w-64"
                        : "bottom-full left-3 right-3 mb-2"
                    }
                  `}
                >
                  {/* =================================================
                      USER INFO
                  ================================================= */}

                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-2.5
                      px-2.5
                      py-2.5
                    "
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage
                        src={user?.avatarUrl || ""}
                        alt={user?.name}
                      />

                      <AvatarFallback className="bg-zinc-800 text-xs">
                        {initial}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {user?.name}
                      </p>

                      <p className="truncate text-[11px] text-zinc-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile */}

                  <MenuItem
                    icon={User}
                    label="Profile"
                    onClick={() => go(`/profile/${user?._id}`)}
                  />

                  {/* Bookmarks */}

                  <MenuItem
                    icon={Bookmark}
                    label="Bookmarks"
                    onClick={() => go("/bookmarks")}
                  />

                  {/* Settings */}

                  <MenuItem
                    icon={Settings}
                    label="Settings"
                    onClick={() => go("/settings")}
                  />

                  {/* Divider */}

                  <div className="my-1.5 h-px bg-white/[0.08]" />

                  {/* Logout */}

                  <MenuItem
                    icon={LogOut}
                    label="Sign out"
                    danger
                    onClick={handleLogout}
                  />
                </div>
              )}

              {/* =================================================
                  PROFILE TRIGGER
              ================================================= */}

              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title={collapsed ? user?.name : undefined}
                onClick={() => setMenuOpen((open) => !open)}
                className={`
                  flex
                  w-full
                  items-center
                  rounded-lg
                  text-sm
                  text-zinc-200
                  outline-none
                  transition
                  hover:bg-white/[0.05]
                  ${menuOpen ? "bg-white/[0.05]" : ""}
                  ${collapsed ? "h-10 justify-center" : "gap-3 px-3 py-2"}
                `}
              >
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />

                  <AvatarFallback
                    className="
                      bg-zinc-800
                      text-[10px]
                      text-white
                    "
                  >
                    {initial}
                  </AvatarFallback>
                </Avatar>

                {!collapsed && (
                  <>
                    <span
                      className="
                        flex-1
                        truncate
                        text-left
                      "
                    >
                      {user?.name}
                    </span>

                    <ChevronsUpDown
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-zinc-500
                      "
                    />
                  </>
                )}
              </button>
            </>
          ) : (
            /* =================================================
               GUEST
            ================================================= */

            <SidebarItem
              icon={User}
              label="Login"
              to="/login"
              collapsed={collapsed}
              onClick={onNavigate}
            />
          )}

          {/* =================================================
              MORE
          ================================================= */}

          <SidebarItem
            icon={Grip}
            label="More"
            collapsed={collapsed}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* =======================================================
          SEARCH MODAL
      ======================================================= */}

      {searchOpen && <SearchModal onClose={handleSearchClose} />}
    </>
  );
};

export default LeftSidebar;
