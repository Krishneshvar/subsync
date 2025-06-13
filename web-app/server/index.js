import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import router from './routes/appRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import { NotFoundError } from './utils/appErrors.js';
import logger from './utils/logger.js';

dotenv.config();
const app = express();
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
  origin: [
    `http://localhost:${process.env.CLIENT_PORT}`, // for dev outside Docker
    `http://${process.env.HOME_IP}:${process.env.CLIENT_PORT}`, // for dev outside Docker (corrected template literal)
    `http://localhost`, // allows requests from your Nginx frontend (port 80)
    `http://127.0.0.1`,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

app.use("/api", router);

app.all('*', (req, res, next) => {
    next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(errorHandler);

// Start the server
const server = app.listen(process.env.NODE_PORT, () => {
  logger.info(`Server is running at http://localhost:${process.env.NODE_PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: Closing HTTP server and DB connections');
  server.close(async () => {
    logger.info('HTTP server closed.');
    await closeDbConnectionPool();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: Closing HTTP server and DB connections');
  server.close(async () => {
    logger.info('HTTP server closed.');
    await closeDbConnectionPool();
    process.exit(0);
  });
});
