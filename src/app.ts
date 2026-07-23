import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Skill } from './model/Skill';
import { Project } from './model/Project';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const MONGOURI = process.env.MONGOURI || 'mongodb+srv://admin:oBuenZih0a3HwiCv@cluster0.rgnkhbl.mongodb.net/?appName=Cluster0';

app.use(cors());
app.use(express.json());



mongoose.connect(MONGOURI)
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
        const skills = await Skill.find();
        res.json(skills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/api/skills', async (req, res) => {
    try {
        const newSkill = new Skill(req.body);
        const savedSkill = await newSkill.save();
        res.json(savedSkill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.delete('/api/skills/:id', async (req, res) => {
    try {
        const deletedSkill = await Skill.findByIdAndDelete(req.params.id);
        if (!deletedSkill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        res.json(deletedSkill);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
app.post('/api/projects', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.json(savedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
 
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(deletedProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
let cachedRepos: unknown[] | null = null;
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
 
        const githubResponse = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                },
            }
        );
 
        if (!githubResponse.ok) {
            throw new Error(`GitHub API ${githubResponse.status}`);
        }
 
        const repos = (await githubResponse.json()) as { fork: boolean }[];
        const ownRepos = repos.filter((repo) => !repo.fork);
 
        cachedRepos = ownRepos;
        cachedAt = Date.now();
 
        res.json(ownRepos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Cant get repo from GitHub' });
    }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});