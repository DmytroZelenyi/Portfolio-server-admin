import { Schema, model, Document} from "mongoose";

export interface ISkill extends Document {
    id: number;
    title: string;
    startedLearning: string;
    icon: string;
}

const skillSchema = new Schema<ISkill>({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    startedLearning: { type: String, required: true },
    icon: { type: String, required: true },
});

export const Skill = model<ISkill>("Skill", skillSchema);