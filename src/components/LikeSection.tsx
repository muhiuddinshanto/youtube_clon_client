"use client";

import { useState } from "react";
import { BiLike, BiDislike } from "react-icons/bi";

interface LikeSectionProps {
  videoId: string;
  initialLikes: string[];
  initialDislikes: string[]; // 👈 ডিসলাইক অ্যারেও নিয়ে আসলাম
  userId: string;
}

export function LikeSection({ videoId, initialLikes = [], initialDislikes = [], userId }: LikeSectionProps) {
  // স্টেট ম্যানেজমেন্ট
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [dislikes, setDislikes] = useState<string[]>(initialDislikes);
  
  const isLiked = likes.includes(userId);
  const isDisliked = dislikes.includes(userId);

  // 👍 লাইক বাটনের ক্লিকের লজিক
  const handleLikeClick = async () => {
    let updatedLikes = [...likes];
    let updatedDislikes = [...dislikes];

    if (isLiked) {
      // অলরেডি লাইক করা থাকলে লাইক উঠে যাবে
      updatedLikes = updatedLikes.filter(id => id !== userId);
    } else {
      // লাইক না করা থাকলে লাইক হবে, এবং ডিসলাইক করা থাকলে সেটা রিমুভ হবে
      updatedLikes.push(userId);
      updatedDislikes = updatedDislikes.filter(id => id !== userId);
    }

    // স্টেট আপডেট (ইউজার সাথে সাথে ইন্টারফেসে দেখবে)
    setLikes(updatedLikes);
    setDislikes(updatedDislikes);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos/${videoId}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error("Like error:", error);
      // এরর হলে ওল্ড স্টেটে ফেরত যাওয়া (রোলব্যাক)
      setLikes(likes);
      setDislikes(dislikes);
    }
  };

  // 👎 ডিসলাইক বাটনের ক্লিকের লজিক
  const handleDislikeClick = async () => {
    let updatedLikes = [...likes];
    let updatedDislikes = [...dislikes];

    if (isDisliked) {
      // অলরেডি ডিসলাইক থাকলে সেটা উঠে যাবে
      updatedDislikes = updatedDislikes.filter(id => id !== userId);
    } else {
      // ডিসলাইক না থাকলে ডিসলাইক হবে, এবং লাইক করা থাকলে সেটা রিমুভ হবে
      updatedDislikes.push(userId);
      updatedLikes = updatedLikes.filter(id => id !== userId);
    }

    // স্টেট আপডেট
    setLikes(updatedLikes);
    setDislikes(updatedDislikes);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos/${videoId}/dislike`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error("Dislike error:", error);
      setLikes(likes);
      setDislikes(dislikes);
    }
  };

  return (
    <div className="flex items-center bg-[#272727] rounded-full overflow-hidden">
      {/* 👍 লাইক বাটন */}
      <button 
        onClick={handleLikeClick}
        className={`flex items-center gap-2 hover:bg-[#3f3f3f] px-4 py-2 text-sm font-medium border-r border-[#3f3f3f] transition ${
          isLiked ? "text-blue-400" : "text-white"
        }`}
      >
        <BiLike className={`h-5 w-5 ${isLiked ? "fill-blue-400" : ""}`} />
        <span>{likes.length}</span>
      </button>
      
      {/* 👎 ডিসলাইক বাটন */}
      <button 
        onClick={handleDislikeClick}
        className={`flex items-center gap-2 hover:bg-[#3f3f3f] px-4 py-2 transition ${
          isDisliked ? "text-red-400" : "text-white"
        }`}
      >
        <BiDislike className={`h-5 w-5 ${isDisliked ? "fill-red-400" : ""}`} />
        {/* ইউটিউব সাধারণত ডিসলাইকের সংখ্যা দেখায় না, শুধু বাটন কালার হাইলাইট করে */}
      </button>
    </div>
  );
}