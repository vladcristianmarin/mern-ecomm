import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listUsers, deleteUser } from '../actions/userActions';
import ToastPopup from '../components/ToastPopup';
import { USER_UPDATE_RESET } from '../constants/userConstant';

const UserListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [showModal, setShowModal] = useState(false);
	const [showDeleteToast, setShowDeleteToast] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [showUpdateToast, setShowUpdateToast] = useState(false);
	const [deletedId, setDeletedId] = useState(null);
	const [deletedUserName, setDeletedUserName] = useState('');

	const userList = useSelector((state) => state.userList);
	const { users, loading, error } = userList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDelete = useSelector((state) => state.userDelete);
	const { success, error: deleteError, loading: deleteLoading } = userDelete;

	const userUpdate = useSelector((state) => state.userUpdate);
	const {
		success: updateSuccess,
		error: updateError,
		updatedUser,
	} = userUpdate;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			setSubmitted(false);
			return dispatch(listUsers());
		}
		navigate('/login');
	}, [dispatch, userInfo, navigate, success]);

	useEffect(() => {
		submitted && dispatch(deleteUser(deletedId));
	}, [submitted, deletedId, dispatch]);

	useEffect(() => {
		if (updateSuccess) {
			setShowUpdateToast(true);
			setTimeout(() => {
				dispatch({ type: USER_UPDATE_RESET });
			}, 3000);
		}
	}, [updateSuccess, dispatch, updatedUser]);

	const deleteHandler = (id, name) => {
		setShowModal(true);
		setDeletedId(id);
		setDeletedUserName(name);
	};

	const deleteModal = (
		<Modal show={showModal} onHide={() => setShowModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Are you sure?</Modal.Title>
			</Modal.Header>

			<Modal.Body>You are going to delete user {deletedUserName}</Modal.Body>

			<Modal.Footer>
				<Button variant='secondary' onClick={() => setShowModal(false)}>
					Close
				</Button>
				<Button
					variant='danger'
					onClick={() => {
						setSubmitted(true);
						setShowModal(false);
					}}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);

	const updateToast = updateError ? (
		<ToastPopup
			show={showUpdateToast}
			variant='success'
			title='Updating failed!'
			delay={2000}
			onCloseHandler={() => setShowUpdateToast(false)}>
			{updateError}
		</ToastPopup>
	) : (
		<ToastPopup
			show={showUpdateToast}
			variant='success'
			title='User updated!'
			delay={2000}
			onCloseHandler={() => setShowUpdateToast(false)}>
			User {updatedUser?._id} updated!
		</ToastPopup>
	);

	const deleteToast = deleteError ? (
		<ToastPopup
			show={showDeleteToast}
			variant='danger'
			title='Deleting failed!'
			delay={2000}
			onCloseHandler={() => setShowDeleteToast(false)}>
			{deleteError}
		</ToastPopup>
	) : (
		<ToastPopup
			show={showDeleteToast}
			variant='success'
			title='User deleted!'
			delay={2000}
			onCloseHandler={() => setShowDeleteToast(false)}>
			User {deletedUserName} deleted!
		</ToastPopup>
	);

	return (
		<>
			<h1>Users</h1>
			{deleteModal}
			{updateToast}
			{deleteToast}
			{(loading || deleteLoading) && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{deleteError && <Message variant='danger'>{deleteError}</Message>}
			{!loading && !error && (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>ADMIN</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, i) => (
							<tr key={i}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>
									<a href={`mailto:${user.email}`}>{user.email}</a>
								</td>
								<td
									className={`text-center ${
										user.isAdmin ? 'text-success' : 'text-danger'
									}`}>
									{user.isAdmin ? (
										<i className='fas fa-check' />
									) : (
										<i className='fas fa-times' />
									)}
								</td>
								<td>
									<Link
										className='text-info'
										to={`/admin/user/${user._id}/edit`}>
										<i className='fas fa-edit' />
									</Link>
								</td>
								<td className='text-danger'>
									<i
										className='fas fa-trash'
										style={{ cursor: 'pointer' }}
										onClick={() => {
											deleteHandler(user._id, user.name);
										}}></i>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default UserListScreen;
