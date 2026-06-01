import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('LIFEOS API is running 🎉');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});