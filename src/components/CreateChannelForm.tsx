"use client";

import { useState } from "react";
import { Button, Input, Form, TextField, Label } from "@heroui/react";
import toast from "react-hot-toast";
import { HiTv } from "react-icons/hi2";
import { getAuthJwtToken } from "@/lib/auth-token";

export function CreateChannelForm({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);

    const [channelName, setChannelName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const [coverImage, setCoverImage] = useState("");

    const handleCreateChannel = async (e: React.FormEvent) => {
        // 🛑 এটি অত্যন্ত গুরুত্বপূর্ণ যাতে ফর্ম ব্রাউজারকে রিলোড বা ব্লক না করে
        e.preventDefault();

        if (!channelName.trim()) return toast.error("Channel Name is required!");
        if (!username.trim()) return toast.error("Username is required!");

        const formattedUsername = username.toLowerCase().replace(/\s+/g, "");

        setLoading(true);
        try {
            const token = await getAuthJwtToken();
            if (!token) {
                toast.error("Please sign in before creating a channel.");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/channel/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId,
                    channelName,
                    username: formattedUsername,
                    bio,
                    avatar: avatar.trim() || "https://randomuser.me/api/portraits/men/32.jpg",
                    coverImage: coverImage.trim() || "https://picsum.photos/id/0/1200/300"
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Channel created successfully! Redirecting...");

                // 🎯 Next.js router এর ক্যাশ এড়াতে সরাসরি হার্ড রিডাইরেক্ট (Hard Redirect)
                // এটি ডাটাবেজ থেকে ফ্রেশ ডাটা টেনে এনে আপনার নতুন চ্যানেল ভিউ ওপেন করবে
                setTimeout(() => {
                    window.location.assign(`/channel/${userId}`);
                }, 1000); // ১ সেকেন্ড টোস্ট দেখানোর জন্য ওয়েট করবে

            } else {
                toast.error(data.message || "Failed to create channel.");
            }
        } catch (err) {
            console.error("Client Error:", err);
            toast.error("Something went wrong with the server!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl bg-[#1c1c1e] p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6 my-12 mx-auto">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-3 bg-red-600/20 text-red-500 rounded-xl">
                    <HiTv className="text-2xl" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">Setup Your Channel</h1>
                    <p className="text-xs text-gray-400">আপনার প্রফেশনাল ডাটাবেজ প্রোফাইলটি কমপ্লিট করুন</p>
                </div>
            </div>

            {/* ⚠️ নিশ্চিত করুন এখানে onSubmit হ্যান্ডলারটি ঠিকঠাক অ্যাসাইন করা আছে */}
            <Form onSubmit={handleCreateChannel} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

                <TextField isRequired className="md:col-span-2">
                    <Label className="text-xs text-gray-300 font-medium">Channel Name</Label>
                    <Input
                        placeholder="e.g., Tech with Shanto"
                        value={channelName}
                        onChange={(e) => setChannelName(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 w-full mt-1"
                    />
                </TextField>

                <TextField isRequired className="md:col-span-2">
                    <Label className="text-xs text-gray-300 font-medium">Handle / Username</Label>
                    <Input
                        placeholder="e.g., techshanto"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 w-full mt-1"
                    />
                </TextField>

                <TextField>
                    <Label className="text-xs text-gray-300 font-medium">Profile Photo URL (Avatar)</Label>
                    <Input
                        placeholder="https://example.com/avatar.jpg"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 w-full mt-1"
                    />
                </TextField>

                <TextField>
                    <Label className="text-xs text-gray-300 font-medium">Cover Image URL (Banner)</Label>
                    <Input
                        placeholder="https://example.com/banner.jpg"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 w-full mt-1"
                    />
                </TextField>

                <TextField className="md:col-span-2">
                    <Label className="text-xs text-gray-300 font-medium">Channel Bio</Label>
                    <Input
                        placeholder="e.g., Full‑stack developer simplifying coding for everyone."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl h-10 text-white px-3 w-full mt-1"
                    />
                </TextField>

                <div className="md:col-span-2 mt-2">
                    <Button
                        type="submit"
                        isPending={loading} // 👈 isLoading এর বদলে isPending ব্যবহার করুন
                        className="w-full bg-white text-black font-bold h-11 rounded-xl hover:bg-gray-200 transition"
                    >
                        {loading ? "Launching Channel..." : "Create & Launch Channel"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}
