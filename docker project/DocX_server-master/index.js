import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:5173/']
}));
const port = 3000;
import router from './routes/route.js';

app.use('/', router);



const connectWithRetry = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {                
        console.log('Connected to MongoDB 🥳');
    }).catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.listen(port, () => console.log(`yowamio listening on port ${port}! 🔥`));
