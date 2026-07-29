"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuth = basicAuth;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../model/User");
async function basicAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const base64Credentials = authHeader?.startsWith('Basic ') ? authHeader.split(' ')[1] : undefined;
    if (!base64Credentials) {
        res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
        res.status(401).send('Потрібна авторизація');
        return;
    }
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const separatorIndex = decoded.indexOf(':');
    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);
    const user = await User_1.User.findOne({ username });
    const isValid = user ? await bcrypt_1.default.compare(password, user.passwordHash) : false;
    if (!isValid) {
        res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
        res.status(401).send('Невірний логін або пароль');
        return;
    }
    next();
}
//# sourceMappingURL=basicAuth.js.map