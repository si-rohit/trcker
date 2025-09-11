import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectDB();
            const { id } = await req.body;
            if (!id) {
                return res.json({ error: "User ID is required" }, { status: 400 });
            }
            await Admin.findByIdAndDelete(id);
            return res.json({ message: "User deleted successfully" });
        } catch (error) {
            return res.json({ error: error.message }, { status: 500 });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}