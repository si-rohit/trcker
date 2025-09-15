import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export default async function handler(req, res) {
    await connectDB();
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
    const id = req.body;
    console.log("Received ID:", id);
    try {
        const user = await Admin.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
