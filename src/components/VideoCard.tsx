"use client";

import Link from "next/link"; // 👈 সরাসরি Next.js এর অরিজিনাল লিঙ্ক ব্যবহার করছি
import { HiMiniCheckCircle } from "react-icons/hi2";
import type { VideoData } from "@/app/data";

export function VideoCard({ video }: { video: VideoData }) {

  // ১. মেইন ভিডিও অবজেক্ট ডেস্ট্রাকচারিং (সেফটি ভ্যালুসহ)
  const { 
    _id, 
    thumbnailUrl, 
    title, 
    views = 0, 
    durationText = "0:00", 
    createdAt 
  } = video || {};

  // ২. চ্যানেল ডাটা সেফগার্ড এবং ডিফোল্ট ভ্যালু হ্যান্ডেলিং
  const channel = video?.channel || {};
  const channelName = channel?.channelName || "Unknown Channel";
  const avatar = channel?.avatar || "https://randomuser.me/api/portraits/men/32.jpg";

  // ডেট ফরম্যাটিং সেফটি চেক
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })
    : "Recent";

  return (
    <div className="flex w-full flex-col gap-3 text-white group cursor-pointer">

      {/* ১. ভিডিও থাম্বনেইল এরিয়া */}
      <Link 
        href={`/watch/${_id}`} 
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#272727] block"
      >
        <img
          src={thumbnailUrl || "https://picsum.photos/id/42/640/360"}
          alt={title || "Video thumbnail"}
          className="h-full w-full object-cover group-hover:scale-102 transition-all duration-200"
        />
        {/* ভিডিও ডিউরেশন/সময় */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-xs font-medium px-1.5 py-0.5 rounded text-white tracking-wide">
          {durationText}
        </span>
      </Link>

      {/* ২. ভিডিওর বিস্তারিত তথ্য (টাইটেল, চ্যানেল, ভিউজ) */}
      <div className="flex gap-3 px-1">

        {/* চ্যানেল অ্যাভাটার */}
        <Link 
          href={channel?._id ? `/channel/${channel._id}` : "#"} 
          className="flex-shrink-0 h-9 w-9 rounded-full overflow-hidden bg-[#272727] block"
        >
          <img
            src={avatar}
            alt={channelName}
            className="h-full w-full object-cover"
          />
        </Link>

        {/* টেক্সট কন্টেন্ট */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* ভিডিও টাইটেল */}
          <Link 
            href={`/watch/${_id}`} 
            className="text-white hover:text-blue-400 font-semibold text-[15px] leading-tight line-clamp-2 mb-1 tracking-tight transition duration-150 block"
          >
            {title || "Untitled video"}
          </Link>

          {/* চ্যানেল নাম এবং ভেরিফাইড ব্যাজ */}
          <Link 
            href={channel?._id ? `/channel/${channel._id}` : "#"} 
            className="text-[#aaa] hover:text-white text-[13px] flex items-center gap-1 transition"
          >
            <span className="truncate">{channelName}</span>
            <HiMiniCheckCircle className="text-[#aaa] h-3.5 w-3.5 flex-shrink-0" />
          </Link>

          {/* ভিউজ এবং কতদিন আগে আপলোড হয়েছে */}
          <div className="text-[#aaa] text-[13px] flex items-center mt-0.5 whitespace-nowrap">
            <span>{views?.toLocaleString()} views</span>
            <span className="mx-1.5 text-xs">.</span>
            <span>{formattedDate}</span>
          </div>

        </div>

      </div>

    </div>
  );
}
