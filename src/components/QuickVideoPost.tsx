"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, TextField, Label } from "@heroui/react";
import toast from "react-hot-toast";
import { HiPlusCircle } from "react-icons/hi2";
import { getAuthJwtToken } from "@/lib/auth-token";

export function QuickVideoPost({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 🎯 ডাটাবেজের সব ফিল্ডের জন্য স্টেট ডিক্লেয়ারেশন
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // New
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [durationText, setDurationText] = useState(""); 
  const [category, setCategory] = useState("Education"); // New
  const [tags, setTags] = useState(""); // New

  const handlePostVideo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !videoUrl.trim()) {
      return toast.error("Title and Video URL are required!");
    }

    // ট্যাগগুলোকে কমা (,) দিয়ে স্প্লিট করে অ্যারেতে কনভার্ট করা
    const tagsArray = tags
      ? tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean)
      : [];

    setLoading(true);
    try {
      const token = await getAuthJwtToken();
      if (!token) {
        toast.error("Please sign in before uploading a video.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/video/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          userId, 
          title, 
          description, //
          videoUrl, 
          thumbnailUrl,
          durationText: durationText || "0:00",
          category, //
          tags: tagsArray, //
          views: 0, // ডিফল্ট ভিউজ ০ দিয়ে শুরু হবে
          isPublished: true // অটো পাবলিশড
        }),
      });

      if (res.ok) {
        toast.success("Video uploaded successfully!");
        // ফর্ম রিসেট
        setTitle("");
        setDescription("");
        setVideoUrl("");
        setThumbnailUrl("");
        setDurationText("");
        setCategory("Education");
        setTags("");
        setIsOpen(false);
        router.refresh(); 
      } else {
        toast.error("Failed to upload video.");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-md font-bold text-white">Channel Dashboard</h4>
          <p className="text-xs text-gray-400">নতুন কন্টেন্ট বা ভিডিও লিংক পাবলিশ করুন</p>
        </div>
        <Button 
          onClick={() => setIsOpen(!isOpen)} 
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl px-4 py-2 flex items-center gap-1"
        >
          <HiPlusCircle className="text-lg" />
          {isOpen ? "Close Panel" : "Upload Video"}
        </Button>
      </div>

      {isOpen && (
        <Form onSubmit={handlePostVideo} className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/5 w-full">
          
          {/* Video Title */}
          <TextField isRequired className="md:col-span-4 flex flex-col">
            <Label className="text-xs text-gray-300 mb-1">Video Title</Label>
            <input
              type="text"
              placeholder="e.g., Next.js 15 Full Tutorial"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 text-sm focus:outline-none focus:border-white/30"
            />
          </TextField>

          {/* Video Description (New) */}
          <div className="md:col-span-4 flex flex-col">
            <label className="text-xs text-gray-300 mb-1">Description</label>
            <textarea
              placeholder="Write video description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          {/* Video Link */}
          <TextField isRequired className="md:col-span-2 flex flex-col">
            <Label className="text-xs text-gray-300 mb-1">Video Source URL (MP4 / Link)</Label>
            <input
              type="text"
              placeholder="https://example.com/video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 text-sm"
            />
          </TextField>

          {/* Thumbnail */}
          <TextField className="md:col-span-2 flex flex-col">
            <Label className="text-xs text-gray-300 mb-1">Thumbnail Image URL</Label>
            <input
              type="text"
              placeholder="https://picsum.photos/id/237/640/360"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 text-sm"
            />
          </TextField>

          {/* Category (New Selection) */}
          <div className="flex flex-col md:col-span-1">
            <label className="text-xs text-gray-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#2c2c2e] border border-white/10 rounded-xl h-10 text-white px-2 text-sm focus:outline-none"
            >
              <option value="Education">Education</option>
              <option value="Tech">Tech</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          {/* Duration */}
          <TextField className="md:col-span-1 flex flex-col">
            <Label className="text-xs text-gray-300 mb-1">Duration (MM:SS)</Label>
            <input
              type="text"
              placeholder="e.g., 12:45"
              value={durationText}
              onChange={(e) => setDurationText(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 text-sm"
            />
          </TextField>

          {/* Tags (New Input) */}
          <TextField className="md:col-span-2 flex flex-col">
            <Label className="text-xs text-gray-300 mb-1">Tags (Comma separated)</Label>
            <input
              type="text"
              placeholder="nextjs, react, webdev"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 text-sm"
            />
          </TextField>

          {/* Submit Button */}
          <div className="md:col-span-4 flex justify-end mt-2">
            <Button type="submit" isDisabled={loading} className="bg-white text-black font-bold h-10 px-6 rounded-xl hover:bg-gray-200 text-xs transition">
              {loading ? "Uploading..." : "Publish Video"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
