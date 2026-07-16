import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Skill } from './model/Skill';
// import { skill } from './model/types';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGOURI = process.env.MONGOURI || 'mongodb://127.0.0.1:27017';

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

app.listen(PORT, () => {
    
  console.log(`Server is running on port ${PORT}`);
});