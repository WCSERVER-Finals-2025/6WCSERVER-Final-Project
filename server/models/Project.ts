// Project.ts
import mongoose, { Schema, Document } from "mongoose";

interface IFile {
  name: string;
  path?: string;
  size: number | string;
}

interface IComment {
  author: string;
  text: string;
  createdAt: Date; // rename from "date" to "createdAt" for consistency
}

interface IVote {
  userId: string;
  type: "up" | "down";
}

export interface IProject extends Document {
  title: string;
  author?: string;
  description: string;
  course: string;
  tags: string[];
  files: IFile[];
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  status?: "pending" | "approved" | "rejected";
  comments: IComment[];
  thumbsUp: number;
  thumbsDown: number;
  votes: IVote[];
}

const commentSchema = new Schema<IComment>(
  {
    author: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // use createdAt
  },
  { _id: true } // keep _id so Mongoose generates it
);

const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    path: { type: String },
    size: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    author: { type: String },
    description: { type: String, required: true },
    course: { type: String, required: true },
    tags: [String],
    files: [fileSchema],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    thumbsUp: { type: Number, default: 0 },
    thumbsDown: { type: Number, default: 0 },
    comments: [commentSchema],
    votes: [
      {
        userId: { type: String, required: true },
        type: { type: String, enum: ["up", "down"], required: true },
      },
    ],
  },
  { timestamps: true } // createdAt / updatedAt auto
);


export default mongoose.model<IProject>("Project", projectSchema);
