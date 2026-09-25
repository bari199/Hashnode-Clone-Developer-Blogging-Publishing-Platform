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

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchPosts = async (searchTerm = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/posts", {
        params: searchTerm ? { search: searchTerm } : {},
      });

      setPosts(response.data.posts || response.data || []);
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    fetchPosts(search.trim());
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-white">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px]">
        {/* MAIN CONTENT */}
        <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
          {/* Hero */}
          <section className="relative mb-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] via-white/[0.025] to-transparent p-7 sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl" />

            <div className="relative max-w-2xl">
              <Badge
                variant="secondary"
                className="mb-5 border border-white/10 bg-white/[0.06] text-zinc-300"
              >
                <Sparkles className="mr-1.5 h-3 w-3" />
                Developer Community
              </Badge>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Write to think.
                <br />
                <span className="text-zinc-500">Publish to connect.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Share what you're learning, building and discovering. Publish
                technical articles and connect with developers around the world.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button className="bg-white text-black hover:bg-zinc-200">
                  Start writing
                  <PenLine className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.08]"
                >
                  Explore posts
                </Button>
              </div>
            </div>
          </section>

          {/* Feature Cards */}
          <section className="mb-10 grid gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
            <FeatureCard
              icon={<Search />}
              title="You got found"
              description="Discover useful articles and ideas from developers around the world."
            />

            <FeatureCard
              icon={<Code2 />}
              title="Built for developers"
              description="Technical writing, tutorials, opinions and engineering stories."
            />

            <FeatureCard
              icon={<Users />}
              title="Build your audience"
              description="Connect with readers and developers who share your interests."
            />
          </section>

          {/* Feed Heading */}
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-zinc-400" />

                <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Latest & Popular
                </span>
              </div>

              <h2 className="text-xl font-semibold tracking-tight">
                Discover what's happening
              </h2>
            </div>

            <Button
              variant="ghost"
              className="hidden text-zinc-400 hover:bg-white/[0.05] hover:text-white sm:flex"
            >
              View all
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6 flex gap-2 md:hidden">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search posts..."
              className="border-white/10 bg-white/[0.04]"
            />

            <Button
              type="submit"
              size="icon"
              className="shrink-0 bg-white text-black hover:bg-zinc-200"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <PostSkeleton key={item} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <Card className="border-red-500/20 bg-red-500/[0.04]">
              <CardContent className="py-12 text-center">
                <MessageSquare className="mx-auto mb-4 h-6 w-6 text-red-400" />

                <h3 className="font-semibold text-red-300">
                  Unable to load posts
                </h3>

                <p className="mt-2 text-sm text-zinc-500">{error}</p>

                <Button
                  onClick={() => fetchPosts(search.trim())}
                  variant="outline"
                  className="mt-5 border-white/10"
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Posts */}
          {!loading && !error && posts.length > 0 && <PostList posts={posts} />}

          {/* Empty */}
          {!loading && !error && posts.length === 0 && (
            <Card className="border-white/[0.08] bg-white/[0.02]">
              <CardContent className="py-16 text-center">
                <Search className="mx-auto mb-4 h-8 w-8 text-zinc-600" />

                <h3 className="font-semibold">No posts found</h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Try searching for another topic or keyword.
                </p>
              </CardContent>
            </Card>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Feed;
