import dbConnect from "@/lib/db";
import Trip from "@/models/trip";
import cloudinary from "@/lib/cloudinary";
import multer from "multer";

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "trips" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

const fileFields = [
  { name: "FrontImage", maxCount: 1 },
  { name: "TopImage", maxCount: 1 },
  { name: "LoadedImage1", maxCount: 1 },
  { name: "LoadedImage2", maxCount: 1 },
  { name: "RoyaltyImage", maxCount: 1 },
  { name: "WeightReciept", maxCount: 1 },
  { name: "UnloadedImage1", maxCount: 1 },
  { name: "UnloadedImage2", maxCount: 1 },
];

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PUT") {
    try {
      await runMiddleware(req, res, upload.fields(fileFields));

      const { id, uid } = req.body;

      // Pehle se saved trip data nikal lo
      const existingTrip = await Trip.findById(id);
      if (!existingTrip) {
        return res.status(404).json({ success: false, error: "Trip not found" });
      }

      const uploadedFiles = {};
      for (const field of fileFields) {
        const file = req.files?.[field.name]?.[0];
        if (file) {
          // new file upload karni hai
          uploadedFiles[field.name] = await uploadToCloudinary(file.buffer);
        } else {
          // koi new file nahi aayi → purana data rakho
          uploadedFiles[field.name] = existingTrip[field.name];
        }
      }

      const updatedTrip = await Trip.findByIdAndUpdate(
        id,
        {
          ...uploadedFiles,
          Suppervisor2: uid,
        },
        { new: true }
      );

      return res.json({ success: true, trip: updatedTrip });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
