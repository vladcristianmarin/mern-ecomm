import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, userUpdateProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderAction';

const ProfileScreen = () => {
	const [userData, setUserData] = useState({});
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);
	const [success, setSuccess] = useState(false);
	const [updateError, setUpdateError] = useState(false);

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const {
		loading,
		error: detailsError,
		user: userDetails,
	} = useSelector((state) => state.userDetails);

	const {
		loading: loadingOrders,
		error: errorOrders,
		orders,
	} = useSelector((state) => state.orderMyList);

	const { userInfo } = useSelector((state) => state.userLogin);

	const { userInfo: userInfoUpdated } = useSelector(
		(state) => state.userUpdateProfile
	);

	const { success: updateSuccess, error: updateErrorState } = useSelector(
		(state) => state.userUpdateProfile
	);

	useEffect(() => {
		if (!userInfo) {
			return navigate('/login');
		}
		if (!userData.name) {
			dispatch(getUserDetails('profile'));
			dispatch(listMyOrders());
		}
	}, [navigate, userInfo, dispatch, userData]);

	useEffect(() => {
		if (userInfoUpdated) {
			setUserData({ ...userInfoUpdated });
		} else if (userDetails) {
			setUserData({ ...userDetails });
		}
	}, [userInfoUpdated, userDetails]);

	const submitHandler = (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			return setMessage('Passwords do not match');
		}
		dispatch(
			userUpdateProfile({
				id: userData._id,
				name: userData.name,
				email: userData.email,
				password,
			})
		);
		setSuccess(updateSuccess);
		setUpdateError(updateErrorState);
	};

	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{message && <Message variant='danger'>{message}</Message>}
				{success && <Message variant='success'>Profile updated</Message>}
				{detailsError && <Message variant='danger'>{detailsError}</Message>}
				{updateError && <Message variant='danger'>{updateError}</Message>}
				{loading && <Loader />}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name'>
						<Form.Label>Name</Form.Label>
						<Form.Control
							type='name'
							placeholder='Enter name'
							value={userData.name || ''}
							onChange={(e) =>
								setUserData((prev) => {
									return { ...prev, name: e.target.value };
								})
							}></Form.Control>
					</Form.Group>
					<Form.Group controlId='email'>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type='email'
							placeholder='Enter email'
							value={userData.email || ''}
							onChange={(e) =>
								setUserData((prev) => {
									return { ...prev, email: e.target.value };
								})
							}></Form.Control>
					</Form.Group>
					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Enter password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}></Form.Control>
					</Form.Group>
					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm password'
							value={confirmPassword}
							onChange={(e) =>
								setConfirmPassword(e.target.value)
							}></Form.Control>
					</Form.Group>
					<Button className='mt-3' type='submit' variant='dark'>
						Update
					</Button>
				</Form>
			</Col>
			<Col md={9}>
				<h1>My orders</h1>
				{loadingOrders && <Loader />}
				{errorOrders && <Message variant='danger'>{errorOrders}</Message>}
				{orders && orders.length === 0 && (
					<Message variant='info'>You have 0 orders placed</Message>
				)}
				{!loadingOrders && !errorOrders && orders && orders.length > 0 && (
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>DATE</th>
								<th>TOTAL</th>
								<th>PAID</th>
								<th>DELIVERED</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order, i) => (
								<tr key={i}>
									<td>{order._id}</td>
									<td>{order.createdAt.substring(0, 10)}</td>
									<td>${order.totalPrice}</td>
									<td
										className={!order.isPaid ? 'text-center text-danger' : ''}>
										{order.isPaid ? (
											order.paidAt.substring(0, 10)
										) : (
											<i className='fas fa-times'></i>
										)}
									</td>
									<td
										className={
											!order.isDelivered ? 'text-center text-danger' : ''
										}>
										{order.isDelivered ? (
											order.deliveredAt.substring(0, 10)
										) : (
											<i className='fas fa-times'></i>
										)}
									</td>
									<td>
										<LinkContainer to={`/order/${order._id}`}>
											<Button className='btn-sm' variant='info'>
												Details
											</Button>
										</LinkContainer>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Col>
		</Row>
	);
};

export default ProfileScreen;
