import { useCallback, useEffect, useState } from "react";

import api from "../api/axios.js";

const useUserFollow = (userId, enabled = true) => {
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // Load Follow Status
  // ==========================================

  const loadFollowStatus = useCallback(async () => {
    if (!userId || !enabled) {
      setFollowing(false);
      setFollowerCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(`/follows/users/${userId}/status`);

      setFollowing(Boolean(response.data?.following));

      if (typeof response.data?.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      } else {
        setFollowerCount(0);
      }
    } catch (error) {
      console.error(
        "Failed to load user follow status:",
        error.response?.data?.message || error.message,
      );

      setFollowing(false);
      setFollowerCount(0);
    } finally {
      setLoading(false);
    }
  }, [userId, enabled]);

  // ==========================================
  // Initial / User Change
  // ==========================================

  useEffect(() => {
    loadFollowStatus();
  }, [loadFollowStatus]);

  // ==========================================
  // Follow User
  // ==========================================

  const follow = async () => {
    if (!userId || submitting) return;

    try {
      setSubmitting(true);

      const response = await api.post(`/follows/users/${userId}`);

      setFollowing(Boolean(response.data?.following));

      if (typeof response.data?.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Follow user error:",
        error.response?.data?.message || error.message,
      );

      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Unfollow User
  // ==========================================

  const unfollow = async () => {
    if (!userId || submitting) return;

    try {
      setSubmitting(true);

      const response = await api.delete(`/follows/users/${userId}`);

      setFollowing(Boolean(response.data?.following));

      if (typeof response.data?.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      }

      return response.data;
    } catch (error) {
      console.error(
        "Unfollow user error:",
        error.response?.data?.message || error.message,
      );

      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // Toggle Follow
  // ==========================================

  const toggleFollow = async () => {
    if (following) {
      return unfollow();
    }

    return follow();
  };

  return {
    following,
    followerCount,

    loading,
    submitting,

    follow,
    unfollow,
    toggleFollow,

    refresh: loadFollowStatus,
  };
};

export default useUserFollow;
