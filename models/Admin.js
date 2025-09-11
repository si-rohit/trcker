import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  email: { type: String},
  role: { type: String, default: "supervisor" },
  name: { type: String},
  status: { type: String, default: "active" },
  profilePic: {
    type: String,
    default: "",
  }
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
