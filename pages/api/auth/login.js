import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export default async function handler(req, res){
  if (req.method === 'POST') {
    try {
      await connectDB();
      const { username, password } = await req.body;

      const admin = await Admin.findOne({ username });
      
      if (!admin) {
        return res.json({ error: "Invalid username" }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.json({ error: "Invalid password" }, { status: 400 });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.json({ message: "Login successful", token });
    } catch (error) {
      return res.json({ error: error.message }, { status: 500 });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
}
