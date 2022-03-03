import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//* @description    Fetch all products
//* @route          GET /api/products
//* @access         Public

const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10;
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword,
					$options: 'i',
				},
		  }
		: {};

	const count = await Product.count({ ...keyword });
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	res.send({ products, page, pages: Math.ceil(count / pageSize) });
});

//* @description    Fetch single product
//* @route          GET /api/products/:id
//* @access         Public

const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		return res.send(product);
	}
	res.status(404);
	throw new Error('Product not found');
});

//* @description    Delete a product
//* @route          DELETE /api/products/:id
//* @access         Private / Admin

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		await product.remove();
		return res.send({ message: 'Product deleted!' });
	}
	res.status(404);
	throw new Error('Product not found');
});

//* @description    Create new product
//* @route          POST /api/products
//* @access         Private / Admin

const createProduct = asyncHandler(async (req, res) => {
	!req.body.image && (req.body.image = '/images/default.png');
	const product = await Product.create({ ...req.body, user: req.user._id });
	res.send(product);
});

//* @description    Update a product
//* @route          PUT /api/products/:id
//* @access         Private / Admin

const updateProduct = asyncHandler(async (req, res) => {
	const { name, price, description, image, brand, category, countInStock } =
		req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		product.name = name;
		product.price = price;
		product.description = description;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.countInStock = countInStock;

		await product.save();
		return res.send(product);
	}
	res.status(404);
	throw new Error('Product not found!');
});

//* @description    Create new review
//* @route          POST /api/products/:id/reviews
//* @access         Private

const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;
	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = product.reviews.find(
			(review) => review.user.toString() === req.user._id.toString()
		);

		if (alreadyReviewed) {
			res.status(400);
			throw new Error('Product already reviewed!');
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		};

		product.reviews.push(review);
		product.numReviews = product.reviews.length;
		product.rating =
			product.reviews.reduce((acc, curr) => curr.rating + acc, 0) /
			product.reviews.length;

		await product.save();
		return res.status(201).send({ message: 'Review added!' });
	}
	res.status(404);
	throw new Error('Product not found!');
});

//* @description    Get top rated products
//* @route          GET /api/products/top
//* @access         Public

const getTopProducts = asyncHandler(async (_req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);
	res.send(products);
});

export {
	getProducts,
	getTopProducts,
	getProductById,
	deleteProduct,
	createProductReview,
	createProduct,
	updateProduct,
};
