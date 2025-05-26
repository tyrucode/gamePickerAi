import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import steamRoutes from './routes/steam.js';

//env variables
dotenv.config();

const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

//creating all of our routes
app.use('/api/steam', steamRoutes);

//health endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'server is running' })
});

//turning on server
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});