import dbConnect from "@/lib/db";
import Trip from "@/models/trip";
import cloudinary from "@/lib/cloudinary";
import multer from "multer";

// Disable Next.js body parsing (important)
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
  if (req.method === "PUT") {
    try {
      // run multer middleware first (yaha req.body populate hoga)
      await runMiddleware(req, res, upload.array("UnloadedImage"));

      const { id} = req.body; // ✅ ab yaha se milega

      let uploadedUrls = [];
      if (req.files && req.files.length > 0) {
        
        uploadedUrls = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer))
        );
      }

      const updatedTrip = await Trip.findByIdAndUpdate(
        id,
        {
          UnloadedImage: uploadedUrls,
          ExitTime: new Date(),
        },
        { new: true }
      );

      return res.json({ success: true, trip: updatedTrip });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, error: err.message });
    }
  }else{
    return res.status(405).json({ error: "Method not allowed" });
  }
}
