import { useCallback, useEffect, useState } from "react";
import api from "../api/axios.js";
import useSocket from "./useSocket.js";

const useComments = (postId) => {
  const { socket } = useSocket();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // LOAD COMMENTS
  // =========================================================

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setComments([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(`/comments/posts/${postId}`);

      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Fetch comments error:", error);

      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // =========================================================
  // SOCKET REALTIME COMMENTS
  // =========================================================

  useEffect(() => {
    if (!postId || !socket) {
      return;
    }

    // Join post room
    socket.emit("post:join", postId);

    const handleCommentCreated = (newComment) => {
      if (!newComment?._id) {
        return;
      }

      setComments((currentComments) => {
        const alreadyExists = currentComments.some(
          (comment) => comment._id === newComment._id,
        );

        if (alreadyExists) {
          return currentComments;
        }

        return [...currentComments, newComment];
      });
    };

    const handleCommentUpdated = (updatedComment) => {
      if (!updatedComment?._id) {
        return;
      }

      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment,
        ),
      );
    };

    const handleCommentDeleted = (data) => {
      const commentId = data?.commentId;

      if (!commentId) {
        return;
      }

      setComments((currentComments) =>
        currentComments.filter((comment) => {
          if (comment._id === commentId) {
            return false;
          }

          /*
           * If backend deletes a parent comment together
           * with its direct replies, remove those replies too.
           */
          const parentId =
            typeof comment.parentComment === "object"
              ? comment.parentComment?._id
              : comment.parentComment;

          return parentId !== commentId;
        }),
      );
    };

    socket.on("comment:created", handleCommentCreated);
    socket.on("comment:updated", handleCommentUpdated);
    socket.on("comment:deleted", handleCommentDeleted);

    return () => {
      socket.emit("post:leave", postId);

      socket.off("comment:created", handleCommentCreated);
      socket.off("comment:updated", handleCommentUpdated);
      socket.off("comment:deleted", handleCommentDeleted);
    };
  }, [postId, socket]);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // =========================================================
  // CREATE COMMENT / REPLY
  // =========================================================

  const createComment = async (content, parentComment = null) => {
    const cleanContent = content?.trim();

    if (!cleanContent || !postId) {
      return;
    }

    try {
      setSubmitting(true);

      await api.post(`/comments/posts/${postId}`, {
        content: cleanContent,
        parentComment,
      });
    } catch (error) {
      console.error("Create comment error:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // UPDATE COMMENT
  // =========================================================

  const updateComment = async (commentId, content) => {
    const cleanContent = content?.trim();

    if (!commentId || !cleanContent) return;

    try {
      setSubmitting(true);

      await api.patch(`/comments/${commentId}`, {
        content: cleanContent,
      });
    } catch (error) {
      console.error("Update comment error:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DELETE COMMENT
  // =========================================================

  const deleteComment = async (commentId) => {
    if (!commentId) {
      return;
    }

    try {
      setSubmitting(true);

      await api.delete(`/comments/${commentId}`);
    } catch (error) {
      console.error("Delete comment error:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    comments,
    loading,
    submitting,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
  };
};

export default useComments;
