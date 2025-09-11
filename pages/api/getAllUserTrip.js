import dbConnect from "@/lib/db";
import Trip from "@/models/trip";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            await dbConnect();
            const { id } = await req.body;
            // console.log(id);
            if (!id) {
                return res.json({ error: "User ID is required" }, { status: 400 });
            }
            const trips = await Trip.find({ Suppervisor1: id });
            return res.json({ trips });
        } catch (error) {
            return res.json({ error: error.message }, { status: 500 });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}