"use client";
import React, { useRef, useState, useEffect } from "react";

const TakePhoto = ({ handleClose, form, setForm ,clickButton }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // console.log(type)
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;

          // videoRef.current.play() optional hai
          videoRef.current.play().catch((err) => {
            console.warn("Autoplay prevented:", err);
          });
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);


  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");

    // Set canvas same size as video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.png`, {
            type: "image/png",
          });
          
          setForm((prev) => ({
            ...prev,
            [clickButton]: file,
          }));

          // console.log("Updated form:", form);
          handleClose();
          // setOpenTakePhoto(false);
        }
      },
      "image/png",
      1
    );
  };

  return (
    <div className="relative rounded-lg flex flex-col items-center justify-center bg-black bg-opacity-90 z-50">
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={() => handleClose()}
      >
        ✖
      </button>

      {/* Live Video Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-[400px] h-[300px] bg-black rounded-lg"
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
        onClick={capturePhoto}
      >
        📸 Capture
      </button>
    </div>
  );
};

export default TakePhoto;
