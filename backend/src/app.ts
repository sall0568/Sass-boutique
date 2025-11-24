import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.middleware';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import stockRoutes from './routes/stock.routes';
import saleRoutes from './routes/sale.routes';
import expenseRoutes from './routes/expense.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/stock', stockRoutes);
app.use('/sales', saleRoutes);
app.use('/expenses', expenseRoutes);
app.use('/dashboard', dashboardRoutes);

// Error Handler
app.use(errorHandler);

export default app;
