import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import colors from 'colors';

import productRouter from './routes/productRouter.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3030;

app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
