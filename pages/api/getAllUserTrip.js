import dbConnect from "@/lib/db";
import Trip from "@/models/trip";
import Admin from "@/models/Admin";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await dbConnect();
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Step 1: Get user info from Admin collection
      const user = await Admin.findById(id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let trips = [];

      // Step 2: Check role
      if (user.role === "admin") {
        // Admin → get all trips
        trips = await Trip.find({}).sort({ createdAt: -1 });
      } else {
        // Non-admin → get only trips created by this user
        trips = await Trip.find({
          $or: [{ Suppervisor1: id }, { Suppervisor2: id }],
        }).sort({ createdAt: -1 });
      }

      // Step 3: Attach supervisor details for each trip
      const updatedTrips = await Promise.all(
        trips.map(async (trip) => {
          trip = trip.toObject();

          // Attach Suppervisor1 details
          if (trip.Suppervisor1) {
            const Suppervisor1Details = await Admin.findById(trip.Suppervisor1).select("-password");
            trip.Suppervisor1 = Suppervisor1Details || null;
          } else {
            trip.Suppervisor1 = null;
          }

          // Attach Suppervisor2 details
          if (trip.Suppervisor2) {
            const Suppervisor2Details = await Admin.findById(trip.Suppervisor2).select("-password");
            trip.Suppervisor2 = Suppervisor2Details || null;
          } else {
            trip.Suppervisor2 = null;
          }

          return trip;
        })
      );

      return res.json({
        user, // send user info too
        trips: updatedTrips,
      });
    } catch (error) {
      console.error("Error fetching trips:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
