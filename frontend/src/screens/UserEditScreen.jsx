import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, userUpdate } from '../actions/userActions';

const UserEditScreen = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);

	const { id: userId } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userDetails = useSelector((state) => state.userDetails);
	const { loading, error, user } = userDetails;

	const {
		loading: updateLoading,
		error: updateError,
		success: updateSuccess,
	} = useSelector((state) => state.userUpdate);

	useEffect(() => {
		if (updateSuccess) {
			return navigate('/admin/userlist');
		}
		if (!user.name || user._id !== userId)
			return dispatch(getUserDetails(userId));
		setName(user.name);
		setEmail(user.email);
		setIsAdmin(user.isAdmin);
	}, [user, dispatch, userId, updateSuccess, navigate]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(userUpdate({ _id: userId, name, email, isAdmin }));
	};

	return (
		<>
			<Link to='/admin/userlist' className='btn btn-light my-3'>
				&larr;BACK
			</Link>

			<FormContainer>
				<h1>Edit User</h1>
				{error && <Message variant='danger'>{error}</Message>}
				{loading && <Loader />}
				{updateLoading && <Loader />}
				{updateError && <Message variant='danger'>{updateError}</Message>}
				{!error && !loading && (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='name'
								placeholder='Enter name'
								value={name}
								onChange={(e) => setName(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId='isadmin'>
							<Form.Check
								type='checkbox'
								label='Is Admin'
								checked={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
						</Form.Group>
						<Button className='mt-3' type='submit' variant='dark'>
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default UserEditScreen;
