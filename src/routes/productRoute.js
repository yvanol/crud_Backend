import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer admin-')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

router.get('/products', authenticate, productController.getProducts);
router.post('/products', authenticate, productController.addProduct);
router.put('/products/:id', authenticate, productController.updateProduct);
router.delete('/products/:id', authenticate, productController.deleteProduct);

export default router;