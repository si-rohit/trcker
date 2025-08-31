import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";

export default async function handler(req, res){
  if (req.method === 'GET') {
    try {
      await connectDB();
      const hashedPassword = await bcrypt.hash("admin123", 10);
      // console.log(hashedPassword)

      const admin = new Admin({ username: "admin", password: hashedPassword });
      await admin.save();

      return res.json({ message: "Default admin created", admin });
    } catch (error) {
      return res.json({ error: error.message }, { status: 500 });
    }
  }else{
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
}
