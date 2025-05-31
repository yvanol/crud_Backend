import { query } from '../db.js';

export const getProducts = async () => {
  try {
    const { rows } = await query('SELECT * FROM product_tb');
    return rows;
  } catch (err) {
    console.error('Error in getProducts:', err.message);
    throw err;
  }
};

export const createProducts = async (productdata) => {
  const { name, description, price, isactive } = productdata;
  try {
    const { rows } = await query(
      'INSERT INTO product_tb (name, description, price, isactive) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, isactive]
    );
    console.log('Product created:', rows[0]);
    return rows[0];
  } catch (err) {
    console.error('Error in createProducts:', err.message);
    throw err;
  }
};

export const updateProduct = async (productId, productData) => {
  const { name, description, price, isactive } = productData;
  try {
    const { rows } = await query(
      'UPDATE product_tb SET name = $1, description = $2, price = $3, isactive = $4 WHERE id = $5 RETURNING *',
      [name, description, price, isactive, productId]
    );
    console.log('Product updated:', rows[0]);
    return rows[0];
  } catch (err) {
    console.error('Error in updateProduct:', err.message);
    throw err;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const { rowCount } = await query('DELETE FROM product_tb WHERE id = $1', [productId]);
    console.log('Product deleted:', { productId, rowCount });
    return rowCount > 0;
  } catch (err) {
    console.error('Error in deleteProduct:', err.message);
    throw err;
  }
};

export const searchProducts = async (searchTerm) => {
  try {
    const { rows } = await query(
      'SELECT * FROM product_tb WHERE name ILIKE $1 OR description ILIKE $1 OR price::text ILIKE $1',
      [`%${searchTerm}%`]
    );
    console.log('Search results:', { searchTerm, rows });
    return rows;
  } catch (err) {
    console.error('Error in searchProducts:', err.message);
    throw err;
  }
};