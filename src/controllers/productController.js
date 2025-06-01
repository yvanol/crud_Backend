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
  const { id } = req.params;
  const { name, price, description, isactive } = req.body;
  try {
    const result = await query(
      'UPDATE product_tb SET name = $1, price = $2, description = $3, isactive = $4 WHERE id = $5 RETURNING *',
      [name, price, description, isactive, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM product_tb WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};