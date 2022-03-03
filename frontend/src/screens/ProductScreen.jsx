import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
	Row,
	Col,
	Image,
	ListGroup,
	Card,
	Button,
	Form,
	FormGroup,
	FormLabel,
	FormControl,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import {
	listProductDetails,
	createProductReview,
} from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ToastPopup from '../components/ToastPopup';
import { addToCart } from '../actions/cartActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import Meta from '../components/Meta';

const ProductScreen = () => {
	const { id } = useParams();

	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');
	const [showAddToCartToast, setShowAddToCartToast] = useState(false);
	const [showReviewToast, setShowReviewToast] = useState(false);

	console.log(showReviewToast);

	const dispatch = useDispatch();

	const productDetails = useSelector((state) => state.productDetails);
	const { loading, error, product } = productDetails;

	const productCreateReview = useSelector((state) => state.productCreateReview);
	const {
		loading: reviewLoading,
		error: reviewError,
		success: reviewSuccess,
	} = productCreateReview;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	console.log(reviewError);

	useEffect(() => {
		if (reviewSuccess) {
			setShowReviewToast(true);
			setRating(0);
			setComment('');
			dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
		}
		dispatch(listProductDetails(id));
	}, [dispatch, id, reviewSuccess, reviewError]);

	const addToCartHandler = (e) => {
		e.preventDefault();
		dispatch(addToCart(id, qty));
		setShowAddToCartToast(true);
	};

	const reviewHandler = (e) => {
		e.preventDefault();
		dispatch(createProductReview(id, { rating, comment }));
	};

	const stockClassNames =
		product.countInStock > 0 ? 'text-success' : 'text-danger';

	const toCartToast = error ? (
		<ToastPopup
			show={showAddToCartToast}
			title='Failed'
			onCloseHandler={() => setShowAddToCartToast(false)}>
			Something went wrong!
		</ToastPopup>
	) : (
		<ToastPopup
			show={showAddToCartToast}
			onCloseHandler={() => setShowAddToCartToast(false)}
			title='Item added'>
			{`${product.name} x ${qty}`}
			<br />
			<Link to='/cart'>Go to cart &rarr;</Link>
		</ToastPopup>
	);

	const reviewToast = reviewError ? (
		<ToastPopup
			show={typeof reviewError === 'string'}
			title='Failed'
			variant='danger'
			delay={3000}
			onCloseHandler={() => {
				dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
				setShowReviewToast(false);
			}}>
			Something went wrong!
		</ToastPopup>
	) : (
		<ToastPopup
			show={showReviewToast}
			onCloseHandler={() => setShowReviewToast(false)}
			title='Review created'>
			Successfully!
		</ToastPopup>
	);

	return (
		<>
			<Meta title={product.name}></Meta>
			{toCartToast}
			{reviewToast}
			<Link className='btn btn-dark my-3' to='/'>
				Go Back
			</Link>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{!loading && !error && (
				<>
					<Row>
						<Col md={6}>
							<Image src={product.image} alt={product.name} fluid />
						</Col>
						<Col md={3}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h2>{product.name}</h2>
								</ListGroup.Item>
								<ListGroup.Item>
									<Rating
										value={product.rating}
										text={`${product.numReviews} reviews`}
									/>
								</ListGroup.Item>
								<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
								<ListGroup.Item>
									Description: {product.description}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<Row>
											<Col>Price:</Col>
											<Col>
												<strong>${product.price}</strong>
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Status:</Col>
											<Col className={stockClassNames}>
												{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
											</Col>
										</Row>
									</ListGroup.Item>
									{product.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col htmlFor='selectQtyForm' className='form-label'>
													Qty
												</Col>
												<Col>
													<Form.Control
														id='selectQtyForm'
														as='select'
														className='form-select'
														value={qty}
														onChange={(e) => {
															setQty(e.target.value);
														}}>
														{[...Array(product.countInStock).keys()].map(
															(x, i) => (
																<option key={i} value={x + 1}>
																	{x + 1}
																</option>
															)
														)}
													</Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
									)}
								</ListGroup>
								<ListGroup.Item>
									<Button
										className='btn-dark'
										type='button'
										disabled={product.countInStock === 0}
										onClick={addToCartHandler}>
										Add To Cart
									</Button>
								</ListGroup.Item>
							</Card>
						</Col>
					</Row>
					<Row className='mt-3'>
						<Col md={6}>
							<h2>Reviews</h2>
							{product.reviews.length === 0 && <Message>No reviews</Message>}
							<ListGroup variant='flush'>
								{product.reviews.map((review, i) => (
									<ListGroup.Item key={i}>
										<strong>{review.name}</strong>
										<Rating value={review.rating}></Rating>
										<p>{new Date(review.createdAt).toLocaleString('en-US')}</p>
									</ListGroup.Item>
								))}
								<ListGroup.Item>
									<h2>Write a review</h2>
									{reviewError && (
										<Message variant='danger'>{reviewError}</Message>
									)}
									{reviewLoading && <Loader />}
									{userInfo && (
										<Form onSubmit={reviewHandler}>
											<FormGroup controlId='rating'>
												<FormLabel>Rating</FormLabel>
												<FormControl
													as='select'
													value={rating}
													onChange={(e) => {
														setRating(e.target.value);
													}}>
													<option value=''>Select...</option>
													<option value='1'>1 - Poor</option>
													<option value='2'>2 - Fair</option>
													<option value='3'>3 - Good</option>
													<option value='4'>4 - Very Good</option>
													<option value='5'>5 - Excellent</option>
												</FormControl>
											</FormGroup>
											<FormGroup controlId='comment'>
												<FormLabel>Comment</FormLabel>
												<FormControl
													as='textarea'
													value={comment}
													rows={3}
													onChange={(e) =>
														setComment(e.target.value)
													}></FormControl>
											</FormGroup>
											<Button type='submit' variant='primary'>
												Submit
											</Button>
										</Form>
									)}
									{!userInfo && (
										<Message>
											<Link to='/login'>Please sign in</Link> to write a review
										</Message>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default ProductScreen;
