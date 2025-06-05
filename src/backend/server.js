import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import steamRoutes from './routes/steam.js';

//env variables
dotenv.config();

// initializing express app
const app = express();
const PORT = 5000;
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://steam-game-finder-orcin.vercel.app/'
];

//to make changes switch routes back to 'http://localhost:5000' for development
// and 'https://steam-game-finder-orcin.vercel.app/' for production

// cors configuration
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
// api routes
// creating all of our routes
app.use('/api/steam', steamRoutes);

//health endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'server is running' })
});

//turning on server
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

// error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

