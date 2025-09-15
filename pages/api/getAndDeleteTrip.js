import dbConnect from "@/lib/db";
import Trip from "@/models/trip";
import cloudinary from "@/lib/cloudinary";
import Admin from "@/models/Admin";

export default async function handler(req, res) {
  await dbConnect();
  const id = req.body;
  
  // console.log(id)
  if (req.method === "POST") {
    const trip = await Trip.findById(id);
    // console.log(trip)
    const SuppervisorDetails = await Admin.findById(trip.Suppervisor1).select('-password');
      if (!SuppervisorDetails) {
        return res.json({ error: "Supervisor not found" }, { status: 404 });
      }
      // Attach supervisor details to each trip
      trip.Suppervisor1 = SuppervisorDetails;

      // console.log(trip)
    
      if (trip.Suppervisor2 === undefined || trip.Suppervisor2 === null) {
        return res.json({ trip });
      }
           
      const Suppervisor2Details = await Admin.findById(trip.Suppervisor2).select('-password');
      // console.log(Suppervisor2Details)
      if (Suppervisor2Details) {
        trip.Suppervisor2 = Suppervisor2Details;
      }
      // const Suppervisor2Details = await Admin.findById({id:trip.Suppervisor2}).select('-password');
      // if (Suppervisor2Details) {
      //   trip.forEach(trip => {
      //     trip.Suppervisor2 = Suppervisor2Details;
      //   });
      // }
      return res.json({ trip });
    // return res.status(200).json(trip);
  }

  if (req.method === "DELETE") {
    try {

        const trip = await Trip.findById(id);
        // console.log(id)

        if (!trip) {
        return res.json({ success: false, error: "Trip not found" }, { status: 404 });
        }

        if (trip.LoadedImage) {
        const publicId = trip.LoadedImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`trips/${publicId}`);
        }
        if (trip.UnloadedImage) {
        const publicId = trip.UnloadedImage.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`trips/${publicId}`);
        }

        await trip.deleteOne();

        return res.json({ success: true, message: "Trip deleted" });
    } catch (err) {
        return res.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
