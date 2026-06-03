"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Form, TextField, Label } from "@heroui/react";
import toast from "react-hot-toast";
import { HiCloudArrowUp } from "react-icons/hi2";
import { getAuthJwtToken } from "@/lib/auth-token";

export function OpenUploadForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // স্টেটসমূহ
  const [channelName, setChannelName] = useState("");
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelName.trim()) return toast.error("Please enter a Channel Name!");
    if (!title.trim()) return toast.error("Please enter a Video Title!");
    if (!videoUrl.trim()) return toast.error("Please enter a Video Link!");

    setLoading(true);
    try {
      const token = await getAuthJwtToken();
      if (!token) {
        toast.error("Please sign in before publishing.");
        return;
      }

      const username = channelName.toLowerCase().replace(/[^a-z0-9]/g, "");
      // ১. প্রথমে আপনার এক্সপ্রেস সার্ভারে চ্যানেল ডাটা আপডেট বা ক্রিয়েট করবে
      const channelRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/channel/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, channelName, username, bio }),
      });

      if (!channelRes.ok) throw new Error("Failed to create channel");

      // ২. চ্যানেল সফলভাবে তৈরি হলে সাথে সাথে ভিডিওর লিংকটি পোস্ট করবে
      const videoRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/video/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, title, description, videoUrl, thumbnailUrl }),
      });

      if (videoRes.ok) {
        toast.success("Channel created & video published successfully!");
        router.refresh(); // পেজ রিফ্রেশ করলে ডাটা চলে আসবে এবং ওরিজিনাল ইউজার প্রোফাইল ভিউ লোড হবে
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
    <div className="w-full max-w-2xl mx-auto bg-[#1c1c1e] p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl space-y-6 my-12">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-3 bg-red-600/20 text-red-500 rounded-xl">
          <HiCloudArrowUp className="text-2xl" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Setup Channel & Share First Video</h1>
          <p className="text-xs text-gray-400">এই আইডিতে কোনো চ্যানেল নেই। যেকোনো নাম, টেক্সট ও লিংক দিয়ে সরাসরি পোস্ট করুন।</p>
        </div>
      </div>

      <Form onSubmit={handlePublish} className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {/* চ্যানেল সেকশন */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
          <span className="md:col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Channel Profile Info</span>
          <TextField isRequired>
            <Label className="text-sm text-gray-300 font-medium">Channel Name</Label>
            <Input
              placeholder="e.g., Mohiuddin Shanto Vlogs"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-11 text-white px-3"
            />
          </TextField>
          <TextField>
            <Label className="text-sm text-gray-300 font-medium">Channel Bio</Label>
            <Input
              placeholder="e.g., Digital Marketer & Developer"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-11 text-white px-3"
            />
          </TextField>
        </div>

        {/* ভিডিও সেকশন */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
          <span className="md:col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Video / Content Details</span>
          <TextField isRequired className="md:col-span-2">
            <Label className="text-sm text-gray-300 font-medium">Video Title</Label>
            <Input
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-11 text-white px-3"
            />
          </TextField>
          <TextField isRequired>
            <Label className="text-sm text-gray-300 font-medium">Video Source URL / Link</Label>
            <Input
              placeholder="https://example.com/video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-11 text-white px-3"
            />
          </TextField>
          <TextField>
            <Label className="text-sm text-gray-300 font-medium">Thumbnail Image URL</Label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl h-11 text-white px-3"
            />
          </TextField>
          <TextField className="md:col-span-2">
            <Label className="text-sm text-gray-300 font-medium">Description</Label>
            <textarea
              placeholder="Tell viewers more about this content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white h-24 outline-none text-sm resize-none"
            />
          </TextField>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" isDisabled={loading} className="w-full bg-white text-black font-bold h-11 rounded-xl hover:bg-gray-200 transition">
            {loading ? "Publishing..." : "Create & Publish"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
