"use client";

import { useEffect } from "react";
import type { VideoData } from "@/app/data";
import { authClient } from "@/lib/auth-client";

const maxHistoryItems = 50;

function getHistoryKey(userId: string) {
  return `youtube-clone:watch-history:${userId}`;
}

export function WatchHistoryRecorder({ video }: { video: VideoData }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId || !video?._id) return;

    try {
      const key = getHistoryKey(userId);
      const previous = JSON.parse(localStorage.getItem(key) || "[]") as VideoData[];
      const next = [
        { ...video, watchedAt: new Date().toISOString() },
        ...previous.filter((item) => item._id !== video._id),
      ].slice(0, maxHistoryItems);

      localStorage.setItem(key, JSON.stringify(next));
    } catch (error) {
      console.error("Could not save watch history:", error);
    }
  }, [userId, video]);

  return null;
}
