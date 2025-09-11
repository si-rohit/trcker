import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectDB();
            const { username, email, name, role } = await req.body;
            if (!username || !email || !name || !role) {
                return res.json({ error: "All fields are required" }, { status: 400 });
            }
            const admin = await Admin.findOne({ username });
            if (!admin) {
                return res.json({ error: "User not found" }, { status: 404 });
            }
            admin.email = email;
            admin.name = name;
            admin.role = role;
            await admin.save();
            return res.json({ message: "User updated successfully", admin });
        } catch (error) {
            return res.json({ error: error.message }, { status: 500 });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
