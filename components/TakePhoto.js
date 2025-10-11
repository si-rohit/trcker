// "use client";
// import React, { useRef, useState, useEffect } from "react";

// const TakePhoto = ({ handleClose, form, setForm ,clickButton }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   // console.log(type)
//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const mediaStream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode: "environment" },
//           audio: false,
//         });

//         console.log(mediaStream);

//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;

//           // videoRef.current.play() optional hai
//           videoRef.current.play().catch((err) => {
//             console.warn("Autoplay prevented:", err);
//           });
//         }
//       } catch (err) {
//         console.error("Camera error:", err);
//       }
//     };

//     startCamera();

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);


//   const capturePhoto = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (!video || !canvas) return;

//     const context = canvas.getContext("2d");

//     // Set canvas same size as video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob(
//       (blob) => {
//         if (blob) {
//           const file = new File([blob], `photo_${Date.now()}.png`, {
//             type: "image/png",
//           });
          
//           setForm((prev) => ({
//             ...prev,
//             [clickButton]: file,
//           }));

//           // console.log("Updated form:", form);
//           handleClose();
//           // setOpenTakePhoto(false);
//         }
//       },
//       "image/png",
//       1
//     );
//   };

//   return (
//     <div className="relative rounded-lg flex flex-col items-center justify-center bg-black bg-opacity-90 z-50">
//       <button
//         className="absolute top-4 right-4 text-white text-2xl"
//         onClick={() => handleClose()}
//       >
//         ✖
//       </button>

//       {/* Live Video Preview */}
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         className="w-[400px] h-[300px] bg-black rounded-lg"
//       />

//       {/* Hidden canvas for capture */}
//       <canvas ref={canvasRef} className="hidden" />

//       <button
//         className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full"
//         onClick={capturePhoto}
//       >
//         📸 Capture
//       </button>
//     </div>
//   );
// };

// rtsp://admin:hariom321@192.168.1.82:554/stream1
// rtsp://admin:123456@192.168.1.122:554/cam/realmonitor?channel=1&subtype=0

// rtsp://admin:123456@192.168.1.122:554/cam/realmonitor?channel=1&subtype=1
// rtsp://admin:123456@192.168.1.122:554/h264/ch1/main/av_stream


// export default TakePhoto;


"use client";
import React, { useEffect, useRef, useState } from "react";

export default function TakePhoto({ handleClose, setForm, clickButton }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [selectedCam, setSelectedCam] = useState(""); // <- IMPORTANT: defined here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional: map form field -> preferred camera index (0 = first)
  const fieldToIndexMap = {
    FrontImage: 0,
    TopImage: 1,
    LoadedImage1: 2,
    LoadedImage2: 3,
    RoyaltyImage: 4,
    WeightReciept: 5,
    UnloadedImage1: 6,
    UnloadedImage2: 7,
  };

  // Helper: stop current stream if any
  const stopStream = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => {
          try { t.stop(); } catch (e) { /* ignore */ }
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch (err) {
      console.warn("stopStream error:", err);
    }
  };

  // enumerate devices and choose default based on mapping
  useEffect(() => {
    let mounted = true;
    async function initDevices() {
      setLoading(true);
      setError("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        setError("Browser does not support mediaDevices API.");
        setLoading(false);
        return;
      }

      try {
        // Request temporary permission so labels appear in enumerateDevices
        // Some browsers require permission to show device labels.
        const tmpStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
          .catch((e) => {
            // ignore permission error here, we'll handle later
            console.warn("tmp getUserMedia error (might be permission):", e);
            return null;
          });

        if (tmpStream) {
          tmpStream.getTracks().forEach((t) => t.stop());
        }

        const all = await navigator.mediaDevices.enumerateDevices();
        if (!mounted) return;
        const videoInputs = all.filter((d) => d.kind === "videoinput");
        setDevices(videoInputs);

        if (videoInputs.length === 0) {
          setError("No camera found. Connect a camera and try again.");
          setLoading(false);
          return;
        }

        // choose device according to mapping or fallback to first
        const desiredIndex = fieldToIndexMap[clickButton] ?? 0;
        const chosen = videoInputs[desiredIndex] || videoInputs[0];
        setSelectedCam(chosen.deviceId);
        setLoading(false);
      } catch (err) {
        console.error("enumerateDevices error:", err);
        setError("Failed to list camera devices.");
        setLoading(false);
      }
    }

    initDevices();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickButton]);

  // whenever selectedCam changes, start stream for that device.
  // useEffect(() => {
  //   if (!selectedCam) return;

  //   let active = true;

  //   const start = async () => {
  //     setError("");
  //     setLoading(true);

  //     // stop previous stream before requesting new one (fixes Device in use)
  //     stopStream();

  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: { deviceId: { exact: selectedCam } },
  //         audio: false,
  //       });

  //       // console.log("Stream:", stream);

  //       if (!active) {
  //         // If component unmounted while awaiting, stop tracks
  //         stream.getTracks().forEach((t) => t.stop());
  //         return;
  //       }

  //       streamRef.current = stream;
  //       // console.log("Stream tracks:", stream.getTracks());
  //       // console.log("Video tracks:", stream.getVideoTracks());

  //       if (videoRef.current) {
  //         videoRef.current.srcObject = stream;
  //         // try play (some browsers require user gesture)
  //         videoRef.current.play().catch((e) => {
  //           console.warn("video play warning:", e);
  //         });
  //       }
  //     } catch (err) {
  //       console.error("TakePhoto setup error:", err);
  //       // Distinguish common errors
  //       if (err.name === "NotAllowedError" || err.name === "SecurityError") {
  //         setError("Camera permission denied. Allow camera access and retry.");
  //       } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
  //         setError("Camera is currently in use by another app. Close other apps/tabs using camera.");
  //       } else {
  //         setError("Unable to open camera: " + (err.message || err.name));
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   start();

  //   return () => {
  //     active = false;
  //     stopStream();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedCam]);
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          // video: { facingMode: "environment" },
          video: { deviceId: { exact: selectedCam } },
          audio: false,
        });

        // console.log(mediaStream);

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
  }, [selectedCam]);


  // useEffect(() => {
  //   const startCamera = async () => {
  //     try {
  //       const mediaStream = await navigator.mediaDevices.getUserMedia({
  //         video: { facingMode: "environment" },
  //         audio: false,
  //       });

  //       if (videoRef.current) {
  //         videoRef.current.srcObject = mediaStream;

  //         // videoRef.current.play() optional hai
  //         videoRef.current.play().catch((err) => {
  //           console.warn("Autoplay prevented:", err);
  //         });
  //       }
  //     } catch (err) {
  //       console.error("Camera error:", err);
  //     }
  //   };

  //   startCamera();

  //   return () => {
  //     if (videoRef.current && videoRef.current.srcObject) {
  //       videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
  //     }
  //   };
  // }, []);

  // capture handler
  const handleCapture = async () => {
    setError("");
    try {
      if (!videoRef.current) throw new Error("Video element not ready");
      const video = videoRef.current;
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      const canvas = canvasRef.current || document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, w, h);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      if (!blob) throw new Error("Capture failed");

      const filename = `${clickButton || "photo"}_${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: "image/jpeg" });

      setForm((prev) => ({ ...prev, [clickButton]: file }));

      // stop and close
      stopStream();
      handleClose();
    } catch (err) {
      console.error("capture error:", err);
      setError("Failed to capture image: " + (err.message || err.name));
    }
  };

  const handleSelectChange = (e) => {
    setSelectedCam(e.target.value);
  };

  const handleCloseClick = () => {
    stopStream();
    handleClose();
  };



  return (
    <div className="relative rounded-lg flex flex-col items-center justify-center bg-black bg-opacity-90 z-50">
      {/* <div className="absolute inset-0 bg-black/60" onClick={handleCloseClick} /> */}
      <div className="relative z-10 w-full max-w-md bg-gray-900 p-4 rounded-lg text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Capture: {clickButton}</h3>
          <div>
            <button onClick={handleCloseClick} className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700">
              Close
            </button>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center bg-gray-800 rounded">
            <p>Loading camera...</p>
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center bg-gray-800 rounded gap-3 p-4">
            <p className="text-center">{error}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // quick retry: re-enumerate devices
                  setSelectedCam(""); // reset -> effect that enumerates will run because clickButton unchanged
                  setTimeout(() => {
                    // small tick to allow enumerate effect to rerun if needed
                    // Alternatively user can re-open the modal.
                    window.location.reload();
                  }, 200);
                }}
                className="px-3 py-1 rounded bg-orange-600"
              >
                Retry / Reload
              </button>
              <button onClick={handleCloseClick} className="px-3 py-1 rounded bg-gray-700">
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2">
              <label className="text-sm text-gray-300 block mb-1">Choose camera</label>
              <select
                value={selectedCam}
                onChange={handleSelectChange}
                className="p-2 rounded bg-gray-800 text-white w-full"
              >
                {devices.map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Camera ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-black rounded overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                // controls   // debug ke liye
                width={640}
                height={480}
                // onLoadedMetadata={() => videoRef.current.play()}
                // style={{ background: "white",border : "1px solid red" }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button onClick={handleCapture} className="bg-orange-600 px-4 py-2 rounded font-semibold hover:bg-orange-700">
                  Capture
                </button>
                {devices.length > 1 && (
                  <button
                    onClick={() => {
                      const idx = devices.findIndex((d) => d.deviceId === selectedCam);
                      const next = devices[(idx + 1) % devices.length];
                      if (next) setSelectedCam(next.deviceId);
                    }}
                    className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700"
                  >
                    Switch ({devices.length})
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-300">
                {devices.length > 0 ? (
                  <div>Using: {devices.find((d) => d.deviceId === selectedCam)?.label || "Unknown"}</div>
                ) : (
                  <div>No cameras</div>
                )}
              </div>
            </div>

            {/* hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>
    </div>
  );
}
