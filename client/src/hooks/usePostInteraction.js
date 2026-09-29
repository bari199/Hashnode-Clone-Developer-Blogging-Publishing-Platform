import { useEffect, useState } from "react";
import api from "../api/axios.js";
import useSocket from "./useSocket.js";

const usePostInteraction = (postId) => {
  const { socket, connected } = useSocket();

  const [liked, setLiked] = useState(false);
  const [upvoted, setUpvoted] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [upvoteCount, setUpvoteCount] = useState(0);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // 1. Load existing interaction
  // ==========================================

  useEffect(() => {
    const loadInteractions = async () => {
      if (!postId) return;

      try {
        const response = await api.get(`/interactions/posts/${postId}`);

        const data = response.data;

        setLiked(data.liked);
        setUpvoted(data.upvoted);
        setLikeCount(data.likeCount);
        setUpvoteCount(data.upvoteCount);
      } catch (error) {
        console.error(
          "Failed to load interactions:",
          error.response?.data?.message || error.message,
        );
      }
    };

    loadInteractions();
  }, [postId]);

  // ==========================================
  // 2. Realtime socket listeners
  // ==========================================

  useEffect(() => {
    if (!socket || !connected || !postId) return;

    socket.emit("post:join", postId);

    const handleLikeUpdated = (data) => {
      if (data.postId !== postId) return;

      setLikeCount(data.likeCount);
    };

    const handleUpvoteUpdated = (data) => {
      if (data.postId !== postId) return;

      setUpvoteCount(data.upvoteCount);
    };

    socket.on("post:like:updated", handleLikeUpdated);

    socket.on("post:upvote:updated", handleUpvoteUpdated);

    return () => {
      socket.off("post:like:updated", handleLikeUpdated);

      socket.off("post:upvote:updated", handleUpvoteUpdated);

      socket.emit("post:leave", postId);
    };
  }, [socket, connected, postId]);

  // ==========================================
  // 3. Toggle Like
  // ==========================================

  const toggleLike = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (liked) {
        const response = await api.delete(`/interactions/posts/${postId}/like`);

        setLiked(false);

        // REST response gives the latest count
        setLikeCount(response.data.likeCount);
      } else {
        const response = await api.post(`/interactions/posts/${postId}/like`);

        setLiked(true);

        // REST response gives the latest count
        setLikeCount(response.data.likeCount);
      }
    } catch (error) {
      console.error(
        "Like error:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 4. Toggle Upvote
  // ==========================================

  const toggleUpvote = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (upvoted) {
        const response = await api.delete(
          `/interactions/posts/${postId}/upvote`,
        );

        setUpvoted(false);

        setUpvoteCount(response.data.upvoteCount);
      } else {
        const response = await api.post(`/interactions/posts/${postId}/upvote`);

        setUpvoted(true);

        setUpvoteCount(response.data.upvoteCount);
      }
    } catch (error) {
      console.error(
        "Upvote error:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    upvoted,

    likeCount,
    upvoteCount,

    loading,

    setLiked,
    setUpvoted,
    setLikeCount,
    setUpvoteCount,

    toggleLike,
    toggleUpvote,
  };
};

export default usePostInteraction;
