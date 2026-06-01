import { getChannelProfileData } from "@/app/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HiMiniCheckCircle } from "react-icons/hi2";
import { ChannelInfo } from "@/components/ChannelInfo"; // আগের তৈরি করা সাবস্ক্রাইব বাটনসহ কম্পোনেন্ট

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

const ChannelProfilePage = async ({ params }: ChannelPageProps) => {
  const { id } = await params;

  // ব্যাকএন্ড থেকে চ্যানেল ও তার ভিডিওর ডাটা নিয়ে আসা
  const channelData = await getChannelProfileData(id);

  if (!channelData || !channelData.profile) {
    notFound();
  }

  const { profile, videos } = channelData;

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white">
      {/* 🏞️ ১. চ্যানেলের কভার ফটো / ব্যানার এরিয়া */}
      <div className="w-full h-[150px] sm:h-[200px] md:h-[280px] bg-[#272727] overflow-hidden relative">
        <img
          src={profile.coverImage || "https://picsum.photos/id/30/1200/300"} // কভার ইমেজ না থাকলে ডামি ইমেজ
          alt={`${profile.channelName}'s Cover`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 space-y-8">
        
        {/* 👤 ২. চ্যানেল হেডার ইনফো (লোগো, নাম, সাবস্ক্রাইব বাটন) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#272727]">
          {/* আমরা আগের তৈরি করা ChannelInfo ক্লায়েন্ট কম্পোনেন্টটি এখানে রিইউজ করছি */}
          <ChannelInfo
            channelId={profile._id}
            channelName={profile.channelName || "Unknown Channel"}
            avatar={profile.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
            initialSubscribersCount={typeof profile.subscribers === 'number' ? profile.subscribers : 0}
          />
          
          {/* চ্যানেলের বায়ো/ডিসক্রিপশন (যদি থাকে) */}
          {profile.bio && (
            <p className="text-sm text-gray-400 max-w-md md:text-right mt-2 md:mt-0">
              {profile.bio}
            </p>
          )}
        </div>

        {/* 🎬 ৩. ভিডিও সেকশন ট্যাব হেড */}
        <div>
          <h3 className="text-lg font-bold border-b-2 border-white inline-block pb-2 px-1 mb-6">
            Videos
          </h3>

          {/* 🎴 ৪. এই চ্যানেলের ভিডিওগুলোর গ্রিড লেআউট */}
          {videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video: any) => (
                <Link
                  href={`/watch/${video._id}`}
                  key={video._id}
                  className="flex flex-col gap-2 group cursor-pointer"
                >
                  {/* ভিডিও থাম্বনেইল */}
                  <div className="aspect-video w-full bg-[#272727] rounded-xl overflow-hidden relative">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-200"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-[11px] px-1.5 py-0.5 rounded font-medium">
                      {video.durationText || "0:00"}
                    </span>
                  </div>

                  {/* ভিডিওর টাইটেল ও ভিউস */}
                  <div className="flex flex-col pr-2">
                    <h4 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition mb-1">
                      {video.title}
                    </h4>
                    <div className="text-xs text-[#aaa] flex flex-col gap-0.5">
                      <span>{video.views?.toLocaleString()} views</span>
                      <span>{video.createdAt ? video.createdAt.slice(0, 10) : "Recent"}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-sm">This channel hasn't uploaded any videos yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChannelProfilePage;