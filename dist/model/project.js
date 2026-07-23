"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    repoUrl: { type: String, required: true },
    coverImage: { type: String, required: true },
    description: { type: String },
});
exports.Project = (0, mongoose_1.model)("Project", projectSchema);
//# sourceMappingURL=Project.js.map