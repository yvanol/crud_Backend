import { authenticateAdmin, createAdmin } from '../services/authService.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }
    const admin = await authenticateAdmin(name, password);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, name: admin.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', { message: err.message, stack: err.stack });
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }
    const admin = await createAdmin(name, password);
    res.status(201).json({ message: 'Admin created', admin });
  } catch (err) {
    console.error('Error during registration:', { message: err.message, stack: err.stack });
    if (err.message === 'User already exists') {
      return res.status(409).json({ message: 'User already exists' });
    }
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
