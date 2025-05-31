import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
const router = express.Router();     // Create a new router instance

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;