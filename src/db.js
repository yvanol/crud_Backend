import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'product_db',
  password: process.env.DB_PASSWORD || '0000',
  port: process.env.DB_PORT || 5432,
});

export const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    console.log('Query executed:', { text, params, rows: res.rows });
    return res;
  } catch (err) {
    console.error('Database query error:', { message: err.message, stack: err.stack });
    throw err;
  }
};