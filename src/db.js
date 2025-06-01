import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
    });
    return;
  }
  console.log('Connected to PostgreSQL database');
  release();
});

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