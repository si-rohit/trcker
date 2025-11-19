"use client";
import { useRef, useState } from "react";

export default function MobileCamera({ handleClose, form, setForm, clickButton }) {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [streamStarted, setStreamStarted] = useState(false);

  const startCamera = async () => {
    let constraints = {
        video: true   // default for laptop/PC
    };

    // if mobile then use rear camera
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMobile) {
        constraints = {
        video: { facingMode: "environment" }
        };
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        setStreamStarted(true);
    } catch (err) {
        alert("Camera not available on this device!");
        console.log(err);
    }
    };


  const capturePhoto = () => {
    const canvas = photoRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });

      setForm({ ...form, [clickButton]: file });
      handleClose();
    }, "image/jpeg");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
      
      {!streamStarted ? (
        <button 
          onClick={startCamera}
          className="bg-orange-600 text-white px-6 py-3 text-lg rounded-lg"
        >
          Open Camera
        </button>
      ) : (
        <>
          <video ref={videoRef} autoPlay className="w-[90%] rounded-lg shadow-lg" />

          <canvas ref={photoRef} className="hidden"></canvas>

          <button 
            onClick={capturePhoto}
            className="bg-green-600 mt-6 text-white px-6 py-3 text-lg rounded-lg"
          >
            Capture Photo
          </button>

          <button 
            onClick={handleClose}
            className="bg-red-600 mt-4 text-white px-6 py-3 text-lg rounded-lg"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}
