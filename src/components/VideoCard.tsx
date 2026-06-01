"use client";

import { getVideosData } from "@/app/data";
import { Link } from "@heroui/react";
import { HiMiniCheckCircle } from "react-icons/hi2";

export function VideoCard({ video }: any) {
  // এখানে সরাসরি ডামি ডাটা অবজেক্ট আকারে রাখা হলো

  const { _id, category, thumbnailUrl, videoUrl, title, views, durationText, createdAt } = video
  const { channelName, avatar } = video.channel
  console.log(video);



  




  return (
    <div className="flex flex-col gap-3 w-full max-w-[360px] mx-auto group cursor-pointer text-white">

      {/* ১. ভিডিও থাম্বনেইল এরিয়া */}
      <Link href={`/watch/${_id}`} className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#272727]">
        <img
          src={thumbnailUrl}
          alt={title}
          className="h-full w-full object-cover group-hover:rounded-none transition-all duration-200"
        />
        {/* ভিডিও ডিউরেশন/সময় */}
        <span className="absolute bottom-2 right-2 bg-black/80 text-xs font-medium px-1.5 py-0.5 rounded text-white tracking-wide">
          {durationText}
        </span>
      </Link>

      {/* ২. ভিডিওর বিস্তারিত তথ্য (টাইটেল, চ্যানেল, ভিউজ) */}
      <div className="flex gap-3 px-1">

        {/* চ্যানেল অ্যাভাটার */}
        <Link href="#" className="flex-shrink-0 h-9 w-9 rounded-full overflow-hidden bg-[#272727]">
          <img
            src={avatar}
            alt={channelName}
            className="h-full w-full object-cover"
          />
        </Link>

        {/* টেক্সট কন্টেন্ট */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* ভিডিও টাইটেল (২ লাইনের পর ডট ডট আসবে) */}
          <Link href={`/watch/${_id}`} className="text-white hover:text-white font-semibold text-[15px] leading-tight line-clamp-2 mb-1 tracking-tight">
            {title}
          </Link>

          {/* চ্যানেল নাম এবং ভেরিফাইড ব্যাজ */}
          <Link href="#" className="text-[#aaa] hover:text-white text-[13px] flex items-center gap-1 transition">
            <span className="truncate">{channelName}</span>
            <HiMiniCheckCircle className="text-[#aaa] h-3.5 w-3.5 flex-shrink-0" />
          </Link>

          {/* ভিউজ এবং কতদিন আগে আপলোড হয়েছে */}
          <div className="text-[#aaa] text-[13px] flex items-center mt-0.5 whitespace-nowrap">
            <span>{views} views</span>
            <span className="mx-1.5 text-xs">•</span>
            <span>
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}