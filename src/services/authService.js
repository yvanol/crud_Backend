import { query } from '../db.js'; // Changed from './db.js' to '../db.js'

export const authenticateAdmin = async (name, password) => {
  console.log('Authenticating admin:', { name });
  try {
    const { rows } = await query('SELECT * FROM admin_tb WHERE name = $1', [name]);
    console.log('Query result for name:', { name, rows });
    if (rows.length === 0) return null;
    const admin = rows[0];
    const match = password === admin.password; // Plain text comparison (insecure)
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
    console.log('Existing user check:', { existing });
    if (existing.length > 0) {
      throw new Error('User already exists');
    }
    const { rows } = await query(
      'INSERT INTO admin_tb (name, password) VALUES ($1, $2) RETURNING id, name',
      [name, password]
    );
    console.log('Insert result:', { rows });
    return rows[0];
  } catch (err) {
    console.error('Error in createAdmin:', err.message);
    throw err;
  }
};