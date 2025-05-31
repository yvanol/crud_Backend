import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoute.js';
import authRoutes from './routes/authRoute.js';

const app = express();
const port = 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});