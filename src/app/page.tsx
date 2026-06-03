import { VideoCard } from "@/components/VideoCard";
import { getVideosData } from "./data";

interface HomeProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { search = "" } = await searchParams;
  const videosData = await getVideosData();
  const query = search.trim().toLowerCase();

  const filteredVideos = query
    ? videosData.filter((video) => {
        const searchableText = [
          video.title,
          video.description,
          video.category,
          video.channel?.channelName,
          video.channel?.name,
          ...(video.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
    : videosData;

  return (
    <div className="space-y-6">
      {query && (
        <div className="border-b border-[#272727] pb-4">
          <h1 className="text-xl font-bold">Search results for &quot;{search}&quot;</h1>
          <p className="text-sm text-[#aaa]">{filteredVideos.length} videos found</p>
        </div>
      )}

      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold">No videos found</h2>
          <p className="mt-2 max-w-sm text-sm text-[#aaa]">
            Upload a video from your channel page or try another search.
          </p>
        </div>
      )}
    </div>
  );
}
