import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

//* @description    Auth user && get token
//* @route          POST /api/users/login
//* @access         Public

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password.toString()))) {
		return res.send({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	}
	res.status(401);
	throw new Error('Invalid email or password!');
});

//* @description    Register new user
//* @route          POST /api/users
//* @access         Public

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists!');
	}

	const user = await User.create({ name, email, password });

	if (user) {
		return res.status(201).send({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	}
	res.status(400);
	throw new Error('Invalid user data');
});

//* @description    Get user profile
//* @route          GET /api/users/profile
//* @access         Private

const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	if (user) {
		return res.send({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	}
	res.status(404);
	throw new Error('User not found!');
});

//* @description    Update user profile
//* @route          PUT /api/users/profile
//* @access         Private

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		req.body.password && (user.password = req.body.password);
		const updatedUser = await user.save();
		return res.send({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
			token: generateToken(updatedUser._id),
		});
	}
});

//* @description    Get all users
//* @route          GET /api/users
//* @access         Private / Admin

const getUsers = asyncHandler(async (_req, res) => {
	const users = await User.find({});
	res.send(users);
});

//* @description    Delete a user
//* @route          DELETE /api/users/:id
//* @access         Private / Admin

const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		await user.remove();
		return res.send({ message: 'User removed!' });
	}
	res.status(404);
	throw new Error('User not found!');
});

//* @description    Get a user by id
//* @route          GET /api/users/:id
//* @access         Private / Admin

const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');
	if (user) {
		return res.send(user);
	}
	res.status(404);
	throw new Error('User not found!');
});

//* @description    Update any user profile
//* @route          PUT /api/users/:id
//* @access         Private / Admin

const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;
		const updatedUser = await user.save();
		return res.send({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			isAdmin: updatedUser.isAdmin,
		});
	}
	res.status(404);
	throw new Error('User not found!');
});

export {
	authUser,
	getUserProfile,
	updateUserProfile,
	registerUser,
	getUsers,
	getUserById,
	deleteUser,
	updateUser,
};
