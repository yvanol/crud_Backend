import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

// Test connection with retry logic
const connectWithRetry = async (retries = 12, delay = 10000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('Connected to PostgreSQL database');
      client.release();
      return;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, {
        message: err.message,
        code: err.code,
        detail: err.detail,
      });
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  console.error('Failed to connect to database after retries');
};

connectWithRetry();

export const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
    });
    throw err;
  }
};