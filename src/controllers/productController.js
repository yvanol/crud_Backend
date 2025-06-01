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

// Add other controller functions (e.g., updateProduct, deleteProduct) as needed