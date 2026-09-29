import { useCallback, useEffect, useState } from "react";

import api from "../api/axios.js";
import useAuth from "./useAuth.js";
import useSocket from "./useSocket.js";

const useFollow = (userId) => {
  const { user, status } = useAuth();
  const { socket } = useSocket();

  // =====================================
  // Follow State
  // =====================================

  const [following, setFollowing] = useState(false);

  const [followerCount, setFollowerCount] = useState(0);

  const [followingCount, setFollowingCount] = useState(0);

  // =====================================
  // Loading State
  // =====================================

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  // =====================================
  // Profile Conditions
  // =====================================

  const isOwnProfile =
    Boolean(user?._id) &&
    Boolean(userId) &&
    String(user._id) === String(userId);

  const canFollow =
    status === "authenticated" && Boolean(userId) && !isOwnProfile;

  // =====================================
  // Load Follow Status
  // =====================================

  const loadFollowStatus = useCallback(async () => {
    if (!userId) {
      setFollowing(false);
      setFollowerCount(0);
      setFollowingCount(0);
      setLoading(false);

      return;
    }

    if (status !== "authenticated") {
      setFollowing(false);
      setFollowerCount(0);
      setFollowingCount(0);
      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      const response = await api.get(`/follows/users/${userId}/status`);

      setFollowing(Boolean(response.data?.following));

      setFollowerCount(
        typeof response.data?.followerCount === "number"
          ? response.data.followerCount
          : 0,
      );

      setFollowingCount(
        typeof response.data?.followingCount === "number"
          ? response.data.followingCount
          : 0,
      );
    } catch (error) {
      console.error("Failed to load follow status:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, status]);

  // =====================================
  // Initial Load
  // =====================================

  useEffect(() => {
    loadFollowStatus();
  }, [loadFollowStatus]);

  // =====================================
  // Realtime Follow Update
  // =====================================

  useEffect(() => {
    if (!socket || !userId) {
      return;
    }

    const handleFollowUpdated = (data) => {
      if (String(data?.targetUserId) !== String(userId)) {
        return;
      }

      // -------------------------------
      // Update follower count
      // -------------------------------

      if (typeof data?.followerCount === "number") {
        setFollowerCount(data.followerCount);
      }

      // -------------------------------
      // Update following count
      // -------------------------------

      if (typeof data?.followingCount === "number") {
        setFollowingCount(data.followingCount);
      }
    };

    socket.on("follow:updated", handleFollowUpdated);

    return () => {
      socket.off("follow:updated", handleFollowUpdated);
    };
  }, [socket, userId]);

  // =====================================
  // Follow User
  // =====================================

  const follow = async () => {
    if (!canFollow || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(`/follows/users/${userId}`);

      // -------------------------------
      // Update following status
      // -------------------------------

      setFollowing(Boolean(response.data?.following));

      // -------------------------------
      // Update follower count
      // -------------------------------

      if (typeof response.data?.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      }

      // -------------------------------
      // Update following count
      // -------------------------------

      if (typeof response.data?.followingCount === "number") {
        setFollowingCount(response.data.followingCount);
      }

      return response.data;
    } catch (error) {
      console.error("Follow user error:", error);

      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // Unfollow User
  // =====================================

  const unfollow = async () => {
    if (!canFollow || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.delete(`/follows/users/${userId}`);

      // -------------------------------
      // Update following status
      // -------------------------------

      setFollowing(Boolean(response.data?.following));

      // -------------------------------
      // Update follower count
      // -------------------------------

      if (typeof response.data?.followerCount === "number") {
        setFollowerCount(response.data.followerCount);
      }

      // -------------------------------
      // Update following count
      // -------------------------------

      if (typeof response.data?.followingCount === "number") {
        setFollowingCount(response.data.followingCount);
      }

      return response.data;
    } catch (error) {
      console.error("Unfollow user error:", error);

      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // Toggle Follow
  // =====================================

  const toggleFollow = async () => {
    if (following) {
      return unfollow();
    }

    return follow();
  };

  // =====================================
  // Return
  // =====================================

  return {
    following,

    followerCount,

    followingCount,

    loading,

    submitting,

    canFollow,

    isOwnProfile,

    follow,

    unfollow,

    toggleFollow,

    refresh: loadFollowStatus,
  };
};

export default useFollow;
