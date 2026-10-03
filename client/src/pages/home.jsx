import { useEffect, useState } from "react";

import api from "../api/axios.js";

import PostList from "../components/post/PostList.jsx";
import RightSidebar from "../components/layout/RightSidebar.jsx";
import FeatureCard from "../components/feed/FeatureCard.jsx";
import PostSkeleton from "../components/feed/PostSkeleton.jsx";

import {
  Search,
  PenLine,
  Sparkles,
  TrendingUp,
  Code2,
  Users,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const INITIAL_POST_COUNT = 6;

const home = () => {
  // =====================================
  // State
  // =====================================

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  // =====================================
  // Visible Posts
  // =====================================

  const visiblePosts = showAll ? posts : posts.slice(0, INITIAL_POST_COUNT);

  const hasMore = posts.length > INITIAL_POST_COUNT;

  // =====================================
  // Fetch Posts
  // =====================================

  const fetchPosts = async (searchTerm = "") => {
    try {
      setLoading(true);
      setError("");
      setShowAll(false);

      const response = await api.get("/posts", {
        params: searchTerm
          ? {
              search: searchTerm,
            }
          : {},
      });

      setPosts(response?.data?.posts || response?.data || []);
    } catch (err) {
      console.error("Fetch posts error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while loading posts.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Initial Load
  // =====================================

  useEffect(() => {
    fetchPosts();
  }, []);

  // =====================================
  // Search
  // =====================================

  const handleSearch = (event) => {
    event.preventDefault();

    fetchPosts(search.trim());
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-gray-900 transition-colors duration-200 dark:bg-[#08090b] dark:text-white">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-[1500px]
          grid-cols-1
          xl:grid-cols-[minmax(0,1fr)_280px]
        "
      >
        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <main
          className="
            min-w-0
            w-full
            px-3
            py-5
            sm:px-4
            sm:py-6
            md:px-6
            md:py-8
            lg:px-8
            xl:px-8
            2xl:px-10
          "
        >
          {/* =====================================================
              HERO
          ===================================================== */}

          <section
            className="
              relative
              mb-8
              overflow-hidden
              rounded-xl
              border
              border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:border-white/[0.08] dark:from-white/[0.07] dark:via-white/[0.025] dark:to-transparent
              p-5
              sm:mb-10
              sm:rounded-2xl
              sm:p-7
              md:p-8
              lg:p-10
            "
          >
            {/* Background Glow */}

            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-gray-200/60 blur-3xl dark:bg-white/[0.04]
                sm:-right-24
                sm:-top-24
                sm:h-64
                sm:w-64
              "
            />

            {/* Hero Content */}

            <div className="relative min-w-0 max-w-2xl">
              {/* Badge */}

              <Badge
                variant="secondary"
                className="
                  mb-4
                  max-w-full
                  border
                  border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/[0.06]
                  px-2.5
                  py-1
                  text-[11px]
                  text-gray-900 sm:mb-5 dark:text-white
                  sm:text-xs
                "
              >
                <Sparkles className="mr-1.5 h-3 w-3 shrink-0" />

                <span className="truncate">Developer Community</span>
              </Badge>

              {/* Heading */}

              <h1
                className="
                  max-w-full
                  text-[1.8rem]
                  font-bold
                  leading-[1.12]
                  tracking-tight
                  text-foreground
                  sm:text-4xl
                  md:text-5xl
                "
              >
                Write to think.
                <br />
                <span className="text-gray-500 dark:text-gray-400">
                  Publish to connect.
                </span>
              </h1>

              {/* Description */}

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-gray-500 dark:text-gray-400
                  sm:mt-5
                  sm:text-base
                "
              >
                Share what you're learning, building and discovering. Publish
                technical articles and connect with developers around the world.
              </p>

              {/* Buttons */}

              <div
                className="
                  mt-6
                  flex
                  w-full
                  flex-col
                  gap-2.5
                  sm:mt-7
                  sm:flex-row
                  sm:flex-wrap
                  sm:gap-3
                "
              >
                <Button
                  className="
                    w-full
                    bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200
                    sm:w-auto
                  "
                >
                  Start writing
                  <PenLine className="ml-2 h-4 w-4 shrink-0" />
                </Button>

                <Button
                  variant="outline"
                  className="
                    w-full
                    border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.08]
                    sm:w-auto
                  "
                >
                  Explore posts
                </Button>
              </div>
            </div>
          </section>

          {/* =====================================================
              FEATURE CARDS
          ===================================================== */}

          <section
            className="
    mb-8
    grid
    min-w-0
    grid-cols-1
    gap-px
    overflow-hidden
    rounded-xl
    border
    border-gray-200 bg-gray-200 dark:border-white/[0.07] dark:bg-white/[0.07]
    sm:mb-10
    sm:grid-cols-3
  "
          >
            <div className="min-w-0 bg-white dark:bg-[#111214]">
              <FeatureCard
                icon={<Search />}
                title="You got found"
                description="Discover useful articles and ideas from developers around the world."
              />
            </div>

            <div className="min-w-0 bg-white dark:bg-[#111214]">
              <FeatureCard
                icon={<Code2 />}
                title="Built for developers"
                description="Technical writing, tutorials, opinions and engineering stories."
              />
            </div>

            <div className="min-w-0 bg-white dark:bg-[#111214]">
              <FeatureCard
                icon={<Users />}
                title="Build your audience"
                description="Connect with readers and developers who share your interests."
              />
            </div>
          </section>
          {/* =====================================================
              FEED HEADING
          ===================================================== */}

          <div
            className="
              mb-5
              flex
              min-w-0
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            {/* Heading */}

            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />

                <span
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-gray-500 dark:text-gray-400
                    sm:text-xs
                    sm:tracking-widest
                  "
                >
                  Latest & Popular
                </span>
              </div>

              <h2
                className="
                  break-words
                  text-lg
                  font-semibold
                  leading-tight
                  tracking-tight
                  sm:text-xl
                "
              >
                Discover what's happening
              </h2>
            </div>

            {/* View All */}

            {hasMore && (
              <div className="shrink-0">
                <Button
                  variant="ghost"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="
                    h-9
                    w-full
                    justify-center
                    px-3
                    text-gray-500 dark:text-gray-400
                    hover:bg-accent
                    hover:text-foreground
                    sm:w-auto
                  "
                >
                  {showAll ? "Show less" : "View all"}

                  <ArrowUpRight className="ml-2 h-4 w-4 shrink-0" />
                </Button>
              </div>
            )}
          </div>

          {/* =====================================================
              MOBILE SEARCH
          ===================================================== */}

          <form
            onSubmit={handleSearch}
            className="
              mb-6
              flex
              w-full
              min-w-0
              gap-2
              md:hidden
            "
          >
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts..."
              className="
                min-w-0
                flex-1
                border-border
                bg-secondary
              "
            />

            <Button
              type="submit"
              size="icon"
              className="
                h-10
                w-10
                shrink-0
                bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200
              "
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <PostSkeleton key={item} />
              ))}
            </div>
          )}

          {/* =====================================================
              ERROR
          ===================================================== */}

          {!loading && error && (
            <Card
              className="
                w-full
                min-w-0
                border-red-500/20
                bg-red-50 dark:bg-red-500/[0.04]
              "
            >
              <CardContent
                className="
                  px-4
                  py-10
                  text-center
                  sm:px-6
                  sm:py-12
                "
              >
                <MessageSquare
                  className="
                    mx-auto
                    mb-4
                    h-6
                    w-6
                    text-red-400
                  "
                />

                <h3 className="font-semibold text-red-600 dark:text-red-300">
                  Unable to load posts
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    break-words
                    text-sm
                    leading-6
                    text-gray-500 dark:text-gray-400
                  "
                >
                  {error}
                </p>

                <Button
                  onClick={() => fetchPosts(search.trim())}
                  variant="outline"
                  className="
                    mt-5
                    w-full
                    border-border
                    sm:w-auto
                  "
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* =====================================================
              POSTS
          ===================================================== */}

          {!loading && !error && posts.length > 0 && (
            <>
              <div className="min-w-0">
                <PostList posts={visiblePosts} />
              </div>

              {/* View All Posts */}

              {hasMore && !showAll && (
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAll(true)}
                    className="
                        w-full
                        border-border
                        bg-muted
                        text-foreground
                        hover:bg-accent
                        sm:w-auto
                      "
                  >
                    View all {posts.length} posts
                  </Button>
                </div>
              )}
            </>
          )}

          {/* =====================================================
              EMPTY
          ===================================================== */}

          {!loading && !error && posts.length === 0 && (
            <Card
              className="
                  w-full
                  min-w-0
                  border-border
                  bg-muted
                "
            >
              <CardContent
                className="
                    px-4
                    py-12
                    text-center
                    sm:px-6
                    sm:py-16
                  "
              >
                <Search
                  className="
                      mx-auto
                      mb-4
                      h-8
                      w-8
                      text-gray-500 dark:text-gray-400
                    "
                />

                <h3 className="font-semibold">No posts found</h3>

                <p
                  className="
                      mx-auto
                      mt-2
                      max-w-sm
                      text-sm
                      leading-6
                      text-gray-500 dark:text-gray-400
                    "
                >
                  Try searching for another topic or keyword.
                </p>
              </CardContent>
            </Card>
          )}
        </main>

        {/* =====================================================
            RIGHT SIDEBAR
        ===================================================== */}

        <RightSidebar />
      </div>
    </div>
  );
};

export default home;
