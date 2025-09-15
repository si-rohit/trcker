import dbConnect from "@/lib/db";
import Trip from "@/models/trip";

export default async function handler(req, res) {
  await dbConnect();
    if (req.method === "POST") {
        const id = req.body;
        console.log(id);
        if (!id) {
            return res.status(400).json({ error: "Trip ID is required" });
        }
        try {
            const trip = await Trip.findByIdAndUpdate(id,{ ExitTime: new Date() }, { new: true });
            if (!trip) {
                return res.status(404).json({ error: "Trip not found" });
            }
            return res.status(200).json({ success: true,message:'trip Complete successfully', trip });
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}