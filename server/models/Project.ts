import mongoose, { Schema, Document } from "mongoose";

interface IFile {
  name: string;
  path: string;
  size: number;
}

export interface IProject extends Document {
  title: string;
  description: string;
  course: string;
  tags: string[];
  files: IFile[];
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  status: "pending" | "approved" | "rejected";
}

const FileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: String, required: true },
  tags: [{ type: String }],
  files: [FileSchema],
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

export default mongoose.model<IProject>("Project", ProjectSchema);
