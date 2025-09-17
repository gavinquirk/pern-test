import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js';

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet is security middleware that helps to protect the app by setting http headers
app.use(morgan('dev')); // logs requests

// ROUTES
app.use('/api/products', productRoutes);

// Create products table if it doesn't exist
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Connected to the database and ensured products table exists.');
  } catch (error) {
    console.log('Error connecting to the database:', error.message);
  }
}

// Init DB and start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
