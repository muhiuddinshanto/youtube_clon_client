"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Label, TextField } from "@heroui/react";
import toast from "react-hot-toast";
import { HiOutlinePencilSquare, HiXMark } from "react-icons/hi2";
import type { ChannelData } from "@/app/data";
import { getAuthJwtToken } from "@/lib/auth-token";

interface ChannelEditFormProps {
  channelId: string;
  profile: ChannelData;
}

export function ChannelEditForm({ channelId, profile }: ChannelEditFormProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [channelName, setChannelName] = useState(profile.channelName || "");
  const [username, setUsername] = useState(profile.username || "");
  const [avatar, setAvatar] = useState(profile.avatar || profile.image || "");
  const [coverImage, setCoverImage] = useState(profile.coverImage || "");
  const [bio, setBio] = useState(profile.bio || "");

  const handleUpdateChannel = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelName.trim()) {
      toast.error("Channel name is required.");
      return;
    }

    if (!username.trim()) {
      toast.error("Handle is required.");
      return;
    }

    const formattedUsername = username.toLowerCase().replace(/[^a-z0-9._-]/g, "");

    setIsSaving(true);
    try {
      const token = await getAuthJwtToken();
      if (!token) {
        toast.error("Please sign in again.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/channel/${channelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: channelId,
          channelName: channelName.trim(),
          username: formattedUsername,
          avatar: avatar.trim(),
          coverImage: coverImage.trim(),
          bio: bio.trim(),
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update channel.");
      }

      toast.success(data?.message || "Channel updated successfully.");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update channel.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-10 items-center gap-2 rounded-full bg-[#272727] px-4 text-sm font-medium text-white hover:bg-[#3f3f3f]"
        >
          {isOpen ? <HiXMark className="h-5 w-5" /> : <HiOutlinePencilSquare className="h-5 w-5" />}
          {isOpen ? "Close Edit" : "Edit Channel"}
        </Button>
      </div>

      {isOpen && (
        <Form
          onSubmit={handleUpdateChannel}
          className="grid w-full grid-cols-1 gap-4 rounded-xl border border-white/10 bg-[#1c1c1e] p-4 md:grid-cols-2"
        >
          <TextField isRequired className="md:col-span-1">
            <Label className="text-xs font-medium text-gray-300">Channel Name</Label>
            <Input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white"
            />
          </TextField>

          <TextField isRequired className="md:col-span-1">
            <Label className="text-xs font-medium text-gray-300">Handle / Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white"
            />
          </TextField>

          <TextField className="md:col-span-1">
            <Label className="text-xs font-medium text-gray-300">Profile Photo URL</Label>
            <Input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white"
            />
          </TextField>

          <TextField className="md:col-span-1">
            <Label className="text-xs font-medium text-gray-300">Cover Image URL</Label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/banner.jpg"
              className="mt-1 h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white"
            />
          </TextField>

          <TextField className="md:col-span-2">
            <Label className="text-xs font-medium text-gray-300">Channel Bio</Label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-white/30"
            />
          </TextField>

          <div className="flex justify-end md:col-span-2">
            <Button
              type="submit"
              isDisabled={isSaving}
              className="h-10 rounded-xl bg-white px-6 text-xs font-bold text-black transition hover:bg-gray-200 disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save Channel"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
