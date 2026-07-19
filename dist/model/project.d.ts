import { Document } from "mongoose";
export interface IProject extends Document {
    title: string;
    repoUrl: string;
    coverImage: string;
    description?: string;
}
export declare const Project: import("mongoose").Model<IProject, {}, {}, {}, Document<unknown, {}, IProject, {}, import("mongoose").DefaultSchemaOptions> & IProject & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProject>;
//# sourceMappingURL=project.d.ts.map