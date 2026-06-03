"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Spinner } from "@heroui/react";
import {
  HiMiniCheckCircle,
  HiOutlineRectangleStack,
  HiUserPlus,
} from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";

interface ChannelProfile {
  _id: string;
  channelName?: string;
  name?: string;
  avatar?: string;
  image?: string;
  subscribers?: number;
}

interface Video {
  _id: string;
  userId?: string;
  title?: string;
  thumbnailUrl?: string;
  durationText?: string;
  views?: number;
  createdAt?: string;
  channel?: ChannelProfile;
}

interface UserProfile {
  _id: string;
  following?: string[];
}

interface ChannelResponse {
  profile?: ChannelProfile;
  videos?: Video[];
}

const fallbackAvatar = "https://api.dicebear.com/7.x/initials/svg?seed=Channel";
const fallbackThumbnail = "https://picsum.photos/id/42/640/360";

function formatCount(count = 0) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toLocaleString();
}

function formatDate(date?: string) {
  if (!date) return "Recent";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Recent";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubscriptionsPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const userId = session?.user?.id;
  const [channels, setChannels] = useState<ChannelProfile[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!userId) return;

    const controller = new AbortController();

    async function loadSubscriptions() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_API}/users/${userId}`,
          { signal: controller.signal }
        );

        if (!userRes.ok) {
          throw new Error("Could not load your subscriptions.");
        }

        const userProfile = (await userRes.json()) as UserProfile | null;
        const following = Array.isArray(userProfile?.following)
          ? userProfile.following
          : [];

        if (following.length === 0) {
          setChannels([]);
          setVideos([]);
          return;
        }

        const channelResults = await Promise.allSettled(
          following.map(async (channelId) => {
            const channelRes = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_API}/channels/${channelId}`,
              { signal: controller.signal }
            );

            if (!channelRes.ok) return null;
            return (await channelRes.json()) as ChannelResponse;
          })
        );

        const subscribedChannels: ChannelProfile[] = [];
        const subscriptionVideos: Video[] = [];

        channelResults.forEach((result) => {
          if (result.status !== "fulfilled" || !result.value?.profile) return;

          const profile = result.value.profile;
          subscribedChannels.push(profile);

          result.value.videos?.forEach((video) => {
            subscriptionVideos.push({
              ...video,
              channel: profile,
            });
          });
        });

        subscriptionVideos.sort((a, b) => {
          const first = new Date(a.createdAt || 0).getTime();
          const second = new Date(b.createdAt || 0).getTime();
          return second - first;
        });

        setChannels(subscribedChannels);
        setVideos(subscriptionVideos);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Error fetching subscriptions:", error);
        setErrorMessage("Subscriptions load korte problem hocche. Please try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadSubscriptions();

    return () => {
      controller.abort();
    };
  }, [authLoading, userId]);

  const headerSubtitle = useMemo(() => {
    if (channels.length === 0) return "No subscribed channels yet";
    if (channels.length === 1) return "1 subscribed channel";
    return `${channels.length} subscribed channels`;
  }, [channels.length]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Spinner size="lg" color="current" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center p-6 select-none">
        <HiUserPlus className="mb-4 text-7xl text-gray-600" />
        <h2 className="mb-2 text-xl font-semibold">Sign in to see subscriptions</h2>
        <p className="max-w-sm text-sm text-gray-400">
          Your subscribed channels and their latest videos will show up here.
        </p>
        <Link
          href="/login"
          className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center p-6 select-none">
        <HiOutlineRectangleStack className="mb-4 text-7xl text-gray-600" />
        <h2 className="mb-2 text-xl font-semibold">Don&apos;t miss new videos</h2>
        <p className="max-w-sm text-sm text-gray-400">
          Content from channels you subscribe to will show up here. Start exploring your favorite channels now!
        </p>
        {errorMessage && <p className="mt-4 text-sm text-red-400">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col gap-1 border-b border-[#272727] pb-4">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-sm text-[#aaa]">{headerSubtitle}</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-base font-semibold">Channels</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {channels.map((channel) => {
            const channelName = channel.channelName || channel.name || "Unknown Channel";
            const channelId = channel._id;

            return (
              <Link
                key={channelId}
                href={`/channel/${channelId}`}
                className="flex w-28 flex-shrink-0 flex-col items-center gap-2 rounded-lg p-2 transition hover:bg-white/10"
              >
                <div className="h-20 w-20 overflow-hidden rounded-full bg-[#272727]">
                  <img
                    src={channel.avatar || channel.image || fallbackAvatar}
                    alt={channelName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full text-center">
                  <p className="truncate text-sm font-semibold">{channelName}</p>
                  <p className="truncate text-xs text-[#aaa]">
                    {formatCount(channel.subscribers)} subscribers
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-base font-semibold">Latest Videos</h2>

        {videos.length === 0 ? (
          <div className="rounded-lg border border-[#272727] p-8 text-center text-sm text-gray-400">
            Your subscribed channels have not uploaded any videos yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => {
              const channel = video.channel;
              const channelName = channel?.channelName || channel?.name || "Unknown Channel";
              const channelId = channel?._id || video.userId || "";

              return (
                <div key={video._id} className="group flex flex-col gap-3">
                  <Link
                    href={`/watch/${video._id}`}
                    className="relative block aspect-video w-full overflow-hidden rounded-xl bg-[#272727]"
                  >
                    <img
                      src={video.thumbnailUrl || fallbackThumbnail}
                      alt={video.title || "Video thumbnail"}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium">
                      {video.durationText || "0:00"}
                    </span>
                  </Link>

                  <div className="flex gap-3">
                    <Link
                      href={channelId ? `/channel/${channelId}` : "#"}
                      className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-[#272727]"
                    >
                      <img
                        src={channel?.avatar || channel?.image || fallbackAvatar}
                        alt={channelName}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/watch/${video._id}`}
                        className="line-clamp-2 text-sm font-semibold leading-snug transition group-hover:text-blue-400"
                      >
                        {video.title || "Untitled video"}
                      </Link>
                      <Link
                        href={channelId ? `/channel/${channelId}` : "#"}
                        className="mt-1 flex items-center gap-1 text-xs text-[#aaa] transition hover:text-white"
                      >
                        <span className="truncate">{channelName}</span>
                        <HiMiniCheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      </Link>
                      <p className="mt-0.5 text-xs text-[#aaa]">
                        {formatCount(video.views)} views <span className="px-1">.</span> {formatDate(video.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
