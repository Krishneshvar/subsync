import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import router from './routes/appRoutes.js';


dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    `http://localhost:${process.env.CLIENT_PORT}`, `http://${process.env.HOME_IP}:${process.env.CLIENT_PORT}`,
  ],
  methods: ['GET', 'POST','PUT','DELETE'],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

/**
 * Rate limiting middleware
 * @type {RateLimitRequestHandler}
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);
app.use("/", router);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.NODE_PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.NODE_PORT}`);
});
