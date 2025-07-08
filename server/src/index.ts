import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

import { ErrorMiddleware } from './middleware/error.js';
import router from './routes/index.js';
import connectDB from './config/db.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const allowedOrigins = [
   process.env.FRONTEND_URL, 
  "http://localhost:5173",
  "https://task-hub-lyart-one.vercel.app",
];

const app = express();

connectDB();

// middlewares
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(morgan('dev'));
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ['POST', 'GET', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

const port = process.env.PORT || 4000;

// API Routes
app.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        messsage: 'Welcome to the Taskhub API.',
    });
});

app.use('/api/v1', router);

// Handle unknown routes
app.use((req: Request, res: Response) => {
    res.status(404).send({
        message: `Route ${req.originalUrl} not found`,
    });
});

// Custom Error
app.use(ErrorMiddleware);

app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
