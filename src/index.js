import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoute.js';
import authRoutes from './routes/authRoute.js';

const app = express();
const port = process.env.PORT || 3000; // Use Render's PORT or fallback to 3000

app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
    'http://localhost:5173',
    'https://crud-frontend-hu3x81ta2-rikam-yvanol-giovanis-projects.vercel.app',
    'https://crud-frontend-six-iota.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});