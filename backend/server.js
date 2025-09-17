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

// Apply arcjet rate limit to all routes
app.use((req, res, next) => {
  try {
    const decision = aj.protect(req, {
      requested: 1, // each request consumed one token from bucket
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests - try again later',
        });
      } else if (decision.reason.isBot()) {
        return res
          .status(403)
          .json({ success: false, error: 'Access denied for bots' });
      } else {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }
    }

    // Check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      return res
        .status(403)
        .json({ success: false, error: 'Access denied for spoofed bots' });
    }
    next();
  } catch (error) {
    console.error('Arcjet error:', error);
    next(error);
  }
});

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
