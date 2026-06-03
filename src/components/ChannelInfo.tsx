"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HiMiniCheckCircle } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client"; // Better-Auth ক্লায়েন্ট
import { getAuthJwtToken } from "@/lib/auth-token";

interface ChannelInfoProps {
  channelId: string;
  channelName: string;
  avatar: string;
  initialSubscribersCount: number;
}

interface UserProfile {
  following?: string[];
}

export function ChannelInfo({ channelId, channelName, avatar, initialSubscribersCount = 0 }: ChannelInfoProps) {
  const { data: session } = authClient.useSession(); // লগইন থাকা ইউজারের ডাটা
  const userId = session?.user?.id;
  const [subscribersCount, setSubscribersCount] = useState<number>(initialSubscribersCount);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // 🔄 কারেন্ট ইউজার অলরেডি সাবস্ক্রাইবড কি না তা ইনিশিয়ালি চেক করা
  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    async function checkSubscriptionStatus() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/users/${userId}`, {
          signal: controller.signal,
        });

        if (!res.ok) return;

        const userProfile = (await res.json()) as UserProfile | null;
        const following = Array.isArray(userProfile?.following) ? userProfile.following : [];
        setIsSubscribed(following.includes(channelId));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Subscription status check failed:", error);
      }
    }

    checkSubscriptionStatus();

    return () => {
      controller.abort();
    };
  }, [userId, channelId]);

  const handleSubscribe = async () => {
    // 🛑 ইউজার লগইন না থাকলে সাবস্ক্রাইব করতে দেবে না
    if (!session?.user || !userId) {
      alert("Please sign in to subscribe to this channel!");
      return;
    }

    // নিজের চ্যানেল নিজে সাবস্ক্রাইব করা আটকানো
    if (userId === channelId) {
      alert("You cannot subscribe to your own channel!");
      return;
    }

    const nextState = !isSubscribed;
    
    // ⚡ অপটিমিস্টিক আপডেট (UI সাথে সাথে রেসপন্স করবে)
    setSubscribersCount(prev => nextState ? prev + 1 : prev - 1);
    setIsSubscribed(nextState);

    try {
      // 🔑 Better-Auth এর সেশন টোকেন সরাসরি ডকুমেন্ট কুকি থেকে বের করা (সবচেয়ে নিরাপদ ও টাইপ-সেফ উপায়)
      const token = await getAuthJwtToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/users/${channelId}/subscribe`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          userId, // ব্যাকএন্ডে কার প্রোফাইলে 'following' পুশ/পুল হবে তার আইডি
          isSubscribing: nextState 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update subscription on server");
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      // 🔄 সার্ভার ফেল করলে UI আগের অবস্থায় ফেরত নিয়ে যাবে
      setSubscribersCount(prev => nextState ? prev - 1 : prev + 1);
      setIsSubscribed(!nextState);
    }
  };

  // সাবস্ক্রাইবার সংখ্যা ফরম্যাট করার ফাংশন (যেমন: 42100 -> 42.1K)
  const formatSubscribers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* চ্যানেল অ্যাভাটার */}
      <div className="h-10 w-10 rounded-full overflow-hidden bg-[#272727] flex-shrink-0">
        <img
          src={avatar || "https://api.dicebear.com/7.x/initials/svg?seed=Channel"}
          alt={channelName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* চ্যানেল নেম এবং সাবস্ক্রাইবার কাউন্ট */}
      <div className="flex flex-col min-w-0">
        <div className="font-bold text-[16px] flex items-center gap-1">
          <Link href={`/channel/${channelId}`} className="font-bold text-[16px] flex items-center gap-1 cursor-pointer hover:text-gray-300 transition truncate">
            <span>{channelName || "Unknown Channel"}</span>
            <HiMiniCheckCircle className="text-gray-400 h-4 w-4 flex-shrink-0" />
          </Link>
        </div>
        <span className="text-xs text-[#aaa]">
          {formatSubscribers(subscribersCount)} subscribers
        </span>
      </div>

      {/* সাবস্ক্রাইব বাটন */}
      <button
        onClick={handleSubscribe}
        className={`ml-4 font-medium text-sm px-4 py-2 rounded-full transition duration-200 cursor-pointer flex-shrink-0 ${
          isSubscribed
            ? "bg-[#272727] text-white hover:bg-[#3f3f3f]"
            : "bg-white text-black hover:bg-opacity-90"
        }`}
      >
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}
