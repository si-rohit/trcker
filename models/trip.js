import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  tripNumber: { type: String, required: true },
  truckNumber: { type: String, required: true },
  companyName: { type: String, required: true }, 
  FrontImage: { type: String },
  TopImage: { type: String },
  WeightReciept: { type: String },
  RoyaltyImage: { type: String },
  LoadedImage1: { type: String },
  LoadedImage2: { type: String },
  UnloadedImage1: { type: String },
  UnloadedImage2: { type: String },
  EnterTime: { type: Date, default: Date.now },
  ExitTime: { type: Date },
  weight: { type: String },
  Suppervisor1: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  Suppervisor2: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },

});

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
