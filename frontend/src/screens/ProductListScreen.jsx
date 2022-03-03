import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Modal, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ToastPopup from '../components/ToastPopup';
import { deleteProduct, listProducts } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import { useParams } from 'react-router-dom';

const ProductListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const pageNumber = useParams().pageNumber || 1;

	const [showModal, setShowModal] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [deletedId, setDeletedId] = useState(null);
	const [productName, setProductName] = useState('');

	const [showDeleteToast, setShowDeleteToast] = useState(false);
	const [showUpdateToast, setShowUpdateToast] = useState(false);

	const productList = useSelector((state) => state.productList);
	const { products, loading, error, page, pages } = productList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const productDelete = useSelector((state) => state.productDelete);
	const { success, error: deleteError } = productDelete;

	const productUpdate = useSelector((state) => state.productUpdate);
	const { updatedProduct, error: updateError } = productUpdate;

	useEffect(() => {
		if (!userInfo.isAdmin) return navigate('/login');

		if (userInfo && userInfo.isAdmin) {
			setSubmitted(false);
			dispatch(listProducts('', pageNumber));
		}
	}, [dispatch, navigate, userInfo, success, pageNumber]);

	useEffect(() => {
		if (updatedProduct && updatedProduct.name) {
			dispatch(listProducts('', pageNumber));
		}
	}, [updatedProduct, dispatch, pageNumber]);

	useEffect(() => {
		if (submitted) {
			dispatch(deleteProduct(deletedId));
		}
	}, [submitted, dispatch, deletedId]);

	useEffect(() => {
		if (updatedProduct && updatedProduct.name) {
			setShowUpdateToast(true);
		}
	}, [updatedProduct]);

	const deleteHandler = (id, name) => {
		setShowModal(true);
		setDeletedId(id);
		setProductName(name);
	};

	const createProductHandler = () => {
		navigate('/admin/product/new');
	};

	const deleteModal = (
		<Modal show={showModal} onHide={() => setShowModal(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Are you sure?</Modal.Title>
			</Modal.Header>

			<Modal.Body>You are going to delete user {productName}</Modal.Body>

			<Modal.Footer>
				<Button variant='secondary' onClick={() => setShowModal(false)}>
					Close
				</Button>
				<Button
					variant='danger'
					onClick={() => {
						setSubmitted(true);
						setShowModal(false);
						setShowDeleteToast(true);
					}}>
					Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);

	const deleteToast = deleteError ? (
		<ToastPopup
			show={showDeleteToast}
			delay={2000}
			onCloseHandler={() => {
				setShowDeleteToast(false);
			}}
			variant='danger'
			title='Deleting failed!'>
			{deleteError}
		</ToastPopup>
	) : (
		<ToastPopup
			show={showDeleteToast}
			delay={2000}
			variant='success'
			onCloseHandler={() => {
				setShowDeleteToast(false);
			}}
			title='Product deleted!'>
			Product {productName} deleted!
		</ToastPopup>
	);

	const updatedToast = updateError ? (
		<ToastPopup
			variant='danger'
			show={showUpdateToast}
			onCloseHandler={() => {
				setShowUpdateToast(false);
				dispatch({ type: PRODUCT_UPDATE_RESET });
			}}
			title='Failed'
			delay={2500}>
			Something went wrong!
		</ToastPopup>
	) : (
		<ToastPopup
			variant='success'
			show={showUpdateToast}
			onCloseHandler={() => {
				setShowUpdateToast(false);
				dispatch({ type: PRODUCT_UPDATE_RESET });
			}}
			title='Product updated'
			delay={2500}>
			Product updated successfully!
		</ToastPopup>
	);

	console.log(updatedProduct);

	return (
		<>
			{deleteModal}
			{deleteToast}
			{updatedToast}
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-end'>
					<Button className='my-3' onClick={createProductHandler}>
						<i className='fas fa-plus' /> Create Product
					</Button>
				</Col>
			</Row>
			{!loading && !error && (
				<>
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{products.map((product, i) => (
								<tr key={i}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>${product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									<td>
										<Link
											className='text-info'
											to={`/admin/product/${product._id}/edit`}>
											<i className='fas fa-edit' />
										</Link>
									</td>
									<td className='text-danger'>
										<i
											className='fas fa-trash'
											style={{ cursor: 'pointer' }}
											onClick={() => {
												deleteHandler(product._id, product.name);
											}}></i>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Paginate pages={pages} page={page} isAdmin={true} />
				</>
			)}
		</>
	);
};

export default ProductListScreen;
