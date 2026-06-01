import { getVideosDataById, getVideosData } from "@/app/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LikeSection } from "@/components/LikeSection";
import { ShareButton } from "@/components/ShareButton";
import { DownloadButton } from "@/components/DownloadButton";
import { ChannelInfo } from "@/components/ChannelInfo"; // 👈 নতুন চ্যানেল ইনফো কম্পোনেন্ট
import { HiMiniCheckCircle } from "react-icons/hi2";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

const WatchDetailsPage = async ({ params }: WatchPageProps) => {
  const { id } = await params;

  // ১. কারেন্ট ভিডিওর ডাটা আনা
  const videoData = await getVideosDataById(id);

  // ২. সাজেশনের জন্য ডাটাবেজের সব ভিডিওর ডাটা আনা
  const allVideos = await getVideosData();

  if (!videoData) {
    notFound();
  }

  // ৩. ফিল্টারিং: কারেন্ট ভিডিও বাদে সাজেস্টেড ভিডিওর লিস্ট
  const suggestedVideos = allVideos?.filter((vid: any) => vid._id !== id) || [];

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white p-4 md:p-6">
      <div className="max-w-[1750px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 👈 বাম পাশের মেইন ভিডিও এবং ডিটেইলস এরিয়া */}
        <div className="lg:col-span-2 space-y-4">

          {/* 🎬 ভিডিও প্লেয়ার */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-[#272727]">
            <video
              src={videoData.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>

          {/* 📌 ভিডিও টাইটেল */}
          <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-snug">
            {videoData.title}
          </h1>

          {/* 👤 চ্যানেল ইনফো এবং বাটন গ্রুপ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-[#272727] pb-4">
            
            {/* 🎯 ফিক্স: পুরনো হার্ডকোডেড কোড সরিয়ে এই একটি কম্পোনেন্টে লোগো, নাম, কাউন্ট ও বাটন গোছানো হলো */}
            <ChannelInfo 
              channelId={videoData.channel?._id || videoData.userId}
              channelName={videoData.channel?.channelName}
              avatar={videoData.channel?.avatar}
              initialSubscribersCount={typeof videoData.channel?.subscribers === 'number' ? videoData.channel.subscribers : 0}
            />

            {/* ডান পাশের ইন্টারঅ্যাক্টিভ বাটন গ্রুপ */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <LikeSection
                videoId={videoData._id}
                initialLikes={videoData.likes || []}
                initialDislikes={videoData.dislikes || []}
                userId="64a7b1e2c9e8a4b3d1234567" // আপনার লগইন করা ডামি ইউজারের আইডি
              />

              <ShareButton videoId={videoData._id} />

              <DownloadButton
                videoUrl={videoData.videoUrl}
                videoTitle={videoData.title}
              />
            </div>
          </div>

          {/* 📝 ডেসক্রিপশন বক্স */}
          <div className="bg-[#272727] hover:bg-[#3f3f3f] p-4 rounded-xl text-sm transition space-y-2">
            <div className="font-bold flex gap-3">
              <span>{videoData.views?.toLocaleString()} views</span>
              <span>{videoData.createdAt ? videoData.createdAt.slice(0, 10) : "Recent"}</span>
              <span className="text-blue-400 font-normal">#{videoData.category}</span>
            </div>
            <p className="text-gray-200 whitespace-pre-line leading-relaxed">
              {videoData.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {videoData.tags?.map((tag: string, index: number) => (
                <span key={index} className="text-blue-400 text-xs hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 👉 ডান পাশের সাইডবার */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white mb-3">Up next</h3>

          {suggestedVideos.length > 0 ? (
            suggestedVideos.map((suggestedVideo: any) => (
              <Link
                href={`/watch/${suggestedVideo._id}`}
                key={suggestedVideo._id}
                className="flex gap-2 group cursor-pointer"
              >
                <div className="w-[168px] h-[94px] flex-shrink-0 bg-[#272727] rounded-lg overflow-hidden relative">
                  <img
                    src={suggestedVideo.thumbnailUrl}
                    alt={suggestedVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded font-medium">
                    {suggestedVideo.durationText || "0:00"}
                  </span>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-white line-clamp-2 leading-tight tracking-tight mb-1 group-hover:text-blue-400 transition">
                    {suggestedVideo.title}
                  </h4>
                  <span className="text-xs text-[#aaa] flex items-center gap-1">
                    {suggestedVideo.channel?.channelName || "Unknown Channel"}
                    <HiMiniCheckCircle className="h-3 w-3" />
                  </span>
                  <span className="text-xs text-[#aaa] mt-0.5">
                    {suggestedVideo.views ? `${(suggestedVideo.views / 1000).toFixed(1)}K` : "0"} views
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No other videos found.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default WatchDetailsPage;