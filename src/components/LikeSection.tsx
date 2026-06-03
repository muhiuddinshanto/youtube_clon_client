"use client";

import { useState } from "react";
import { AiFillLike, AiFillDislike, AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { authClient } from "@/lib/auth-client"; // Better-Auth ক্লায়েন্ট
import { getAuthJwtToken } from "@/lib/auth-token";
import toast from "react-hot-toast";

// 🎯 ইন্টারফেসটি ভালো করে খেয়াল করুন, userId এর পাশে '?' দেওয়া হয়েছে
interface LikeSectionProps {
  videoId: string;
  initialLikes: string[];
  initialDislikes: string[];
  userId?: string; // 👈 এখানে '?' দেওয়ার কারণে এটি এখন অপশনাল (Optional)
}

export function LikeSection({ videoId, initialLikes = [], initialDislikes = [] }: LikeSectionProps) {
  const { data: session } = authClient.useSession(); // ⚡ ক্লায়েন্ট সাইড থেকে ডাইনামিক সেশন রিড করা হচ্ছে
  const userId = session?.user?.id;

  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [dislikes, setDislikes] = useState<string[]>(initialDislikes);

  const isLiked = userId ? likes.includes(userId) : false;
  const isDisliked = userId ? dislikes.includes(userId) : false;

  const handleLike = async () => {
    if (!userId) {
      toast.error("Please sign in to like this video.");
      return;
    }

    const nextState = !isLiked;
    // ⚡ অপটিমিস্টিক আপডেট লজিক
    if (nextState) {
      setLikes((prev) => [...prev, userId]);
      if (isDisliked) setDislikes((prev) => prev.filter((id) => id !== userId));
    } else {
      setLikes((prev) => prev.filter((id) => id !== userId));
    }

    try {
      const token = await getAuthJwtToken();
      if (!token) throw new Error("Please sign in again.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos/${videoId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, isAdding: nextState }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Like failed (${res.status})`);
      }
    } catch (error) {
      console.error("Like action failed:", error);
      toast.error(error instanceof Error ? error.message : "Like failed.");
      // 🔄 ফেল করলে রিভার্ট ব্যাক
      setLikes(initialLikes);
      setDislikes(initialDislikes);
    }
  };

  const handleDislike = async () => {
    if (!userId) {
      toast.error("Please sign in to dislike this video.");
      return;
    }

    const nextState = !isDisliked;
    // ⚡ অপটিমিস্টিক আপডেট লজিক
    if (nextState) {
      setDislikes((prev) => [...prev, userId]);
      if (isLiked) setLikes((prev) => prev.filter((id) => id !== userId));
    } else {
      setDislikes((prev) => prev.filter((id) => id !== userId));
    }

    try {
      const token = await getAuthJwtToken();
      if (!token) throw new Error("Please sign in again.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos/${videoId}/dislike`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, isAdding: nextState }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Dislike failed (${res.status})`);
      }
    } catch (error) {
      console.error("Dislike action failed:", error);
      toast.error(error instanceof Error ? error.message : "Dislike failed.");
      // 🔄 ফেল করলে রিভার্ট ব্যাক
      setLikes(initialLikes);
      setDislikes(initialDislikes);
    }
  };

  return (
    <div className="flex items-center bg-[#272727] rounded-full overflow-hidden text-sm font-medium h-9 select-none">
      {/* লাইক বাটন */}
      <button 
        onClick={handleLike}
        className="flex items-center gap-2 px-4 hover:bg-[#3f3f3f] h-full transition rounded-l-full border-r border-[#3f3f3f]"
      >
        {isLiked ? <AiFillLike className="h-5 w-5 text-white" /> : <AiOutlineLike className="h-5 w-5 text-gray-300" />}
        <span>{likes.length}</span>
      </button>

      {/* ডিসলাইক বাটন */}
      <button 
        onClick={handleDislike}
        className="flex items-center gap-2 px-4 hover:bg-[#3f3f3f] h-full transition rounded-r-full"
      >
        {isDisliked ? <AiFillDislike className="h-5 w-5 text-white" /> : <AiOutlineDislike className="h-5 w-5 text-gray-300" />}
        <span>{dislikes.length}</span>
      </button>
    </div>
  );
}
