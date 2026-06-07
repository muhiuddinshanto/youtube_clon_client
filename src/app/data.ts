export interface ChannelData {
  _id?: string;
  channelName?: string | null;
  username?: string;
  name?: string;
  avatar?: string;
  image?: string;
  coverImage?: string;
  bio?: string;
  subscribers?: number;
}

export interface VideoData {
  _id: string;
  userId?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationText?: string;
  category?: string;
  tags?: string[];
  views?: number;
  likes?: string[];
  dislikes?: string[];
  createdAt?: string | Date;
  watchedAt?: string;
  channel?: ChannelData;
  message?: string; // ব্যাকএন্ড থেকে কোনো মেসেজ আসলে হ্যান্ডেল করার জন্য
}

// ১. সব ভিডিও ডাটা আনার ফাংশন
export const getVideosData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos`, { cache: "no-store" });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data as VideoData[];
  } catch (error) {
    console.error("Error fetching all videos:", error);
    return [];
  }
};

// ২. নির্দিষ্ট ভিডিও আইডি দিয়ে ডাটা আনার ফিক্সড ফাংশন 🎯
export const getVideosDataById = async (id: string, token?: string) => {
  try {
    // ⚡ হেডার অবজেক্ট তৈরি
    const headersInit: HeadersInit = {
      "Content-Type": "application/json",
    };

    // 🔑 টোকেন থাকলেই কেবল হেডার সেট হবে, না থাকলে গেস্ট হিসেবে এপিআই হিট হবে
    if (token && token.trim() !== "") {
      headersInit["authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos/${id}`, {
      cache: "no-store",
      headers: headersInit, // ডাইনামিক হেডার
    });

    if (!res.ok) {
      console.error(`Fetching video failed with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data as VideoData;
  } catch (error) {
    console.error(`Error inside getVideosDataById for ID ${id}:`, error);
    return null;
  }
};

// ৩. চ্যানেল প্রোফাইল ডাটা আনার ফাংশন
export async function getChannelProfileData(id: string, token?: string) {
  try {
    const headersInit: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token && token.trim() !== "") {
      headersInit["authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/channels/${id}`, {
      cache: 'no-store',
      headers: headersInit,
    });
    
    if (res.status === 404) {
      return {
        profile: { _id: id, channelName: null }, 
        videos: []
      };
    }

    if (!res.ok) return null;
    return await res.json() as { profile: ChannelData; videos: VideoData[] };
  } catch (error) {
    console.error("Error fetching channel data:", error);
  
    return {
      profile: { _id: id, channelName: null },
      videos: []
    };
  }
}
