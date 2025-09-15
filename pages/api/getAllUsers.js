import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export default async function handler(req, res) {
  await connectDB();
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
    try {
        const users = await Admin.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}