"use client";

import { useState } from "react";
import { TfiDownload } from "react-icons/tfi";

interface DownloadButtonProps {
  videoUrl: string;
  videoTitle: string;
}

export function DownloadButton({ videoUrl, videoTitle }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!videoUrl) return alert("Video URL not found!");
    
    setIsDownloading(true);

    try {
      // ১. ভিডিও ফাইলটি ব্যাকগ্রাউন্ডে ফেচ করা
      const response = await fetch(videoUrl);
      const blob = await response.blob(); // ফাইলটিকে Blob অবজেক্টে রূপান্তর

      // ২. ভার্চুয়াল একটি ডাউনলোডেবল লিংক তৈরি করা
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      // ফাইল নেম হিসেবে ভিডিওর টাইটেল সেট করা (এক্সটেনশন .mp4)
      a.download = `${videoTitle.replace(/[^a-zA-Z0-9 ]/g, "")}.mp4`; 
      
      // ৩. ক্লিক ট্রিগার করে ডাউনলোড শুরু করা
      document.body.appendChild(a);
      a.click();
      
      // ক্লিনিং আপ
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Could not download the video. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] px-4 py-2 rounded-full text-sm font-medium transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
        isDownloading ? "text-amber-400 border border-amber-500/30" : "text-white"
      }`}
    >
      <TfiDownload className={`h-4 w-4 ${isDownloading ? "animate-bounce" : ""}`} />
      <span>{isDownloading ? "Downloading..." : "Download"}</span>
    </button>
  );
}