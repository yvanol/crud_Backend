import { query } from '../db.js';

export const getProducts = async (req, res) => {
  try {
    console.log('Fetching products from product_tb');
    const { rows } = await query('SELECT * FROM product_tb');
    console.log('Products fetched:', rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching products:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
    });
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, isactive } = req.body;
    console.log('Adding product:', { name, description, price, isactive });
    if (!name || !description || price === undefined || isactive === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const { rows } = await query(
      'INSERT INTO product_tb (name, description, price, isactive) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, isactive]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding product:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
    });
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
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