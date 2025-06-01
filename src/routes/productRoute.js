import express from 'express';
import * as productController from '../controllers/productController.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/products', authenticate, productController.getProducts);
router.post('/products', authenticate, productController.createProduct);
router.put('/products/:id', authenticate, productController.updateProduct);
router.delete('/products/:id', authenticate, productController.deleteProduct);

export default router;