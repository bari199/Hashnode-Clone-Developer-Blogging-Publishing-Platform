import { useEffect, useState } from "react";
import { MoreHorizontal, ChevronRight } from "lucide-react";

import api from "../../api/axios.js";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RightSidebar = () => {
  // =====================================
  // State
  // =====================================

  const [trendingTags, setTrendingTags] = useState([]);
  const [authors, setAuthors] = useState([]);

  const [tagsLoading, setTagsLoading] = useState(true);
  const [authorsLoading, setAuthorsLoading] = useState(true);

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
          .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
          .slice(0, 9);

        setTrendingTags(sortedTags);

        // =====================================
        // Trending Authors
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
  // Helper: Generate Initials
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

  return (
    <aside className="hidden border-l border-white/[0.06] xl:block">
      <div className="sticky top-16 space-y-5 p-5">
        {/* =====================================================
            TRENDING TAGS
        ===================================================== */}

        <Card className="border-white/[0.07] bg-white/[0.025]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-amber-50">
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
                  className="flex items-center justify-between px-2 py-2.5"
                >
                  <div className="h-3 w-28 animate-pulse rounded bg-white/[0.06]" />

                  <div className="h-3 w-6 animate-pulse rounded bg-white/[0.06]" />
                </div>
              ))}

            {/* Tags */}
            {!tagsLoading &&
              trendingTags.map((tag) => (
                <div
                  key={tag._id}
                  className="group flex cursor-pointer items-center justify-between rounded-lg px-2 py-2.5 transition hover:bg-white/[0.05]"
                >
                  <span className="truncate text-xs text-zinc-400 transition group-hover:text-white">
                    #{tag.name}
                  </span>

                  <span className="ml-2 shrink-0 text-[10px] text-zinc-600">
                    {tag.postCount}
                  </span>
                </div>
              ))}

            {/* Empty State */}
            {!tagsLoading && trendingTags.length === 0 && (
              <p className="px-2 py-3 text-xs text-zinc-600">
                No trending tags yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* =====================================================
            THE FOREWORD
        ===================================================== */}

        <Card className="border-white/[0.07] bg-white/[0.025]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-50">
              The foreword
            </CardTitle>

            <p className="text-[11px] text-zinc-600">
              CoderBari&apos;s official blog
            </p>
          </CardHeader>

          <CardContent>
            {/* Visual */}
            <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-black/30">
              <div className="flex h-20 items-center justify-center gap-2 px-3">
                <div className="h-8 w-8 rounded bg-white/[0.05]" />

                <div className="h-8 w-16 rounded bg-white/[0.05]" />

                <div className="h-8 w-8 rounded bg-white/[0.05]" />
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-xs font-medium leading-5 text-zinc-300">
              Engineering, AI and modern web development.
            </p>

            <p className="mt-1 text-[11px] leading-5 text-zinc-600">
              Practical guides and thoughts for developers.
            </p>

            {/* View Posts */}
            <Button
              variant="link"
              className="mt-2 h-auto px-0 text-xs text-zinc-300"
            >
              View all posts
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        {/* =====================================================
            AUTHORS WORTH FOLLOWING
        ===================================================== */}

        <Card className="border-white/[0.07] bg-white/[0.025]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-amber-50">
              Authors worth following
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Loading */}
            {authorsLoading &&
              [1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  {/* Avatar Skeleton */}
                  <div className="h-8 w-8 animate-pulse rounded-full bg-white/[0.06]" />

                  {/* Text Skeleton */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />

                    <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.06]" />
                  </div>
                </div>
              ))}

            {/* Authors */}
            {!authorsLoading &&
              authors.map((author) => (
                <div
                  key={author._id}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  {/* Avatar */}
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage
                      src={author.avatarUrl || ""}
                      alt={author.name || "Author"}
                    />

                    <AvatarFallback className="bg-zinc-800 text-[10px] text-zinc-300">
                      {getInitials(author.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Author Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-300 transition group-hover:text-white">
                      {author.name}
                    </p>
                    {author.bio && (
                      <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                        {author.bio}
                      </p>
                    )}
                    <p className="text-[10px] text-zinc-600">
                      {author.postCount}{" "}
                      {author.postCount === 1 ? "post" : "posts"} this month
                    </p>
                  </div>
                </div>
              ))}

            {/* Empty State */}
            {!authorsLoading && authors.length === 0 && (
              <p className="py-2 text-xs text-zinc-600">
                No active authors this month.
              </p>
            )}
          </CardContent>
        </Card>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div className="px-2 py-3">
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-[10px] text-zinc-600">
            <span className="cursor-pointer transition hover:text-zinc-300">
              About
            </span>

            <span className="cursor-pointer transition hover:text-zinc-300">
              Terms
            </span>

            <span className="cursor-pointer transition hover:text-zinc-300">
              Privacy
            </span>

            <span className="cursor-pointer transition hover:text-zinc-300">
              Sitemap
            </span>
          </div>

          <p className="mt-4 text-[10px] text-zinc-700">© 2026 CoderBari</p>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
