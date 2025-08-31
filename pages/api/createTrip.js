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

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const trips = await Trip.find();
    return res.status(200).json(trips);
  }

  if (req.method === "POST") {
    try {
      await runMiddleware(req, res, upload.array("LoadedImage"));

      const { truckNumber, companyName, tripNumber } = req.body;
      
      let uploadedUrls = [];
      if (req.files && req.files.length > 0) {
        
        uploadedUrls = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer))
        );
      }
      const trip = await Trip.create({
        truckNumber,
        companyName,
        tripNumber,
        LoadedImage: uploadedUrls,
        EnterTime: new Date(),
      });

      return res.json({ success: true, trip });
    } catch (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
