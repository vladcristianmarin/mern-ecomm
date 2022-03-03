import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//* @description    Create new order
//* @route          POST /api/orders
//* @access         Private

const addOrderItems = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error('No order items!');
	}
	const order = await Order.create({
		orderItems,
		user: req.user._id,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	});

	res.status(201).send(order);
});

//* @description    Get order by ID
//* @route          GET /api/orders/:id
//* @access         Private

const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate({
		path: 'user',
		select: 'name email',
	});

	if (order) {
		return res.send(order);
	}
	res.send(404);
	throw new Error('Order not found!');
});

//* @description    Update order to paied
//* @route          PUT /api/orders/:id/pay
//* @access         Private

const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address,
		};
		const updatedOrder = await order.save();
		return res.send(updatedOrder);
	}
	res.status(404);
	throw new Error('Order not found!');
});

//* @description    Update order to delivered
//* @route          PUT /api/orders/:id/deliver
//* @access         Private / Admin

const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();
		const updatedOrder = await order.save();
		return res.send(updatedOrder);
	}
	res.status(404);
	throw new Error('Order not found!');
});

//* @description    Get logged in user orders
//* @route          GET /api/orders/myorders
//* @access         Private

const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });
	res.send(orders);
});

//* @description    Get all orders
//* @route          GET /api/orders
//* @access         Private / Admin

const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate('user', 'id name');
	res.send(orders);
});

export {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	updateOrderToDelivered,
	getMyOrders,
	getOrders,
};
