import { getChannelProfileData, type VideoData } from "@/app/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChannelInfo } from "@/components/ChannelInfo";
import { CreateChannelForm } from "@/components/CreateChannelForm"; 
import { QuickVideoPost } from "@/components/QuickVideoPost";     
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

const ChannelProfilePage = async ({ params }: ChannelPageProps) => {
  const { id } = await params;
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  const tokenData = session ? await auth.api.getToken({
    headers: requestHeaders,
  }) : null;

  // ব্যাকএন্ড থেকে চ্যানেল ও তার ভিডিওর ডাটা নিয়ে আসা
  const channelData = await getChannelProfileData(id, tokenData?.token);


  // যদি ডাটাবেজে ইউজার প্রোফাইলটাই এক্সিস্ট না করে
  if (!channelData || !channelData.profile) {
    notFound();
  }

  const { profile, videos } = channelData;

  // 🎯 কন্ডিশন ১: যদি ইউজারের 'channelName' সেট করা না থাকে, তবে আগে চ্যানেল খোলার ফর্ম দেখাবে
  if (!profile.channelName) {
    return (
      <div className="w-full min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
        <CreateChannelForm userId={id} />
      </div>
    );
  }

  // 🟢 কন্ডিশন ২: চ্যানেল নাম থাকলে অরিজিনাল পেজটি লোড হবে
  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white">
      {/* 🏞️ ১. চ্যানেলের কভার ফটো / ব্যানার এরিয়া */}
      <div className="w-full h-[150px] sm:h-[200px] md:h-[280px] bg-[#272727] overflow-hidden relative">
        <img
          src={profile.coverImage || "https://picsum.photos/id/30/1200/300"}
          alt={`${profile.channelName}'s Cover`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mx-auto max-w-[1300px] space-y-8 px-1 py-6 sm:px-4 md:px-6">
        
        {/* 👤 ২. চ্যানেল হেডার ইনফো */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#272727]">
          <ChannelInfo
            channelId={(profile._id ?? id).toString()} // সেফটির জন্য টোস্ট্রিং করা হলো
            channelName={profile.channelName ?? "Unknown Channel"}
            avatar={profile.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
            initialSubscribersCount={typeof profile.subscribers === 'number' ? profile.subscribers : 0}
          />
          
          {profile.bio && (
            <p className="text-sm text-gray-400 max-w-md md:text-right mt-2 md:mt-0">
              {profile.bio}
            </p>
          )}
        </div>

        {/* 🚀 ৩. ভিডিও পোস্ট করার লিংক সেকশন */}
        <QuickVideoPost userId={id} />

        {/* 🎬 ৪. ভিডিও সেকশন */}
        <div>
          <h3 className="text-lg font-bold border-b-2 border-white inline-block pb-2 px-1 mb-6">
            Videos
          </h3>

          {/* 🎴 ৫. ভিডিও গ্রিড */}
          {videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video: VideoData) => {
                // 🛠️ ডেট অবজেক্ট ক্র্যাশ বাগ ফিক্সিং
                let formattedDate = "Recent";
                if (video.createdAt) {
                  const dateObj = new Date(video.createdAt);
                  formattedDate = isNaN(dateObj.getTime()) 
                    ? "Recent" 
                    : dateObj.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
                }

                return (
                  // ⚠️ আপনার প্রজেক্টের ওয়াচ রাউট স্ট্রাকচার অনুযায়ী href মিলিয়ে নিন (যেমন: /videos/${video._id} অথবা /watch/${video._id})
                  <Link
                    href={`/watch/${video._id.toString()}`} 
                    key={video._id.toString()}
                    className="flex flex-col gap-2 group cursor-pointer"
                  >
                    <div className="aspect-video w-full bg-[#272727] rounded-xl overflow-hidden relative">
                      <img
                        src={video.thumbnailUrl || "https://picsum.photos/id/42/640/360"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-200"
                      />
                      <span className="absolute bottom-2 right-2 bg-black/80 text-[11px] px-1.5 py-0.5 rounded font-medium">
                        {video.durationText || "0:00"}
                      </span>
                    </div>

                    <div className="flex flex-col pr-2">
                      <h4 className="text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition mb-1">
                        {video.title}
                      </h4>
                      <div className="text-xs text-[#aaa] flex flex-col gap-0.5">
                        <span>{video.views?.toLocaleString() || 0} views</span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-sm">This channel hasn&apos;t uploaded any videos yet. Use the upload panel above to publish your first video!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChannelProfilePage;
