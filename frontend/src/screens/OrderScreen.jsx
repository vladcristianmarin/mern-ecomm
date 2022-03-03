import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { deliverOrder, getOrderDetails } from '../actions/orderAction';
import { payOrder } from '../actions/orderAction';
import { ORDER_PAY_RESET } from '../constants/orderConstants';
import { ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderScreen = () => {
	const dispatch = useDispatch();
	const { id: orderId } = useParams();

	const navigate = useNavigate();

	const [sdkReady, setSdkReady] = useState(false);

	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, loading, error } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const {
		loading: loadingPay,
		success: successPay,
		error: errorPay,
	} = orderPay;

	const orderDeliver = useSelector((state) => state.orderDeliver);
	const {
		loading: deliverLoading,
		error: deliverError,
		success: deliverSuccess,
	} = orderDeliver;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		!userInfo && navigate('/login');

		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get('/api/config/paypal');
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
			script.async = true;
			script.onload = () => {
				setSdkReady(true);
			};
			document.body.appendChild(script);
		};

		if (
			order._id !== orderId ||
			Object.keys(order).length === 0 ||
			successPay ||
			deliverSuccess
		) {
			dispatch(getOrderDetails(orderId));
			dispatch({ type: ORDER_PAY_RESET });
			dispatch({ type: ORDER_DELIVER_RESET });
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [
		dispatch,
		orderId,
		successPay,
		deliverSuccess,
		order,
		navigate,
		userInfo,
	]);

	const successPaymentHandler = (paymentResult) => {
		dispatch(payOrder(orderId, paymentResult));
	};

	const deliverHandler = () => {
		dispatch(deliverOrder(orderId));
	};

	return (
		<>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{!loading && !error && (
				<>
					<h1>Order {orderId}</h1>
					<Row>
						<Col md={8}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h2>Shipping</h2>
									<p>
										<strong>Name: </strong>
										{order.user.name}
									</p>
									<p>
										<strong>Email: </strong>
										<a href={`mailto:${order.user.email}`}>
											{order.user.email}
										</a>
									</p>
									<p>
										<strong>Address:</strong> {order.shippingAddress.address},{' '}
										{order.shippingAddress.city},{' '}
										{order.shippingAddress.postalCode},{' '}
										{order.shippingAddress.country}
									</p>
									{order.isDelivered ? (
										<Message variant='success'>
											Delivered on {order.deliveredAt}
										</Message>
									) : (
										<Message variant='danger'>Not delivered</Message>
									)}
									{userInfo &&
										userInfo.isAdmin &&
										order.isPaid &&
										!order.isDelivered && (
											<>
												{deliverError && (
													<Message variant='danger'>{deliverError}</Message>
												)}
												{deliverLoading && <Loader />}
												<Button type='button' onClick={deliverHandler}>
													Mark as delivered
												</Button>
											</>
										)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Payment Method</h2>
									<p>
										<strong>Method: </strong>
										{order.paymentMethod}
									</p>
									{order.isPaid ? (
										<Message variant='success'>Paid on {order.paidAt}</Message>
									) : (
										<Message variant='danger'>Not Paid</Message>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Order Items</h2>
									{order.orderItems.length === 0 ? (
										<Message variant='danger'>Order is empty!</Message>
									) : (
										<ListGroup variant='flush'>
											{order.orderItems.map((item, i) => (
												<ListGroup.Item key={i}>
													<Row>
														<Col md={1}>
															<Image
																src={item.image}
																alt={item.name}
																fluid
																rounded
															/>
														</Col>
														<Col>
															<Link to={`/product/${item.product}`}>
																{item.name}
															</Link>
														</Col>
														<Col md={4}>
															<p>
																{item.qty} x ${item.price} = $
																{Number(item.qty * item.price).toFixed(2)}
															</p>
														</Col>
													</Row>
												</ListGroup.Item>
											))}
										</ListGroup>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={4}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<h2>Order Summary</h2>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Items</Col>
											<Col>
												$
												{(
													order.totalPrice -
													order.shippingPrice -
													order.taxPrice
												).toFixed(2)}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Shipping</Col>
											<Col>${order.shippingPrice.toFixed(2)}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Tax</Col>
											<Col>${order.taxPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Total</Col>
											<Col>${order.totalPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										{error && <Message variant='danger'>{error}</Message>}
										{errorPay && <Message variant='danger'>{errorPay}</Message>}
									</ListGroup.Item>
									{!order.isPaid && (
										<ListGroup.Item>
											{loadingPay && <Loader />}
											{!sdkReady && <Loader />}
											{sdkReady && (
												<PayPalButton
													amount={order.totalPrice}
													onSuccess={successPaymentHandler}
												/>
											)}
										</ListGroup.Item>
									)}
									{order.isPaid && (
										<ListGroup.Item>
											<Button
												className='col-12'
												variant='success'
												disabled={true}>
												Order paid!
											</Button>
										</ListGroup.Item>
									)}
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default OrderScreen;
