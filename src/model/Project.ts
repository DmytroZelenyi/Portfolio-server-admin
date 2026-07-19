import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
    title: string;
    repoUrl: string;
    coverImage: string;
    description?: string;
}

const projectSchema = new Schema<IProject>({
    title: { type: String, required: true },
    repoUrl: { type: String, required: true },
    coverImage: { type: String, required: true },
    description: { type: String },
});

export const Project = model<IProject>("Project", projectSchema);