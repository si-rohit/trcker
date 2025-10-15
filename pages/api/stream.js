
// import { spawn } from "child_process";
// import path from "path";
// import fs from "fs";

// // HLS output folder
// const hlsPath = path.join(process.cwd(), "public/hls");

// // console.log('hlsPath',hlsPath);

// if (!fs.existsSync(hlsPath)) {
//   fs.mkdirSync(hlsPath, { recursive: true });
// }

// // Start FFmpeg once when API first hits
// let ffmpegStarted = false;

// export default function handler(req, res) {
//   if (!ffmpegStarted) {
//     ffmpegStarted = true;

//     spawn("ffmpeg", [
//       "-i", "rtsp://admin:123456@192.168.1.122:554/h264/ch1/main/av_stream", // DVR RTSP
//       "-c:v", "libx264",
//       "-f", "hls",
//       "-hls_time", "2",
//       "-hls_list_size", "3",
//       "-hls_flags", "delete_segments",
//       `${hlsPath}/stream.m3u8`
//     ]);
//   }

//   return res.status(200).json({ url: "/hls/stream.m3u8" });
// }


import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegPath);

// 👇 Apna RTSP URL yahan daal
// const STREAM_URL = "rtsp://admin:123456@192.168.1.122:554/h264/ch1/main/av_stream";
const STREAM_URL = "rtsp://170.93.143.139/rtplive/470011e600ef003a004ee33696235daa";
const OUTPUT_DIR = path.join(process.cwd(), "public/hls");

let processRunning = false;

export default async function handler(req, res) {
  try {
    // Agar already running hai to dobara start mat karo
    if (processRunning) {
      return res.status(200).json({ message: "Stream already running", url: "/hls/index.m3u8" });
    }

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log("🎥 Starting FFmpeg for RTSP stream...");

    processRunning = true;

    ffmpeg(STREAM_URL)
      .addOptions([
        "-c:v libx264",
        "-preset ultrafast",
        "-tune zerolatency",
        "-f hls",
        "-hls_time 2",
        "-hls_list_size 5",
        "-hls_flags delete_segments",
      ])
      .output(path.join(OUTPUT_DIR, "index.m3u8"))
      .on("start", (cmd) => console.log("FFmpeg started with:", cmd))
      .on("end", () => {
        console.log("✅ Stream ended");
        processRunning = false;
      })
      .on("error", (err) => {
        console.error("❌ FFmpeg error:", err.message);
        processRunning = false;
      })
      .run();

    return res.status(200).json({
      message: "Stream started successfully",
      url: "/hls/stream.m3u8",
    });
  } catch (err) {
    console.error("Handler Error:", err);
    processRunning = false;
    return res.status(500).json({ error: err.message });
  }
}



// import http from 'http';
// import { createHash } from 'crypto';
// import { Buffer } from 'buffer';

// // --- Configuration ---
// const DVR_IP = "192.168.1.11";
// const DVR_PORT = 80;
// const USERNAME = "admin";
// const PASSWORD = "Abhi9812"; 

// // Hum ISAPI picture format use karenge, kyunki yeh authentication ke baad 
// // sirf ek static JPEG image dega (no complex stream handling).
// const FINAL_SNAPSHOT_PATH = "/doc/page/preview.asp"; 

// // --- Digest Auth Helper Functions ---

// // MD5 Hash helper
// const md5 = (data) => createHash('md5').update(data).digest('hex');

// // A1: username:realm:password ka hash
// const getHashedA1 = (realm) => md5(`${USERNAME}:${realm}:${PASSWORD}`);

// // A2: method:uri ka hash
// const getHashedA2 = (method, uri) => md5(`${method}:${uri}`);

// // --- Main Request Function ---
// const fetchSnapshotWithDigestAuth = (path) => {
//     return new Promise((resolve, reject) => {
        
//         // Helper function to read data from response stream
//         const readResponseData = (res, reason) => {
//             const chunks = [];
//             res.on('data', chunk => chunks.push(chunk));
//             res.on('end', () => {
//                 const buffer = Buffer.concat(chunks);
//                 resolve({ buffer: buffer, contentType: res.headers['content-type'] });
//             });
//             res.on('error', reject);
//         };
        
//         // 1. Initial Request (Check 401 or 200)
//         const req1 = http.request({
//             hostname: DVR_IP,
//             port: DVR_PORT,
//             path: path,
//             method: 'GET',
//         }, (res1) => {
            
//             if (res1.statusCode === 200) {
//                 // 🔥 FIX: Agar seedha 200 milta hai, toh iska matlab hai ki 
//                 // yeh URL authentication ke bina hi data de raha hai (ya session active hai).
//                 console.log("Status 200 received. Reading data directly...");
//                 return readResponseData(res1, "Direct 200 OK");
                
//             } else if (res1.statusCode === 401 && res1.headers['www-authenticate']) {
//                 // Digest Auth is needed (The normal process)
                
//                 const wwwAuthenticate = res1.headers['www-authenticate'];
//                 // ... (Extract realm, nonce, etc. - same logic as before) ...
                
//                 // ... (Calculate Hash and authHeader - same logic as before) ...

//                 // 2. Final Request with Authorization Header
//                 const req2 = http.request({
//                     hostname: DVR_IP,
//                     port: DVR_PORT,
//                     path: path,
//                     method: 'GET',
//                     headers: { 'Authorization': authHeader },
//                 }, (res2) => {
//                     if (res2.statusCode !== 200) {
//                         return reject(new Error(`Failed to get image. Status code: ${res2.statusCode}`));
//                     }
//                     return readResponseData(res2, "Digest Auth Success");
//                 });
//                 req2.on('error', reject);
//                 req2.end();

//             } else {
//                 reject(new Error(`Initial request failed with status: ${res1.statusCode}`));
//             }
//         });

//         req1.on('error', reject);
//         req1.end();
//     });
// };

// // --- API Handler ---
// export default async function handler(req, res) {
//     try {
//         const { buffer, contentType } = await fetchSnapshotWithDigestAuth(FINAL_SNAPSHOT_PATH);

//         if (contentType && contentType.includes('image/jpeg')) {
//             const imageBase64 = buffer.toString('base64');
//             return res.status(200).json({
//                 data: `data:${contentType};base64,${imageBase64}`,
//             });
//         } else {
//             console.error(`Received unexpected content type: ${contentType}`);
//             const textResponse = buffer.toString('utf8');
//             console.error(`DVR Response: ${textResponse.substring(0, 200)}...`); 

//             return res.status(500).json({
//                 error: `Received bad content from DVR (Type: ${contentType}). Check if FINAL_SNAPSHOT_PATH is correct.`,
//             });
//         }

//     } catch (error) {
//         console.error("Snapshot fetch failed:", error.message);
//         return res.status(500).json({
//             error: "Failed to fetch snapshot. Manual Digest Auth failed. Check password/username.",
//             detail: error.message
//         });
//     }
// }