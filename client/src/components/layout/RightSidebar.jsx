import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, ChevronRight, X } from "lucide-react";

import {
  FaGithub,
  FaGlobe,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

import api from "../../api/axios.js";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/* =========================================================
   AUTHOR POPUP
========================================================= */

const AuthorPopup = ({ author, loading, position, onClose }) => {
  const popupRef = useRef(null);

  // =====================================
  // Get Initials
  // =====================================

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =====================================
  // Close Outside Click
  // =====================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  // =====================================
  // Close Escape
  // =====================================

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

  if (!position || !author) {
    return null;
  }

  // =====================================
  // Responsive Popup Position
  // =====================================

  const viewportPadding = 12;

  const popupWidth = Math.min(290, window.innerWidth - viewportPadding * 2);

  let left = position.left;
  let top = position.top;

  // Keep popup inside horizontal viewport

  if (left + popupWidth > window.innerWidth - viewportPadding) {
    left = window.innerWidth - popupWidth - viewportPadding;
  }

  if (left < viewportPadding) {
    left = viewportPadding;
  }

  // Estimate popup height

  const estimatedPopupHeight = 300;

  // Open above if insufficient bottom space

  if (top + estimatedPopupHeight > window.innerHeight - viewportPadding) {
    top = Math.max(viewportPadding, position.top - estimatedPopupHeight - 10);
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div
      ref={popupRef}
      className="
        fixed
        z-[9999]
        max-w-[calc(100vw-24px)]
        overflow-hidden
        rounded-xl
        border
        border-black/10 dark:border-white/[0.08]
        bg-white dark:bg-[#1b1d21]
        p-4
        shadow-2xl
        shadow-black/60
      "
      style={{
        width: `${popupWidth}px`,
        left: `${left}px`,
        top: `${top}px`,
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {/* =====================================
          Close
      ===================================== */}

      <button
        type="button"
        onClick={onClose}
        className="
          absolute
          right-2
          top-2
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-md
          text-zinc-600
          transition
          hover:bg-black/[0.06] dark:hover:bg-white/[0.06]
          hover:text-zinc-700 dark:hover:text-zinc-300
        "
        aria-label="Close"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* =====================================
          Loading
      ===================================== */}

      {loading ? (
        <div className="py-8 text-center">
          <div
            className="
              mx-auto
              mb-3
              h-5
              w-5
              animate-spin
              rounded-full
              border-2
              border-zinc-300 dark:border-zinc-700
              border-t-zinc-600 dark:border-t-zinc-300
            "
          />

          <p className="text-xs text-zinc-500">Loading profile...</p>
        </div>
      ) : (
        <>
          {/* =====================================
              User
          ===================================== */}

          <div className="flex items-center gap-3 pr-5">
            <Avatar className="h-11 w-11 shrink-0 border border-black/20 dark:border-white/20 sm:h-12 sm:w-12">
              <AvatarImage
                src={author?.avatarUrl || ""}
                alt={author?.name || "Author"}
              />

              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700 text-sm font-semibold text-gray-900 dark:text-white">
                {getInitials(author?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {author?.name || "Unknown author"}
              </p>

              {author?.email && (
                <p className="truncate text-xs text-zinc-500">{author.email}</p>
              )}

              {author?.bio && (
                <p
                  className="
                    mt-1
                    line-clamp-2
                    text-[11px]
                    leading-4
                    text-zinc-500
                  "
                >
                  {author.bio}
                </p>
              )}
            </div>
          </div>

          {/* =====================================
              Location + Social
          ===================================== */}

          <div className="mt-4 flex min-h-5 items-center gap-3">
            {author?.location && (
              <div className="flex min-w-0 items-center gap-1.5 text-zinc-500">
                <FaMapMarkerAlt className="h-3.5 w-3.5 shrink-0" />

                <span className="truncate text-xs">{author.location}</span>
              </div>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-3">
              {/* X */}

              {author?.socialLinks?.x && (
                <a
                  href={author.socialLinks.x}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X"
                  onClick={(event) => event.stopPropagation()}
                  className="
                    text-zinc-500
                    transition
                    hover:text-gray-900 dark:hover:text-white
                  "
                >
                  <FaXTwitter className="h-4 w-4" />
                </a>
              )}

              {/* GitHub */}

              {author?.socialLinks?.github && (
                <a
                  href={author.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  onClick={(event) => event.stopPropagation()}
                  className="
                    text-zinc-500
                    transition
                    hover:text-gray-900 dark:hover:text-white
                  "
                >
                  <FaGithub className="h-4 w-4" />
                </a>
              )}

              {/* LinkedIn */}

              {author?.socialLinks?.linkedin && (
                <a
                  href={author.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  onClick={(event) => event.stopPropagation()}
                  className="
                    text-zinc-500
                    transition
                    hover:text-gray-900 dark:hover:text-white
                  "
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </a>
              )}

              {/* Website */}

              {author?.socialLinks?.website && (
                <a
                  href={author.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Website"
                  onClick={(event) => event.stopPropagation()}
                  className="
                    text-zinc-500
                    transition
                    hover:text-gray-900 dark:hover:text-white
                  "
                >
                  <FaGlobe className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* =====================================
              View Profile
          ===================================== */}

          {author?._id && (
            <a
              href={`/profile/${author._id}`}
              onClick={onClose}
              className="
                mt-4
                flex
                h-8
                w-full
                items-center
                justify-center
                gap-2
                rounded-md
                bg-gray-900 dark:bg-[#e4e5e7]
                text-sm
                font-medium
                text-white dark:text-[#16181c]
                transition
                hover:bg-gray-800 dark:hover:bg-white
              "
            >
              <FaUser className="h-3.5 w-3.5" />
              View full profile
            </a>
          )}
        </>
      )}
    </div>
  );
};

/* =========================================================
   RIGHT SIDEBAR
========================================================= */

const RightSidebar = () => {
  // =====================================
  // Sidebar Data
  // =====================================

  const [trendingTags, setTrendingTags] = useState([]);

  const [authors, setAuthors] = useState([]);

  const [tagsLoading, setTagsLoading] = useState(true);

  const [authorsLoading, setAuthorsLoading] = useState(true);

  // =====================================
  // Popup State
  // =====================================

  const [activePopupKey, setActivePopupKey] = useState(null);

  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [authorLoading, setAuthorLoading] = useState(false);

  const [popupPosition, setPopupPosition] = useState(null);

  // =====================================
  // Fetch Sidebar Data
  // =====================================

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        setTagsLoading(true);
        setAuthorsLoading(true);

        const [tagsResponse, authorsResponse] = await Promise.all([
          api.get("/tags"),
          api.get("/users/authors/trending"),
        ]);

        // =====================================
        // Trending Tags
        // =====================================

        const tags = tagsResponse?.data?.tags || [];

        const sortedTags = [...tags]
          .sort((a, b) => (b?.postCount || 0) - (a?.postCount || 0))
          .slice(0, 9);

        setTrendingTags(sortedTags);

        // =====================================
        // Authors
        // =====================================

        const authorsData = authorsResponse?.data?.authors || [];

        setAuthors(authorsData);
      } catch (error) {
        console.error("Failed to load right sidebar data:", error);

        setTrendingTags([]);
        setAuthors([]);
      } finally {
        setTagsLoading(false);
        setAuthorsLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  // =====================================
  // Initials
  // =====================================

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =====================================
  // Close Popup
  // =====================================

  const closeAuthorPopup = () => {
    setActivePopupKey(null);
    setSelectedAuthor(null);
    setAuthorLoading(false);
    setPopupPosition(null);
  };

  // =====================================
  // Open Popup
  // =====================================

  const handleAuthorOpen = async (author, popupKey, element) => {
    if (!author?._id) {
      return;
    }

    // Same avatar -> close

    if (activePopupKey === popupKey) {
      closeAuthorPopup();
      return;
    }

    const rect = element.getBoundingClientRect();

    const popupWidth = Math.min(290, window.innerWidth - 24);

    setPopupPosition({
      left: rect.right - Math.min(popupWidth, rect.width + 278),

      top: rect.bottom + 10,
    });

    setActivePopupKey(popupKey);

    // Show existing data immediately

    setSelectedAuthor({
      _id: author._id,
      name: author.name,
      avatarUrl: author.avatarUrl,
      bio: author.bio,
      email: author.email,
      location: author.location,
      socialLinks: author.socialLinks,
    });

    setAuthorLoading(true);

    try {
      const response = await api.get(`/users/${author._id}`);

      const fetchedUser = response?.data?.user || null;

      if (fetchedUser) {
        setSelectedAuthor(fetchedUser);
      }
    } catch (error) {
      console.error("Failed to load author profile:", error);
    } finally {
      setAuthorLoading(false);
    }
  };

  // =====================================
  // Close On Resize
  // =====================================

  useEffect(() => {
    if (!activePopupKey) {
      return;
    }

    const handleResize = () => {
      closeAuthorPopup();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activePopupKey]);

  // =====================================
  // Render
  // =====================================

  return (
    <aside
      className="
        block
        w-full
        min-w-0
        border-t
        border-black/10 dark:border-white/[0.06]
        xl:border-l
        xl:border-t-0
      "
    >
      <div
        className="
          w-full
          min-w-0
          space-y-5
          p-3
          sm:p-4
          md:p-5
          xl:sticky
          xl:top-16
        "
      >
        {/* =================================================
            TRENDING TAGS
        ================================================= */}

        <Card className="w-full min-w-0 border-black/10 dark:border-white/[0.07] bg-gray-50 dark:bg-white/[0.025]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-amber-50">
                Trending tags
              </CardTitle>

              <MoreHorizontal className="h-4 w-4 text-zinc-600" />
            </div>
          </CardHeader>

          <CardContent className="space-y-1">
            {/* Loading */}

            {tagsLoading &&
              [1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="
                      flex
                      items-center
                      justify-between
                      px-2
                      py-2.5
                    "
                >
                  <div className="h-3.5 w-28 animate-pulse rounded bg-black/[0.06] dark:bg-white/[0.06]" />

                  <div className="h-3.5 w-6 animate-pulse rounded bg-black/[0.06] dark:bg-white/[0.06]" />
                </div>
              ))}

            {/* Tags */}

            {!tagsLoading &&
              trendingTags.map((tag) => (
                <div
                  key={tag._id}
                  className="
                      group
                      flex
                      min-w-0
                      items-center
                      justify-between
                      rounded-lg
                      px-2
                      py-2.5
                      transition
                      hover:bg-black/[0.05] dark:hover:bg-white/[0.05]
                    "
                >
                  <span className="min-w-0 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400 transition group-hover:text-gray-900 dark:group-hover:text-white">
                    #{tag.name}
                  </span>

                  <div className="ml-2 flex shrink-0 items-center">
                    {/* Author avatars */}

                    {tag.authors?.length > 0 && (
                      <div className="flex -space-x-2">
                        {tag.authors.slice(0, 3).map((author) => {
                          const popupKey = `tag-${tag._id}-author-${author._id}`;

                          const isActive = activePopupKey === popupKey;

                          return (
                            <div key={author._id}>
                              <button
                                type="button"
                                onMouseEnter={(event) =>
                                  handleAuthorOpen(
                                    author,
                                    popupKey,
                                    event.currentTarget,
                                  )
                                }
                                onClick={(event) => {
                                  event.stopPropagation();

                                  handleAuthorOpen(
                                    author,
                                    popupKey,
                                    event.currentTarget,
                                  );
                                }}
                                className="relative rounded-full outline-none"
                                aria-label={`View ${
                                  author.name || "author"
                                } profile`}
                              >
                                <Avatar
                                  className={`
                                          h-6
                                          w-6
                                          border-2
                                          border-white dark:border-[#16171c]
                                          transition
                                          ${
                                            isActive
                                              ? "scale-110 ring-2 ring-black/20 dark:ring-white/20"
                                              : "hover:scale-110"
                                          }
                                        `}
                                >
                                  <AvatarImage
                                    src={author.avatarUrl || ""}
                                    alt={author.name || "Author"}
                                  />

                                  <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700 text-[8px] font-medium text-zinc-800 dark:text-zinc-200">
                                    {getInitials(author.name)}
                                  </AvatarFallback>
                                </Avatar>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <span className="ml-2 text-[11px] text-zinc-500">
                      {tag.postCount || 0}
                    </span>
                  </div>
                </div>
              ))}

            {/* Empty */}

            {!tagsLoading && trendingTags.length === 0 && (
              <p className="px-2 py-3 text-xs text-zinc-600">
                No trending tags yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* =================================================
            THE FOREWORD
        ================================================= */}

        <Card className="w-full min-w-0 border-black/10 dark:border-white/[0.07] bg-gray-50 dark:bg-white/[0.025]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-amber-50">
              The foreword
            </CardTitle>

            <p className="text-[11px] text-zinc-600">
              CoderBari&apos;s official blog
            </p>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-lg border border-black/10 dark:border-white/[0.06] bg-gray-100 dark:bg-black/30">
              <div className="flex h-20 items-center justify-center gap-2 px-3">
                <div className="h-8 w-8 rounded bg-black/[0.05] dark:bg-white/[0.05]" />

                <div className="h-8 w-16 rounded bg-black/[0.05] dark:bg-white/[0.05]" />

                <div className="h-8 w-8 rounded bg-black/[0.05] dark:bg-white/[0.05]" />
              </div>
            </div>

            <p className="mt-3 text-xs font-medium leading-5 text-zinc-700 dark:text-zinc-300">
              Engineering, AI and modern web development.
            </p>

            <p className="mt-1 text-[11px] leading-5 text-zinc-600">
              Practical guides and thoughts for developers.
            </p>

            <Button
              variant="link"
              className="mt-2 h-auto px-0 text-xs text-zinc-700 dark:text-zinc-300"
            >
              View all posts
              <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>

        {/* =================================================
            AUTHORS WORTH FOLLOWING
        ================================================= */}

        <Card className="w-full min-w-0 border-black/10 dark:border-white/[0.07] bg-gray-50 dark:bg-white/[0.025]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-amber-50">
              Authors worth following
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Loading */}

            {authorsLoading &&
              [1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-black/[0.06] dark:bg-white/[0.06]" />

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3 w-24 animate-pulse rounded bg-black/[0.06] dark:bg-white/[0.06]" />

                    <div className="h-2.5 w-20 animate-pulse rounded bg-black/[0.06] dark:bg-white/[0.06]" />
                  </div>
                </div>
              ))}

            {/* Authors */}

            {!authorsLoading &&
              authors.map((author) => {
                const popupKey = `authors-author-${author._id}`;

                const isActive = activePopupKey === popupKey;

                return (
                  <div
                    key={author._id}
                    className="
                        group
                        relative
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                  >
                    {/* Avatar */}

                    <button
                      type="button"
                      onMouseEnter={(event) =>
                        handleAuthorOpen(author, popupKey, event.currentTarget)
                      }
                      onClick={(event) => {
                        event.stopPropagation();

                        handleAuthorOpen(author, popupKey, event.currentTarget);
                      }}
                      className="shrink-0 rounded-full outline-none"
                      aria-label={`View ${author.name || "author"} profile`}
                    >
                      <Avatar
                        className={`
                            h-9
                            w-9
                            shrink-0
                            transition
                            ${
                              isActive
                                ? "scale-105 ring-2 ring-black/20 dark:ring-white/20"
                                : "hover:scale-105"
                            }
                          `}
                      >
                        <AvatarImage
                          src={author.avatarUrl || ""}
                          alt={author.name || "Author"}
                        />

                        <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
                          {getInitials(author.name)}
                        </AvatarFallback>
                      </Avatar>
                    </button>

                    {/* Author Info */}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition group-hover:text-gray-900 dark:group-hover:text-white">
                        {author.name}
                      </p>

                      {author.bio && (
                        <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                          {author.bio}
                        </p>
                      )}

                      <p className="text-[11px] text-zinc-600">
                        {author.postCount || 0}{" "}
                        {author.postCount === 1 ? "post" : "posts"} this month
                      </p>
                    </div>
                  </div>
                );
              })}

            {/* Empty */}

            {!authorsLoading && authors.length === 0 && (
              <p className="py-2 text-xs text-zinc-600">
                No active authors this month.
              </p>
            )}
          </CardContent>
        </Card>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="px-2 py-3">
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-zinc-600">
            <span className="cursor-pointer transition hover:text-zinc-700 dark:hover:text-zinc-300">
              About
            </span>

            <span className="cursor-pointer transition hover:text-zinc-700 dark:hover:text-zinc-300">
              Terms
            </span>

            <span className="cursor-pointer transition hover:text-zinc-700 dark:hover:text-zinc-300">
              Privacy
            </span>

            <span className="cursor-pointer transition hover:text-zinc-700 dark:hover:text-zinc-300">
              Sitemap
            </span>
          </div>

          <p className="mt-4 text-[11px] text-zinc-700">© 2026 CoderBari</p>
        </div>
      </div>

      {/* =================================================
          GLOBAL AUTHOR POPUP
      ================================================= */}

      {activePopupKey && selectedAuthor && popupPosition && (
        <AuthorPopup
          author={selectedAuthor}
          loading={authorLoading}
          position={popupPosition}
          onClose={closeAuthorPopup}
        />
      )}
    </aside>
  );
};

export default RightSidebar;
