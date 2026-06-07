"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Label, TextField } from "@heroui/react";
import toast from "react-hot-toast";
import { HiOutlinePencilSquare, HiOutlineTrash, HiXMark } from "react-icons/hi2";
import type { VideoData } from "@/app/data";
import { getAuthJwtToken } from "@/lib/auth-token";

interface VideoOwnerActionsProps {
  video: VideoData;
  currentUserId?: string;
}

export function VideoOwnerActions({ video, currentUserId }: VideoOwnerActionsProps) {
  const router = useRouter();
  const isOwner = Boolean(currentUserId && video.userId && currentUserId === video.userId);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initialTags = useMemo(() => video.tags?.join(", ") || "", [video.tags]);
  const [title, setTitle] = useState(video.title || "");
  const [description, setDescription] = useState(video.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnailUrl || "");
  const [category, setCategory] = useState(video.category || "Education");
  const [tags, setTags] = useState(initialTags);

  if (!isOwner) {
    return null;
  }

  const getTokenOrThrow = async () => {
    const token = await getAuthJwtToken();
    if (!token) {
      throw new Error("Please sign in again.");
    }

    return token;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Video title is required.");
      return;
    }

    setIsSaving(true);
    try {
      const token = await getTokenOrThrow();
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/video/${video._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: currentUserId,
          title: title.trim(),
          description,
          thumbnailUrl,
          category,
          tags: tagsArray,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update video.");
      }

      toast.success(data?.message || "Video updated successfully.");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update video.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const shouldDelete = window.confirm("Delete this video permanently?");
    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = await getTokenOrThrow();
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/api/video/${video._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: currentUserId }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete video.");
      }

      toast.success(data?.message || "Video deleted successfully.");
      router.push(`/channel/${currentUserId}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete video.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => setIsEditing((value) => !value)}
          className="flex h-9 items-center gap-2 rounded-full bg-[#272727] px-4 text-sm font-medium text-white hover:bg-[#3f3f3f]"
        >
          {isEditing ? <HiXMark className="h-5 w-5" /> : <HiOutlinePencilSquare className="h-5 w-5" />}
          {isEditing ? "Cancel Edit" : "Edit Video"}
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          isDisabled={isDeleting}
          className="flex h-9 items-center gap-2 rounded-full bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70"
        >
          <HiOutlineTrash className="h-5 w-5" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      {isEditing && (
        <Form onSubmit={handleUpdate} className="grid w-full grid-cols-1 gap-4 rounded-xl border border-white/10 bg-[#1c1c1e] p-4 md:grid-cols-4">
          <TextField isRequired className="flex flex-col md:col-span-4">
            <Label className="mb-1 text-xs text-gray-300">Video Title</Label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-white/30 focus:outline-none"
            />
          </TextField>

          <div className="flex flex-col md:col-span-4">
            <label className="mb-1 text-xs text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white focus:border-white/30 focus:outline-none"
            />
          </div>

          <TextField className="flex flex-col md:col-span-2">
            <Label className="mb-1 text-xs text-gray-300">Thumbnail Image URL</Label>
            <input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-white/30 focus:outline-none"
            />
          </TextField>

          <div className="flex flex-col md:col-span-1">
            <label className="mb-1 text-xs text-gray-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-[#2c2c2e] px-2 text-sm text-white focus:outline-none"
            >
              <option value="Education">Education</option>
              <option value="Tech">Tech</option>
              <option value="Travel">Travel</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <TextField className="flex flex-col md:col-span-1">
            <Label className="mb-1 text-xs text-gray-300">Tags</Label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nextjs, react"
              className="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:border-white/30 focus:outline-none"
            />
          </TextField>

          <div className="flex justify-end md:col-span-4">
            <Button
              type="submit"
              isDisabled={isSaving}
              className="h-10 rounded-xl bg-white px-6 text-xs font-bold text-black transition hover:bg-gray-200 disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
