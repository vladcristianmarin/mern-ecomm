import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderAction';

const OrderListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const orderList = useSelector((state) => state.orderList);
	const { orders, loading, error } = orderList;

	console.log(orders);

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			return dispatch(listOrders());
		}
		navigate('/login');
	}, [dispatch, userInfo, navigate]);

	return (
		<>
			<h1>Users</h1>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{!loading && !error && (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>USER NAME</th>
							<th>VALUE</th>
							<th>PAYMENT</th>
							<th>ORDERED</th>
							<th>DELIVERED</th>
							<th>PAID</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{orders.map((order, i) => (
							<tr key={i}>
								<td>{order._id}</td>
								<td>{order.user.name}</td>
								<td>{order.totalPrice}$</td>
								<td>{order.paymentMethod}</td>
								<td>{new Date(order.createdAt).toLocaleString('us-EN')}</td>
								<td
									className={`text-center ${
										order.isDelivered ? 'text-success' : 'text-danger'
									}`}>
									{order.isDelivered ? (
										<i className='fas fa-check' />
									) : (
										<i className='fas fa-times' />
									)}
								</td>
								<td
									className={`text-center ${
										order.isPaid ? 'text-success' : 'text-danger'
									}`}>
									{order.isPaid ? (
										<i className='fas fa-check' />
									) : (
										<i className='fas fa-times' />
									)}
								</td>
								<td>
									<Button
										type='button'
										className='btn-sm'
										variant='light'
										onClick={() => navigate(`/order/${order._id}`)}>
										Details &rarr;
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default OrderListScreen;
