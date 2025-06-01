import { query } from '../db.js';

export const getProducts = async (req, res) => {
  try {
    const result = await query('SELECT * FROM product_tb WHERE isactive = $1', [true]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, description, isactive } = req.body;
  try {
    const result = await query(
      'INSERT INTO product_tb (name, price, description, isactive) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, description, isactive]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, isactive } = req.body;
    console.log('Updating product:', { id, name, description, price, isactive });
    const { rows } = await query(
      'UPDATE product_tb SET name = $1, description = $2, price = $3, isactive = $4 WHERE id = $5 RETURNING *',
      [name, description, price, isactive, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error('Error updating product:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
    });
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting product:', { id });
    const { rows } = await query('DELETE FROM product_tb WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
    });
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};