import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/posts/my/posts");
      setPosts(response.data.posts);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load your posts.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMyPosts();
  }, []);
  const handleDelete = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmed) {
      return;
    }
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete post.");
    }
  };
  /* Loading */ if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#08090b] text-gray-900 dark:text-white">
        {" "}
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          {" "}
          <div className="text-center">
            {" "}
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black/20 dark:border-white/20 border-t-gray-900 dark:border-t-white" />{" "}
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {" "}
              Loading dashboard...{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </main>
    );
  }
  /* Error */ if (error) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#08090b] px-6 py-10 text-gray-900 dark:text-white">
        {" "}
        <div className="mx-auto max-w-6xl">
          {" "}
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-600 dark:text-red-300">
            {" "}
            {error}{" "}
          </div>{" "}
        </div>{" "}
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-white dark:bg-[#08090b] text-gray-900 dark:text-white">
      {" "}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {" "}
        {/* Header */}{" "}
        <div className="flex flex-col justify-between gap-6 border-b border-black/10 dark:border-white/[0.08] pb-8 sm:flex-row sm:items-end">
          {" "}
          <div>
            {" "}
            <p className="mb-2 text-sm font-medium text-zinc-500">
              {" "}
              Dashboard{" "}
            </p>{" "}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {" "}
              Welcome back{user?.name ? `, ${user.name}` : ""}{" "}
            </h1>{" "}
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {" "}
              Manage your posts and continue sharing your ideas.{" "}
            </p>{" "}
          </div>{" "}
          <div className="flex flex-col gap-3 sm:flex-row">
            {" "}
            <Button
              asChild
              variant="outline"
              className="border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-gray-900 dark:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
            >
              {" "}
              <Link to={`/profile/${user?._id}`}> View Profile </Link>{" "}
            </Button>{" "}
            <Button
              asChild
              className="bg-gray-900 dark:bg-white font-semibold text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              {" "}
              <Link to="/editor/new"> + New Post </Link>{" "}
            </Button>{" "}
          </div>{" "}
        </div>{" "}
        {/* Stats */}{" "}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {" "}
          <Card className="border-black/10 dark:border-white/[0.08] bg-gray-50 dark:bg-[#0d0f12] text-gray-900 dark:text-white">
            {" "}
            <CardContent className="p-5">
              {" "}
              <p className="text-sm text-zinc-500"> Total Posts </p>{" "}
              <p className="mt-2 text-3xl font-bold"> {posts.length} </p>{" "}
            </CardContent>{" "}
          </Card>{" "}
          <Card className="border-black/10 dark:border-white/[0.08] bg-gray-50 dark:bg-[#0d0f12] text-gray-900 dark:text-white">
            {" "}
            <CardContent className="p-5">
              {" "}
              <p className="text-sm text-zinc-500"> Published </p>{" "}
              <p className="mt-2 text-3xl font-bold">
                {" "}
                {
                  posts.filter((post) => post.status === "published").length
                }{" "}
              </p>{" "}
            </CardContent>{" "}
          </Card>{" "}
          <Card className="border-black/10 dark:border-white/[0.08] bg-gray-50 dark:bg-[#0d0f12] text-gray-900 dark:text-white">
            {" "}
            <CardContent className="p-5">
              {" "}
              <p className="text-sm text-zinc-500"> Drafts </p>{" "}
              <p className="mt-2 text-3xl font-bold">
                {" "}
                {
                  posts.filter((post) => post.status !== "published").length
                }{" "}
              </p>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
        {/* Posts */}{" "}
        <div className="mt-10">
          {" "}
          <div className="mb-5 flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <h2 className="text-xl font-semibold"> Your Posts </h2>{" "}
              <p className="mt-1 text-sm text-zinc-500">
                {" "}
                Manage your published articles and drafts.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {posts.length === 0 ? (
            <Card className="border-black/10 dark:border-white/[0.08] bg-gray-50 dark:bg-[#0d0f12] text-gray-900 dark:text-white">
              {" "}
              <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                {" "}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black/[0.05] dark:bg-white/[0.05]">
                  {" "}
                  <span className="text-2xl text-zinc-500 dark:text-zinc-400">
                    {" "}
                    +{" "}
                  </span>{" "}
                </div>{" "}
                <h3 className="text-lg font-semibold"> No posts yet </h3>{" "}
                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                  {" "}
                  You haven't created any posts yet. Start writing your first
                  article and share it with the community.{" "}
                </p>{" "}
                <Button
                  asChild
                  className="mt-6 bg-gray-900 dark:bg-white font-semibold text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  {" "}
                  <Link to="/editor/new"> Create your first post </Link>{" "}
                </Button>{" "}
              </CardContent>{" "}
            </Card>
          ) : (
            <div className="space-y-4">
              {" "}
              {posts.map((post) => (
                <Card
                  key={post._id}
                  className="border-black/10 dark:border-white/[0.08] bg-gray-50 dark:bg-[#0d0f12] text-gray-900 dark:text-white transition-colors hover:border-black/[0.14] dark:hover:border-white/[0.14]"
                >
                  {" "}
                  <CardHeader className="pb-4">
                    {" "}
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                      {" "}
                      {/* Post Info */}{" "}
                      <div className="min-w-0">
                        {" "}
                        <CardTitle className="text-lg font-semibold leading-7">
                          {" "}
                          {post.title}{" "}
                        </CardTitle>{" "}
                        <p className="mt-2 text-xs text-zinc-500">
                          {" "}
                          Created{" "}
                          {new Date(post.createdAt).toLocaleDateString()}{" "}
                        </p>{" "}
                        <Badge
                          variant="outline"
                          className={`mt-3 border-0 ${post.status === "published" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"}`}
                        >
                          {" "}
                          {post.status}{" "}
                        </Badge>{" "}
                      </div>{" "}
                      {/* Actions */}{" "}
                      <div className="flex flex-wrap items-center gap-2">
                        {" "}
                        {post.status === "published" && (
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-black/10 dark:border-white/10 bg-transparent text-gray-900 dark:text-white hover:bg-black/[0.08] dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                          >
                            {" "}
                            <Link to={`/post/${post.slug}`}> View </Link>{" "}
                          </Button>
                        )}{" "}
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.03] text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.08] hover:text-gray-900 dark:hover:text-white"
                        >
                          {" "}
                          <Link to={`/editor/${post._id}`}> Edit </Link>{" "}
                        </Button>{" "}
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post._id)}
                        >
                          {" "}
                          Delete{" "}
                        </Button>{" "}
                      </div>{" "}
                    </div>{" "}
                  </CardHeader>{" "}
                </Card>
              ))}{" "}
            </div>
          )}{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
};
export default Dashboard;
