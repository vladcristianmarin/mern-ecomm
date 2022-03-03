import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
	let token = '';

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.replace('Bearer ', '');
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select('-password');
			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error('Unauthorized, invalid token!');
		}
	}

	if (!token) {
		res.status(401);
		throw new Error('Unauthorized, no token!');
	}
});

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		return next();
	}
	res.status(401);
	throw new Error('Not authorized! Admins only!');
};

export { protect, admin };
