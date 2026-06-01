"use client";

import { useState } from "react";
import { BiShare } from "react-icons/bi";

interface ShareButtonProps {
  videoId: string;
}

export function ShareButton({ videoId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
const handleShare = async () => {
  const shareUrl = `${window.location.origin}/watch/${videoId}`;

  // যদি ব্রাউজার নেটিভ শেয়ার সাপোর্ট করে (যেমন মোবাইল ডিভাইসগুলোতে)
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Watch this video on YouTube Clone",
        url: shareUrl,
      });
    } catch (err) {
      console.log("Error sharing", err);
    }
  } else {
    // মোবাইল না হলে ল্যাপটপ/পিসিতে ক্লিপবোর্ডে কপি হবে
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
};
  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
          copied ? "text-green-400 border border-green-500/30" : "text-white"
        }`}
      >
        <BiShare className={`h-5 w-5 ${copied ? "animate-bounce" : ""}`} />
        <span>{copied ? "Copied!" : "Share"}</span>
      </button>

      {/* 🎈 ছোট্ট একটি টোস্ট নোটিফিকেশন (অপশনাল, দেখতে সুন্দর লাগবে) */}
      {copied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded shadow-lg whitespace-nowrap animate-fade-in">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}