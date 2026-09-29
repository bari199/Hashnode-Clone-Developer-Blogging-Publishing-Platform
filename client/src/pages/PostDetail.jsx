import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Check,
  MessageCircle,
  Pencil,
  Reply,
  Trash2,
  X,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import api from "../api/axios.js";
import useComments from "../hooks/useComments.js";
import useBookmark from "../hooks/useBookmark.js";
import useAuth from "../hooks/useAuth.js";

const PostDetail = () => {
  const { slug } = useParams();

  const { user } = useAuth();

  // =========================================================
  // POST STATE
  // =========================================================

  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // NEW COMMENT STATE
  // =========================================================

  const [commentText, setCommentText] = useState("");

  // =========================================================
  // REPLY STATE
  // =========================================================

  const [replyingToId, setReplyingToId] = useState(null);

  const [replyText, setReplyText] = useState("");

  // =========================================================
  // EDIT STATE
  // =========================================================

  const [editingCommentId, setEditingCommentId] = useState(null);

  const [editingCommentText, setEditingCommentText] = useState("");

  // =========================================================
  // COMMENTS HOOK
  // =========================================================

  const {
    comments,
    loading: commentsLoading,
    submitting,
    createComment,
    updateComment,
    deleteComment,
  } = useComments(post?._id);

  const {
    bookmarked,
    bookmarkCount,
    loading: bookmarkLoading,
    toggleBookmark,
  } = useBookmark(post?._id);

  // =========================================================
  // LOAD POST
  // =========================================================

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/posts/${slug}`);

        setPost(response.data.post);
      } catch (error) {
        console.error("Fetch post error:", error);

        setError(error.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // =========================================================
  // COMMENT TREE
  // =========================================================

  const getParentCommentId = (comment) => {
    if (!comment?.parentComment) {
      return null;
    }

    if (typeof comment.parentComment === "object") {
      return comment.parentComment?._id || null;
    }

    return comment.parentComment;
  };

  const rootComments = useMemo(() => {
    return comments.filter((comment) => !getParentCommentId(comment));
  }, [comments]);

  const getReplies = (commentId) => {
    return comments.filter(
      (comment) => getParentCommentId(comment) === commentId,
    );
  };

  // =========================================================
  // CREATE MAIN COMMENT
  // =========================================================

  const handleCreateComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      await createComment(commentText);

      setCommentText("");
    } catch (error) {
      console.error("Comment submit failed:", error);
    }
  };

  // =========================================================
  // START REPLY
  // =========================================================

  const handleStartReply = (commentId) => {
    setReplyingToId(commentId);
    setReplyText("");

    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // =========================================================
  // CANCEL REPLY
  // =========================================================

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyText("");
  };

  // =========================================================
  // CREATE REPLY
  // =========================================================

  const handleCreateReply = async (event, parentCommentId) => {
    event.preventDefault();

    if (!replyText.trim()) {
      return;
    }

    try {
      await createComment(replyText, parentCommentId);

      setReplyText("");
      setReplyingToId(null);
    } catch (error) {
      console.error("Reply submit failed:", error);
    }
  };

  // =========================================================
  // START EDIT
  // =========================================================

  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.content);

    setReplyingToId(null);
    setReplyText("");
  };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // =========================================================
  // UPDATE COMMENT
  // =========================================================

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      return;
    }

    try {
      await updateComment(commentId, editingCommentText);

      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      console.error("Comment update failed:", error);
    }
  };

  // =========================================================
  // DELETE COMMENT
  // =========================================================

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteComment(commentId);

      if (replyingToId === commentId) {
        setReplyingToId(null);
        setReplyText("");
      }

      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditingCommentText("");
      }
    } catch (error) {
      console.error("Comment delete failed:", error);
    }
  };

  // =========================================================
  // COMMENT USER
  // =========================================================

  const getCommentUser = (comment) => {
    return comment?.author || comment?.user;
  };

  // =========================================================
  // COMMENT COMPONENT
  // =========================================================

  const renderComment = (comment, depth = 0) => {
    const commentUser = getCommentUser(comment);

    const isOwner = commentUser?._id?.toString() === user?._id?.toString();

    const isEditing = editingCommentId === comment._id;

    const isReplying = replyingToId === comment._id;

    const replies = getReplies(comment._id);

    return (
      <div
        key={comment._id}
        className={depth > 0 ? "ml-6 border-l border-white/10 pl-4" : ""}
      >
        {/* ================================================= */}
        {/* COMMENT CARD */}
        {/* ================================================= */}

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {/* Avatar */}

              {commentUser?.avatarUrl ? (
                <img
                  src={commentUser.avatarUrl}
                  alt={commentUser.name || "User"}
                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-gray-300">
                  {commentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              {/* User info */}

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {commentUser?.name || "User"}
                </p>

                <p className="text-xs text-gray-500">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : ""}
                </p>
              </div>
            </div>

            {/* ================================================= */}
            {/* OWNER ACTIONS */}
            {/* ================================================= */}

            {isOwner && !isEditing && (
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleStartEdit(comment)}
                  disabled={submitting}
                  className="rounded-md p-2 text-gray-500 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  title="Edit comment"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment._id)}
                  disabled={submitting}
                  className="rounded-md p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* COMMENT CONTENT */}
          {/* ================================================= */}

          {isEditing ? (
            <div className="mt-4">
              <textarea
                value={editingCommentText}
                onChange={(event) => setEditingCommentText(event.target.value)}
                rows={4}
                autoFocus
                className="w-full resize-none rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-white/20"
                placeholder="Edit your comment..."
              />

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={submitting}
                  className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateComment(comment._id)}
                  disabled={submitting || !editingCommentText.trim()}
                  className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" />

                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-300">
              {comment.content}
            </p>
          )}

          {/* ================================================= */}
          {/* COMMENT ACTIONS */}
          {/* ================================================= */}

          {!isEditing && (
            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleStartReply(comment._id)}
                disabled={submitting}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Reply className="h-3.5 w-3.5" />
                Reply
              </button>

              {replies.length > 0 && (
                <span className="text-xs text-gray-600">
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </span>
              )}
            </div>
          )}

          {/* ================================================= */}
          {/* REPLY FORM */}
          {/* ================================================= */}

          {isReplying && (
            <form
              onSubmit={(event) => handleCreateReply(event, comment._id)}
              className="mt-4 border-t border-white/10 pt-4"
            >
              <div className="flex gap-3">
                {/* Current user avatar */}

                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || "You"}
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-gray-300">
                    {user?.name?.charAt(0)?.toUpperCase() || "Y"}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <textarea
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    rows={3}
                    autoFocus
                    placeholder={`Reply to ${
                      commentUser?.name || "this comment"
                    }...`}
                    className="w-full resize-none rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-white/20"
                  />

                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelReply}
                      disabled={submitting}
                      className="rounded-md px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting || !replyText.trim()}
                      className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Replying..." : "Reply"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* ================================================= */}
        {/* NESTED REPLIES */}
        {/* ================================================= */}

        {replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0f]">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-center text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0b0f]">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-center text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // NO POST
  // =========================================================

  if (!post) {
    return null;
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-gray-200">
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* ================================================= */}
        {/* POST CARD */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101014]">
          {/* ================================================= */}
          {/* POST HEADER */}
          {/* ================================================= */}

          <div className="px-6 pt-8 text-center sm:px-8 sm:pt-10">
            <h1 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
              {post.title}
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <div className="relative mt-8 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(120,80,255,0.25),transparent_60%),radial-gradient(circle_at_20%_80%,rgba(0,255,180,0.12),transparent_55%)] bg-[#08080b]" />

            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
            )}

            <div className="relative flex min-h-[280px] flex-col justify-center gap-4 px-8 py-16 sm:min-h-[360px] sm:px-10">
              <span className="inline-block w-fit rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-fuchsia-300">
                {post.tags?.[0]?.name?.toUpperCase() || "INSIGHTS"}
              </span>

              <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                {post.title}
              </h2>
            </div>
          </div>

          {/* ================================================= */}
          {/* AUTHOR */}
          {/* ================================================= */}

          <div className="flex items-center gap-3 px-6 pt-8 sm:px-8">
            {post.author?.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-gray-300">
                {post.author?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            )}

            <p className="font-medium text-gray-200">{post.author?.name}</p>
          </div>

          {/* ================================================= */}
          {/* MARKDOWN CONTENT */}
          {/* ================================================= */}

          <article className="prose prose-invert prose-lg mt-8 max-w-none px-6 prose-headings:font-bold prose-a:text-fuchsia-400 sm:px-8">
            <ReactMarkdown
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  if (!inline && match) {
                    return (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    );
                  }

                  return (
                    <code
                      className="rounded bg-white/10 px-1 py-0.5 text-gray-100"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* ================================================= */}
          {/* TAGS */}
          {/* ================================================= */}
          {/* ================================================= */}
          {/* POST ACTIONS */}
          {/* ================================================= */}

          <div className="mt-6 flex items-center justify-between border-t border-white/10 px-6 pt-5 sm:px-8">
            <div className="text-xs text-gray-500">
              Save this article for later
            </div>

            <button
              type="button"
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                bookmarked
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.08] hover:text-white"
              } disabled:cursor-not-allowed disabled:opacity-50`}
              title={bookmarked ? "Remove bookmark" : "Bookmark this post"}
            >
              <Bookmark
                className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`}
              />

              <span>{bookmarkCount > 0 ? bookmarkCount : "Save"}</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 px-6 pb-10 sm:px-8">
            {post.tags?.map((tag) => (
              <Link
                key={tag._id}
                to={`/tag/${tag.slug}`}
                className="rounded-full bg-white/5 px-3 py-1 text-sm text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* ================================================= */}
        {/* COMMENTS */}
        {/* ================================================= */}

        <section className="mt-8">
          {/* ================================================= */}
          {/* COMMENTS HEADER */}
          {/* ================================================= */}

          <div className="mb-5 flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-gray-400" />

            <h2 className="text-lg font-semibold text-white">Discussion</h2>

            {!commentsLoading && (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-500">
                {comments.length}
              </span>
            )}
          </div>

          {/* ================================================= */}
          {/* NEW COMMENT FORM */}
          {/* ================================================= */}

          <form
            onSubmit={handleCreateComment}
            className="mb-6 rounded-xl border border-white/10 bg-[#101014] p-4"
          >
            <div className="flex gap-3">
              {/* Current user */}

              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "You"}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-gray-300">
                  {user?.name?.charAt(0)?.toUpperCase() || "Y"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  rows={4}
                  placeholder="Join the discussion..."
                  className="w-full resize-none rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-white/20"
                />

                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Posting..." : "Post comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* ================================================= */}
          {/* COMMENTS LIST */}
          {/* ================================================= */}

          <div className="space-y-4">
            {commentsLoading ? (
              <div className="rounded-xl border border-white/10 bg-[#101014] px-5 py-8 text-center">
                <p className="text-sm text-gray-500">Loading comments...</p>
              </div>
            ) : rootComments.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-[#101014] px-5 py-10 text-center">
                <MessageCircle className="mx-auto h-8 w-8 text-gray-700" />

                <p className="mt-3 text-sm text-gray-500">No comments yet.</p>

                <p className="mt-1 text-xs text-gray-600">
                  Be the first to start the discussion.
                </p>
              </div>
            ) : (
              rootComments.map((comment) => renderComment(comment))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PostDetail;
