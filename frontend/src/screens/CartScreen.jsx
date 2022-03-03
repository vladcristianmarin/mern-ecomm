import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
} from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = () => {
	const cart = useSelector((state) => state.cart);

	const dispatch = useDispatch();

	const navigate = useNavigate();

	const { cartItems } = cart;

	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id));
	};

	const checkoutHandler = () => {
		navigate(`/login?redirect=/shipping`, { replace: true });
	};

	return (
		<Row>
			<Col md={8}>
				<h1>Shopping Cart</h1>
				{cartItems.length === 0 ? (
					<Message>
						Your cart is empty <Link to='/'>Go Back</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
						{cartItems.map((item) => (
							<ListGroup.Item className='pt-3' key={item.product}>
								<Row>
									<Col md={2}>
										<Image src={item.image} alt={item.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
									</Col>
									<Col md={2}>${item.price}</Col>
									<Col md={2}>
										<Form.Control
											id='selectQtyForm'
											as='select'
											value={item.qty}
											className='form-select'
											onChange={(e) => {
												dispatch(
													addToCart(item.product, Number(e.target.value), true)
												);
											}}>
											{[...Array(item.countInStock).keys()].map((x, i) => (
												<option key={i} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</Col>
									<Col md={2}>
										<Button
											type='button'
											variant='light'
											onClick={() => removeFromCartHandler(item.product)}>
											<i className='fas fa-trash' />
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={4}>
				<Card bg='light' text='dark'>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h4>
								Subtotal (
								{cartItems.reduce((acc, item) => acc + parseInt(item.qty), 0)})
								items
							</h4>
							<h6>
								$
								{cartItems
									.reduce((acc, item) => acc + item.qty * item.price, 0)
									.toFixed(2)}
							</h6>
						</ListGroup.Item>
						<ListGroup.Item
							action
							variant='dark'
							className='text-center'
							disabled={cartItems.length === 0}
							onClick={checkoutHandler}>
							<strong>Proceed To Checkout &rarr;</strong>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	);
};

export default CartScreen;
