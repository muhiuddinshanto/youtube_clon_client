"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { HiOutlineHandThumbUp, HiOutlineUserGroup, HiMiniCheckCircle } from "react-icons/hi2";
import { getAuthJwtToken } from "@/lib/auth-token";

// 💡 টাইপ ডেফিনিশন (Type Definitions)
interface Video {
  _id: string;
  title: string;
  thumbnailUrl: string;
  durationText: string;
  views: number;
  channel?: {
    _id: string;
    channelName: string;
    avatar: string;
  };
}

interface SubscribedChannel {
  _id: string;
  channelName: string;
  avatar: string;
  subscribers: number;
}

export default function LibraryPage() {
  const { data: session, isPending } = authClient.useSession();
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [subscribedChannels, setSubscribedChannels] = useState<SubscribedChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // ইউজার লগইন না থাকলে বা সেশন লোড হতে থাকলে ডেটা ফেচ হবে না
    if (!session?.user) return;

    const fetchLibraryData = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        // 🔑 Better-Auth এর সেশন টোকেন সরাসরি ডকুমেন্ট কুকি থেকে বের করা
        const token = await getAuthJwtToken();

        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        };

        // 🔄 দুটি এپیআই প্যারালালি কল করার জন্য Promise.all ব্যবহার করা হয়েছে (ফাস্ট পারফরম্যান্স)
        const [likedRes, channelsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/library/liked-videos?userId=${session.user.id}`, { headers, cache: "no-store" }),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/library/subscribed-channels?userId=${session.user.id}`, { headers, cache: "no-store" })
        ]);

        if (!likedRes.ok || !channelsRes.ok) {
          throw new Error("Library data load failed. Please check server auth/JWT settings.");
        }

        const likedData = await likedRes.json();
        const channelsData = await channelsRes.json();
        setLikedVideos(likedData);
        setSubscribedChannels(channelsData);

      } catch (error) {
        console.error("Failed to load library data:", error);
        setErrorMessage(error instanceof Error ? error.message : "Library data load failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, [session]);

  // 🔄 ১. সেশন লোডিং স্টেট
  if (isPending) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center bg-[#0f0f0f] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  // 🛑 ২. ইউজার লগইন না থাকলে সাইন-ইন স্ক্রিন দেখাবে
  if (!session?.user) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-white bg-[#0f0f0f] p-4">
        <h2 className="text-xl font-bold mb-2 text-center">Enjoy your favorite videos</h2>
        <p className="text-gray-400 text-sm mb-6 text-center">Sign in to access videos you’ve liked or channels you subscribe to</p>
        <Link href="/login" className="bg-white text-black px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-opacity-90 transition cursor-pointer">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white p-6 md:p-10 space-y-12 select-none">
      
      {/* 👥 ১. সাবস্ক্রাইবড চ্যানেল সেকশন */}
      <section className="space-y-5">
        {errorMessage && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center gap-2 text-lg font-bold border-b border-[#272727] pb-3">
          <HiOutlineUserGroup className="h-5 w-5 text-red-500" />
          <h2>Subscriptions ({subscribedChannels.length})</h2>
        </div>

        {loading ? (
          <div className="text-gray-400 text-sm">Loading channels...</div>
        ) : subscribedChannels.length === 0 ? (
          <p className="text-gray-500 text-sm">Channels you subscribe to will appear here.</p>
        ) : (
          <div className="flex flex-wrap gap-8 py-2">
            {subscribedChannels.map((channel) => (
              <Link 
                href={`/channel/${channel._id}`} 
                key={channel._id} 
                className="flex flex-col items-center gap-2 group cursor-pointer max-w-[100px]"
              >
                <div className="h-16 w-16 rounded-full overflow-hidden bg-[#272727] ring-2 ring-transparent group-hover:ring-gray-500 transition duration-200">
                  <img 
                    src={channel.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Channel"} 
                    alt={channel.channelName} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-center truncate w-full group-hover:text-gray-300">
                  {channel.channelName}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 👍 ২. লাইকড ভিডিও সেকশন */}
      <section className="space-y-5">
        <div className="flex items-center gap-2 text-lg font-bold border-b border-[#272727] pb-3">
          <HiOutlineHandThumbUp className="h-5 w-5 text-blue-500" />
          <h2>Liked Videos ({likedVideos.length})</h2>
        </div>

        {loading ? (
          <div className="text-gray-400 text-sm">Loading liked videos...</div>
        ) : likedVideos.length === 0 ? (
          <p className="text-gray-500 text-sm">Videos you like will show up here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {likedVideos.map((video) => (
              <div key={video._id} className="flex flex-col gap-2 group">
                {/* ভিডিও থাম্বনেইল */}
                <Link href={`/watch/${video._id}`} className="relative aspect-video rounded-xl overflow-hidden bg-[#272727] cursor-pointer">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-200"
                  />
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-[11px] font-medium px-1.5 py-0.5 rounded">
                    {video.durationText || "0:00"}
                  </span>
                </Link>

                {/* ভিডিওর ডিটেইলস (টাইটেল এবং চ্যানেল ইনফো) */}
                <div className="flex gap-3 pt-1">
                  <Link href={`/channel/${video.channel?._id}`} className="h-9 w-9 rounded-full overflow-hidden bg-[#272727] flex-shrink-0 cursor-pointer">
                    <img 
                      src={video.channel?.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Channel"} 
                      alt={video.channel?.channelName} 
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  
                  <div className="flex flex-col min-w-0">
                    <Link href={`/watch/${video._id}`} className="text-sm font-semibold line-clamp-2 text-[#f1f1f1] hover:text-white cursor-pointer">
                      {video.title}
                    </Link>
                    
                    <Link href={`/channel/${video.channel?._id}`} className="text-xs text-[#aaa] mt-1 flex items-center gap-1 hover:text-gray-200 cursor-pointer truncate">
                      <span>{video.channel?.channelName || "Unknown Channel"}</span>
                      <HiMiniCheckCircle className="text-gray-400 h-3.5 w-3.5" />
                    </Link>

                    <span className="text-xs text-[#aaa] mt-0.5">
                      {video.views || 0} views
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
