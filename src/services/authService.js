import { query } from '../db.js';
import bcrypt from 'bcrypt';

export const authenticateAdmin = async (name, password) => {
  console.log('Authenticating admin:', { name });
  try {
    const { rows } = await query('SELECT * FROM admin_tb WHERE name = $1', [name]);
    if (rows.length === 0) return null;
    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    console.log('Password match for', name, ':', match);
    return match ? admin : null;
  } catch (err) {
    console.error('Error in authenticateAdmin:', err.message);
    throw err;
  }
};

export const createAdmin = async (name, password) => {
  console.log('Creating admin:', { name });
  try {
    const { rows: existing } = await query('SELECT * FROM admin_tb WHERE name = $1', [name]);
    if (existing.length > 0) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await query(
      'INSERT INTO admin_tb (name, password) VALUES ($1, $2) RETURNING id, name',
      [name, hashedPassword]
    );
    console.log('Insert result:', { rows });
    return rows[0];
  } catch (err) {
    console.error('Error in createAdmin:', err.message);
    throw err;
  }
};