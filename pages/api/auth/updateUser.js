import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import multer from "multer";

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper to run multer in Next.js
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

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await connectDB();

      // Run multer middleware
      await runMiddleware(req, res, upload.single("profilePic"));

      // Ab yaha par form fields + file dono milenge
      const { username, email, name, role, password, id } = req.body;
      const file = req.file;

      console.log("name:", name);
      console.log("file:", file);

      if (!username || !email || !name || !role) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const admin = await Admin.findOne({ _id: id });
      if (!admin) {
        return res.status(404).json({ error: "User not found" });
      }

      if (admin.username !== username) {
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
          return res.status(400).json({ error: "Username already exists" });
        }
        admin.username = username;
      }

      admin.email = email;
      admin.name = name;
      admin.role = role;

      if (file) {
        // Example: save original filename, ya phir Cloudinary pe upload karna ho to yaha handle karo
        admin.profilePic = file.originalname;
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);
      }

      await admin.save();
      return res.json({ message: "User updated successfully", admin });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};
