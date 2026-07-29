"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const Skill_1 = require("./model/Skill");
const Project_1 = require("./model/Project");
const User_1 = require("./model/User");
const basicAuth_1 = require("./middleware/basicAuth");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const MONGOURI = process.env.MONGOURI || 'mongodb+srv://admin:oBuenZih0a3HwiCv@cluster0.rgnkhbl.mongodb.net/?appName=Cluster0';
const JWT_SECRET = process.env.JWT_SECRET;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
mongoose_1.default.connect(MONGOURI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/api/skills', async (req, res) => {
    try {
        const skills = await Skill_1.Skill.find();
        res.json(skills);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/skills', basicAuth_1.basicAuth, async (req, res) => {
    try {
        const newSkill = new Skill_1.Skill(req.body);
        const savedSkill = await newSkill.save();
        res.json(savedSkill);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/skills/:id', basicAuth_1.basicAuth, async (req, res) => {
    try {
        const deletedSkill = await Skill_1.Skill.findByIdAndDelete(req.params.id);
        if (!deletedSkill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        res.json(deletedSkill);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project_1.Project.find();
        res.json(projects);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/projects', basicAuth_1.basicAuth, async (req, res) => {
    try {
        const newProject = new Project_1.Project(req.body);
        const savedProject = await newProject.save();
        res.json(savedProject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/projects/:id', basicAuth_1.basicAuth, async (req, res) => {
    try {
        const deletedProject = await Project_1.Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(deletedProject);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
let cachedRepos = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000;
app.get('/api/github-repos', async (req, res) => {
    try {
        const isCacheFresh = cachedRepos && Date.now() - cachedAt < CACHE_TTL_MS;
        if (isCacheFresh) {
            return res.json(cachedRepos);
        }
        const username = process.env.GITHUB_USERNAME;
        const token = process.env.GITHUB_TOKEN;
        const githubResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
            },
        });
        if (!githubResponse.ok) {
            throw new Error(`GitHub API ${githubResponse.status}`);
        }
        const repos = (await githubResponse.json());
        const ownRepos = repos.filter((repo) => !repo.fork);
        cachedRepos = ownRepos;
        cachedAt = Date.now();
        res.json(ownRepos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Cant get repo from GitHub' });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User_1.User.findOne({ username });
        if (!user)
            return res.status(401).json({ error: 'Невірні дані' });
        const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValid)
            return res.status(401).json({ error: 'Невірні дані' });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: '1d',
        });
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
});
app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.admin_token;
    if (!token)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json({ user: payload });
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
});
app.get('/api/admin/verify', basicAuth_1.basicAuth, (req, res) => {
    res.json({ ok: true });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map