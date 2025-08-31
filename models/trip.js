import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  tripNumber: { type: String, required: true },
  truckNumber: { type: String, required: true },
  companyName: { type: String, required: true },
  LoadedImage: [{ type: String }],   
  UnloadedImage: [{ type: String }], 
  EnterTime: { type: Date, default: Date.now },
  ExitTime: { type: Date },
});

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
