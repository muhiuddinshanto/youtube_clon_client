
export const getVideosData = async () => {
const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos`, { cache: "no-store" });
const data = await res.json();
return data;
   
};


export const getVideosDataById = async (id: string) => {
const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos/${id}`, { cache: "no-store" });
const data = await res.json();
return data;
   
};


export async function getChannelProfileData(channelId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/channels/${channelId}`, {
      cache: "no-store", 
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch channel profile:", error);
    return null;
  }
}