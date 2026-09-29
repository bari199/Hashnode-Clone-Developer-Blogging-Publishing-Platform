import { useCallback, useEffect, useState } from "react";
import api from "../api/axios.js";

const useTagFollow = (tagId, enabled = true) => {
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // GET FOLLOW STATUS
  // ==========================================

  const loadFollowStatus = useCallback(async () => {
    if (!tagId || !enabled) {
      setFollowing(false);
      setFollowerCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(`/follows/tags/${tagId}/status`);

      setFollowing(Boolean(response.data?.following));

      setFollowerCount(
        typeof response.data?.followerCount === "number"
          ? response.data.followerCount
          : 0,
      );
    } catch (error) {
      console.error("Failed to load tag follow status:", error);

      setFollowing(false);
      setFollowerCount(0);
    } finally {
      setLoading(false);
    }
  }, [tagId, enabled]);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadFollowStatus();
  }, [loadFollowStatus]);

  // ==========================================
  // FOLLOW TAG
  // ==========================================

  const follow = async () => {
    if (!tagId || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(`/follows/tags/${tagId}`);

      setFollowing(Boolean(response.data?.following));

      if (typeof response.data?.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      }

      return response.data;
    } catch (error) {
      console.error("Follow tag error:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // UNFOLLOW TAG
  // ==========================================

  const unfollow = async () => {
    if (!tagId || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.delete(`/follows/tags/${tagId}`);

      setFollowing(Boolean(response.data?.following));

      if (typeof response.data?.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      }

      return response.data;
    } catch (error) {
      console.error("Unfollow tag error:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // TOGGLE FOLLOW
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

export default useTagFollow;
