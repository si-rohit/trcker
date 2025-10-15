// import React, { useState, useEffect } from 'react';

const { useEffect } = require("react");

// const SnapshotPlayer = () => {
//     const [imageUrl, setImageUrl] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const fetchSnapshot = async () => {
//         try {
//             const response = await fetch('/api/stream');
//             const result = await response.json();

//             if (response.ok) {
//                 setImageUrl(result.data);
//                 setError(null);
//                 setLoading(false);
//             } else {
//                 setError(result.error || 'Unknown error fetching snapshot.');
//                 setLoading(false);
//             }
//         } catch (err) {
//             setError('Network error or API failure.');
//             setLoading(false);
//             console.error(err);
//         }
//     };

//     useEffect(() => {
//         // Turant pehla snapshot load karein
//         fetchSnapshot();

//         // Har 200ms (5 FPS) mein snapshot refresh karein
//         const intervalId = setInterval(fetchSnapshot, 200);

//         // Component unmount hone par interval clear karein
//         return () => clearInterval(intervalId);
//     }, []);

//     if (loading) {
//         return <p>Loading camera feed...</p>;
//     }

//     if (error) {
//         return <p style={{ color: 'red' }}>Error: {error}. Check server console for details.</p>;
//     }

//     return (
//         <div style={{ border: '1px solid #ccc', maxWidth: '640px' }}>
//             <h2>Live Snapshot Feed (Low FPS)</h2>
//             <img 
//                 src={imageUrl} 
//                 alt="Live Camera Snapshot" 
//                 style={{ width: '100%', display: 'block' }}
//             />
//         </div>
//     );
// };

// export default SnapshotPlayer;


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