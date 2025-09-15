import dbConnect from "@/lib/db";
import Trip from "@/models/trip";
import Admin from "@/models/Admin";

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
            // const userDetails = await Trip.find({ Suppervisor2: id });
            // trips.push(...userDetails);
            const SuppervisorDetails = await Admin.findById(id).select('-password');
            if (!SuppervisorDetails) {
                return res.json({ error: "Supervisor not found" }, { status: 404 });
            }
            // Attach supervisor details to each trip
            trips.forEach(trip => {
                trip.Suppervisor1 = SuppervisorDetails;
            });

            if (trips.Suppervisor2 === undefined || trips.Suppervisor2 === null) {
                return res.json({ trips });
            }

            const Suppervisor2Details = await Admin.findById({id:trips.Suppervisor2}).select('-password');
            if (Suppervisor2Details) {
                trips.forEach(trip => {
                    trip.Suppervisor2 = Suppervisor2Details;
                });
            }
            return res.json({ trips });
        } catch (error) {
            return res.json({ error: error.message }, { status: 500 });
        }
    } else {
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}