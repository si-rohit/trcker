"use client";
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function TakePhoto({ handleClose, setForm, clickButton }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start HLS video stream
  useEffect(() => {
    const startStream = async () => {
      try {
        const res = await fetch("/api/stream"); // Your backend RTSP → HLS API
        const data = await res.json();
        const streamUrl = data.url; // example: /hls/stream.m3u8

        if (videoRef.current) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(videoRef.current);
          } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = streamUrl;
          }
        }
      } catch (err) {
        console.error("Stream error:", err);
      }
    };

    startStream();
  }, []);

  // Capture photo from video
  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `${clickButton}_${Date.now()}.jpg`, { type: "image/jpeg" });
          setForm((prev) => ({ ...prev, [clickButton]: file }));
          handleClose(); // close modal after capture
        }
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="relative flex items-center justify-center bg-black/80 z-50">
      <div className="bg-gray-900 p-4 rounded-lg text-white w-[420px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Capture Photo</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">✖</button>
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-md bg-black"
        />

        <canvas ref={canvasRef} className="hidden" />

        <button
          onClick={handleCapture}
          className="mt-4 w-full bg-orange-600 hover:bg-orange-700 py-2 rounded-md font-semibold"
        >
          📸 Capture
        </button>
      </div>
    </div>
  );
}
