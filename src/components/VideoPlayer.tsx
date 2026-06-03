"use client";

import { useEffect, useRef } from "react";

export function VideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // This useEffect ensures that when the component unmounts (e.g. user navigates away),
  // the video playback is stopped completely.
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
        videoRef.current.load();
      }
    };
  }, []);

  // When the URL changes (e.g. navigating between videos), force the video to load the new source
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      // Attempt to autoplay the new source (may be blocked by browser policies if no interaction)
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented:", error);
        });
      }
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      src={url}
      controls
      autoPlay
      className="w-full h-full object-contain"
    />
  );
}
