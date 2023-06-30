import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import router from './routes/users-routes';

const PORT = 3000;
const URL =
  'mongodb+srv://sergiodiorov:7zGitUx3Krjw1TbJ@cluster0.wd9mxjg.mongodb.net/usersdb?retryWrites=true&w=majority';

const app = express();
app.use(express.json());
app.use(router);

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
