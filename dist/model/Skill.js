"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const mongoose_1 = require("mongoose");
const skillSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    startedLearning: { type: String, required: true },
    icon: { type: String, required: true },
});
exports.Skill = (0, mongoose_1.model)("Skill", skillSchema);
//# sourceMappingURL=Skill.js.map