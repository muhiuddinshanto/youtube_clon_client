"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { HiMiniCheckCircle, HiOutlineClock, HiOutlineTrash } from "react-icons/hi2";
import type { VideoData } from "@/app/data";

function getHistoryKey(userId: string) {
  return `youtube-clone:watch-history:${userId}`;
}

export default function WatchHistoryPage() {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;
  const [historyVideos, setHistoryVideos] = useState<VideoData[]>([]);

  useEffect(() => {
    if (!userId) return;

    const timeoutId = window.setTimeout(() => {
      try {
        const history = JSON.parse(localStorage.getItem(getHistoryKey(userId)) || "[]") as VideoData[];
        setHistoryVideos(history);
      } catch (error) {
        console.error("Failed to load local watch history:", error);
        setHistoryVideos([]);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [userId]);

  const clearHistory = () => {
    if (!userId) return;
    localStorage.removeItem(getHistoryKey(userId));
    setHistoryVideos([]);
  };

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center text-white">
        <h2 className="mb-2 text-xl font-bold">Keep track of what you watch</h2>
        <p className="mb-6 text-sm text-gray-400">Watch history is available after signing in.</p>
        <Link href="/login" className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black hover:bg-gray-200">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
            <HiOutlineClock className="text-green-500" /> Watch History
          </h1>

          {historyVideos.length === 0 ? (
            <p className="text-sm text-gray-500">Videos you watch will appear here.</p>
          ) : (
            <div className="space-y-4">
              {historyVideos.map((video) => {
                const channelId = video.channel?._id || video.userId || "";
                const channelName = video.channel?.channelName || video.channel?.name || "Unknown Channel";

                return (
                  <div key={video._id} className="group flex flex-col gap-3 rounded-xl bg-[#161616] p-3 transition hover:bg-[#272727] sm:flex-row">
                    <Link href={`/watch/${video._id}`} className="relative aspect-video w-full flex-shrink-0 overflow-hidden rounded-lg bg-[#272727] sm:w-52">
                      <img
                        src={video.thumbnailUrl || "https://picsum.photos/id/42/640/360"}
                        alt={video.title || "Video thumbnail"}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium">
                        {video.durationText || "0:00"}
                      </span>
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                      <div>
                        <Link href={`/watch/${video._id}`} className="mb-1 line-clamp-2 text-sm font-semibold text-[#f1f1f1] hover:text-white sm:text-base">
                          {video.title || "Untitled video"}
                        </Link>
                        <Link href={channelId ? `/channel/${channelId}` : "#"} className="mb-2 flex items-center gap-1 text-xs text-[#aaa] hover:text-gray-200">
                          <span>{channelName}</span>
                          <HiMiniCheckCircle className="h-3 w-3 text-gray-400" />
                        </Link>
                        <p className="hidden text-xs text-gray-400 line-clamp-2 sm:block">
                          {video.description || "No description provided."}
                        </p>
                      </div>
                      <span className="text-[11px] text-[#aaa]">{video.views || 0} views</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="hidden border-l border-[#272727] pl-8 lg:block">
          <div className="space-y-4 rounded-lg bg-[#161616] p-4">
            <h3 className="text-lg font-bold">Manage History</h3>
            <button
              onClick={clearHistory}
              className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              <HiOutlineTrash className="h-5 w-5" />
              Clear all watch history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
