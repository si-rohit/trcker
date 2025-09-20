
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// HLS output folder
const hlsPath = path.join(process.cwd(), "public/hls");

// console.log('hlsPath',hlsPath);

if (!fs.existsSync(hlsPath)) {
  fs.mkdirSync(hlsPath, { recursive: true });
}

// Start FFmpeg once when API first hits
let ffmpegStarted = false;

export default function handler(req, res) {
  if (!ffmpegStarted) {
    ffmpegStarted = true;

    spawn("ffmpeg", [
      "-i", "rtsp://admin:##9896@Chico@192.168.1.11:554/Streaming/Channels/101", // DVR RTSP
      "-c:v", "libx264",
      "-f", "hls",
      "-hls_time", "2",
      "-hls_list_size", "3",
      "-hls_flags", "delete_segments",
      `${hlsPath}/stream.m3u8`
    ]);
  }

  return res.status(200).json({ url: "/hls/stream.m3u8" });
}
