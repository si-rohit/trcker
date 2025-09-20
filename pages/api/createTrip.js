import dbConnect from "@/lib/db";
import Trip from "@/models/trip";
import cloudinary from "@/lib/cloudinary";
import multer from "multer";

// Disable Next.js body parsing (important)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: run middleware in Next.js
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Cloudinary upload (promise wrapper)
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

// Define all file fields
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

  // if (req.method === "GET") {
  //   const { uid } = req.query;
  //   // console.log(uid);
  //   const trips = await Trip.find();
  //   return res.status(200).json(trips);
  // }

  if (req.method === "POST") {
    try {
      await runMiddleware(req, res, upload.fields(fileFields));

      const { truckNumber, companyName, tripNumber, weight, uid } = req.body;

      // Upload files if they exist
      // console.log('uid', uid);
      const uploadedFiles = {};
      for (const field of fileFields) {
        const file = req.files?.[field.name]?.[0];
        if (file) {
          uploadedFiles[field.name] = await uploadToCloudinary(file.buffer);
        } else {
          uploadedFiles[field.name] = null; // if missing
        }
      }

      let ExitTime = null;
      let Suppervisor2 = null;
      if (uploadedFiles.FrontImage, uploadedFiles.TopImage, uploadedFiles.LoadedImage1, uploadedFiles.LoadedImage2, uploadedFiles.RoyaltyImage, uploadedFiles.WeightReciept, uploadedFiles.UnloadedImage1, uploadedFiles.UnloadedImage2) {
        ExitTime = new Date();
        Suppervisor2 = uid;
      }

      const trip = await Trip.create({
        truckNumber,
        companyName,
        tripNumber,
        weight,
        EnterTime: new Date(),
        Suppervisor1: uid,
        FrontImage: uploadedFiles.FrontImage,
        TopImage: uploadedFiles.TopImage,
        LoadedImage1: uploadedFiles.LoadedImage1,
        LoadedImage2: uploadedFiles.LoadedImage2,
        RoyaltyImage: uploadedFiles.RoyaltyImage,
        WeightReciept: uploadedFiles.WeightReciept,
        UnloadedImage1: uploadedFiles.UnloadedImage1,
        UnloadedImage2: uploadedFiles.UnloadedImage2,
        Suppervisor2,
        ExitTime
      });

      return res.json({ success: true, trip });
    } catch (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
