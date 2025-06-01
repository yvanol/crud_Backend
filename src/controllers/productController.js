import * as productService from '../services/productService.js';

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, isactive } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({ error: 'Name, price, and description are required' });
    }
    const product = await productService.createProducts({ name, price, description, isactive });
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, isactive } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({ error: 'Name, price, and description are required' });
    }
    const product = await productService.updateProduct(id, { name, price, description, isactive });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await productService.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};