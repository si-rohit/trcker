import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import multer from "multer";
import cloudinary from "@/lib/cloudinary";

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: run middleware
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

// Upload to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "admins" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Generate Initials Image (Cloudinary text image)
const generateInitialsImage = async (name) => {
  const initials = name
    .split(" ")
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2); // max 2 letters

  // Cloudinary text-based image
  const result = await cloudinary.uploader.text(
    initials,
    {
      public_id: `admins/initials_${initials}_${Date.now()}`,
      font_family: "Arial",
      font_size: 120,
      gravity: "center",
      width: 200,
      height: 200,
      crop: "fit",
      background: "#3498db", // or use a static color like "#3498db"
      color: "#fff",
    }
  );
  return result.secure_url;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectDB();

      // Handle file upload
      await runMiddleware(req, res, upload.single("profilePic"));

      const { username, password, email, name, role } = req.body;
      console.log(req.body);
      if (!username || !password || !name || !role) {
        return res
          .status(400)
          .json({ error: "All fields (username, password, name, role) are required" });
      }

      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Profile pic upload or generate initials
      let profilePicUrl = null;
      if (req.file) {
        profilePicUrl = await uploadToCloudinary(req.file.buffer);
      } else {
        profilePicUrl = await generateInitialsImage(name);
      }

      const admin = new Admin({
        username,
        email,
        name,
        role,
        password: hashedPassword,
        profilePic: profilePicUrl,
      });

      await admin.save();

      return res.json({ message: "Admin created successfully", admin });
    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
