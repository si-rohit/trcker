"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchStream = async () => {
      const res = await fetch("/api/stream");
      const data = await res.json();
      const streamUrl = data.url;

      if (videoRef.current) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);
        } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
          videoRef.current.src = streamUrl;
        }
      }
    };

    fetchStream();
  }, []);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      style={{ width: "600px", height: "400px", background: "black" }}
    />
  );
};

export default VideoPlayer;
