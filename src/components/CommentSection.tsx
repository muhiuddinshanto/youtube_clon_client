"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { getAuthJwtToken } from "@/lib/auth-token";
import toast from "react-hot-toast";

interface Comment {
  _id: string;
  videoId: string;
  userId: string;
  text: string;
  createdAt: string;
  user?: {
    channelName?: string;
    avatar?: string;
  };
}

export function CommentSection({ videoId }: { videoId: string }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos/${videoId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    
    if (!userId) {
      toast.error("Please sign in to comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getAuthJwtToken();
      if (!token) throw new Error("Please sign in again.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/videos/${videoId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, text: newComment }),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      setNewComment("");
      // Refresh comments to show the new one
      fetchComments();
      toast.success("Comment added!");
    } catch (error) {
      console.error("Post comment error:", error);
      toast.error("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border-t border-[#272727] pt-6">
      <h3 className="text-lg font-bold mb-4">{comments.length} Comments</h3>
      
      {/* Comment Input Section */}
      <div className="flex gap-4 mb-8">
        <div className="h-10 w-10 rounded-full bg-[#272727] overflow-hidden flex-shrink-0">
          {session?.user?.image ? (
            <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
              {session?.user?.name ? session.user.name[0].toUpperCase() : "U"}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={userId ? "Add a comment..." : "Sign in to add a comment..."}
            disabled={!userId || isSubmitting}
            className="w-full bg-transparent border-b border-[#272727] focus:border-white outline-none py-1 text-sm transition text-white disabled:opacity-50"
          />
          {newComment.trim().length > 0 && (
            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => setNewComment("")}
                className="px-4 py-2 hover:bg-[#272727] rounded-full text-sm font-medium transition"
              >
                Cancel
              </button>
              <button 
                onClick={handlePostComment}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-sm font-medium transition disabled:opacity-50 text-white"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-[#272727] overflow-hidden flex-shrink-0">
                <img 
                  src={comment.user?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">
                    {comment.user?.channelName || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-line">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500">No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  );
}
