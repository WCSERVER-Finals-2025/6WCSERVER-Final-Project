import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // include 'admin' so the backend can recognize admin users
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  // Optional resume info
  resume: {
    name: String,
    path: String,
    size: Number,
  },
});

export default mongoose.model("User", userSchema);
