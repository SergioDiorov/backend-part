import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';

import router from 'routes/users-routes';
import authRouter from 'routes/auth-routes';
import profilesRouter from 'routes/profiles-routes';
import dashboardRouter from 'routes/dashboard-routes';

const PORT = process.env.PORT;
const URL = process.env.DB_URL as string;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use('/users', router);
app.use('/authUser', authRouter);
app.use('/profiles', profilesRouter);
app.use('/dashboard', dashboardRouter);

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('DB connection error ' + err));

app.listen(PORT, () => {
  console.log(`Listening PORT ${PORT}`);
});

export default app;
