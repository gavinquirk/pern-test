import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is security middleware that helps to protect the app by setting http headers
app.use(morgan('dev')); // logs requests

app.get('/', (req, res) => {
  res.send('Hello from the backend');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
