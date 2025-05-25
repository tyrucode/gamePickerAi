const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const steamRoutes = require('./routes/steam');

//env variables
dotenv.config();

const app = express();
const port = 5173;

app.use((cors({
    origin: 'http://localhost:5173',
    credentials: true
})));
app.use(express.json());

//routes
app.use('/api/steam', steamRoutes);

//health endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'server is running' })
});

app.listen(port, () => {
    console.log(`server running on port ${port}`); ''
});