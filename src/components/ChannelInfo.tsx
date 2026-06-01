"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMiniCheckCircle } from "react-icons/hi2";

interface ChannelInfoProps {
  channelId: string;
  channelName: string;
  avatar: string;
  initialSubscribersCount: number; // ডাটাবেজ থেকে আসা সরাসরি নাম্বার
}

export function ChannelInfo({ channelId, channelName, avatar, initialSubscribersCount = 0 }: ChannelInfoProps) {
  const [subscribersCount, setSubscribersCount] = useState<number>(initialSubscribersCount);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  const handleSubscribe = async () => {
    const nextState = !isSubscribed;
    
    // ⚡ অপটিমিস্টিক আপডেট (UI সাথে সাথে রেসপন্স করবে)
    setSubscribersCount(prev => nextState ? prev + 1 : prev - 1);
    setIsSubscribed(nextState);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/users/${channelId}/subscribe`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSubscribing: nextState }),
      });

      if (!res.ok) {
        // ফেল করলে আগের স্টেটে ব্যাক করা
        setSubscribersCount(prev => nextState ? prev - 1 : prev + 1);
        setIsSubscribed(isSubscribed);
      }
    } catch (error) {
      console.error("Subscription failed:", error);
      setSubscribersCount(prev => nextState ? prev - 1 : prev + 1);
      setIsSubscribed(isSubscribed);
    }
  };

  // সাবস্ক্রাইবার সংখ্যাকে সুন্দর ফরম্যাট করার ফাংশন (যেমন: 42100 -> 42.1K)
  const formatSubscribers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="flex items-center gap-3">
      {/* চ্যানেল অ্যাভাটার */}
      <div className="h-10 w-10 rounded-full overflow-hidden bg-[#272727]">
        <img
          src={avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
          alt={channelName}
          className="h-full w-full object-cover"
        />
      </div>

      {/* চ্যানেল নেম এবং সাবস্ক্রাইবার কাউন্ট */}
      <div className="flex flex-col">
        <div className="font-bold text-[16px] flex items-center gap-1">
          <Link href={`/channel/${channelId}`} className="font-bold text-[16px] flex items-center gap-1 cursor-pointer hover:text-gray-300 transition">
        <span>{channelName || "Programming Hero"}</span>
        <HiMiniCheckCircle className="text-gray-400 h-4 w-4" />
      </Link>
        </div>
        <span className="text-xs text-[#aaa]">
          {formatSubscribers(subscribersCount)} subscribers
        </span>
      </div>

      {/* সাবস্ক্রাইব বাটন */}
      <button
        onClick={handleSubscribe}
        className={`ml-4 font-medium text-sm px-4 py-2 rounded-full transition duration-200 ${
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