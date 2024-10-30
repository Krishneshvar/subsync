import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/appRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: [`http://localhost:${process.env.CLIENT_PORT}`, `http://${process.env.HOME_IP}:${process.env.CLIENT_PORT}`],
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use("/", router);

app.listen(process.env.NODE_PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.NODE_PORT}`);
});
