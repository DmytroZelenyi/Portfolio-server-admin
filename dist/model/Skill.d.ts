import { Document } from "mongoose";
export interface ISkill extends Document {
    title: string;
    startedLearning: string;
    icon: string;
}
export declare const Skill: import("mongoose").Model<ISkill, {}, {}, {}, Document<unknown, {}, ISkill, {}, import("mongoose").DefaultSchemaOptions> & ISkill & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISkill>;
//# sourceMappingURL=Skill.d.ts.map