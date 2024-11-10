import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import appDB from './db/subsyncDB.js';
import router from './routes/appRoutes.js';

dotenv.config();
const app = express();

const sessionStore = new MySQLStore({}, appDB);

app.use(express.json());
app.use("/", router);
app.use(helmet());

app.use(cors({
  origin: [`http://localhost:${process.env.CLIENT_PORT}`, `http://${process.env.HOME_IP}:${process.env.CLIENT_PORT}`],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(session({
  key: 'session_cookie_name', // Optional: customize the session cookie name
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 30, // 30 minutes expiry
    httpOnly: true, // Prevents JavaScript access
    secure: false, // secure cookies in development/production
    sameSite: 'lax', // Helps protect against CSRF
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Apply to all requests
app.use(limiter);

app.listen(process.env.NODE_PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.NODE_PORT}`);
});
