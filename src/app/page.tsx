import { VideoCard } from "@/components/VideoCard";
import Image from "next/image";
import { getVideosData } from "./data";

export default async function Home() {

  

  const videosData = await getVideosData();



  return (
    <>

   

    <div className="grid grid-cols-3 gap-4">
     {
      videosData.map((video:any) => (
        <VideoCard key={video._id} video={video} />
      ))
     }
    </div>
    </>
  );
}
