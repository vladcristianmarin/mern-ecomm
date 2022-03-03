import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import ToastPopup from '../components/ToastPopup';
import FormContainer from '../components/FormContainer';
import {
	listProductDetails,
	createProduct,
	productUpdate,
} from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

const ProductManageScreen = () => {
	const [productAction, setProductAction] = useState('create');
	const [name, setName] = useState('');
	const [image, setImage] = useState('');
	const [brand, setBrand] = useState('');
	const [category, setCategory] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [countInStock, setCountInStock] = useState(0);
	const [uploading, setUploading] = useState(false);

	const [showCreatedToast, setShowCreatedToast] = useState(false);

	const { id: productId } = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const productDetails = useSelector((state) => state.productDetails);
	const {
		loading: detailsLoading,
		error: detailsError,
		product,
	} = productDetails;

	const newProductDetails = useSelector((state) => state.productCreate);
	const {
		loading: createLoading,
		error: createError,
		newProduct,
	} = newProductDetails;

	const updatedProductDetails = useSelector((state) => state.productDetails);
	const { loading: updateLoading, error: updateError } = updatedProductDetails;

	useEffect(() => {
		if (productId) {
			setProductAction('edit');
		}
	}, [productId]);

	useEffect(() => {
		if (productAction === 'edit') {
			dispatch(listProductDetails(productId));
		}
	}, [productId, dispatch, productAction]);

	useEffect(() => {
		if (product.name) {
			setName(product.name);
			setImage(product.image);
			setBrand(product.brand);
			setCategory(product.category);
			setDescription(product.description);
			setPrice(product.price);
			setCountInStock(product.countInStock);
		}
	}, [product]);

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append('image', file);
		setUploading(true);
		try {
			const config = {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			};
			const { data } = await axios.post('/api/upload', formData, config);
			setImage(data);
			setUploading(false);
		} catch (error) {
			console.error(error);
			setUploading(false);
		}
	};

	const submitHandler = (e) => {
		e.preventDefault();
		switch (productAction) {
			case 'create': {
				dispatch(
					createProduct({
						name,
						price,
						image,
						description,
						countInStock,
						brand,
						category,
					})
				);
				setShowCreatedToast(true);
				setName('');
				setImage('');
				setBrand('');
				setCategory('');
				setDescription('');
				setPrice(0);
				setCountInStock(0);
				return dispatch({ type: PRODUCT_CREATE_RESET });
			}
			case 'edit': {
				dispatch(
					productUpdate({
						name,
						price,
						image,
						description,
						countInStock,
						brand,
						category,
						_id: product._id,
					})
				);
				return navigate('/admin/productlist');
			}
			default:
				return;
		}
	};

	const createHeading = () => {
		switch (productAction) {
			case 'edit':
				return <h1>Edit Product</h1>;
			case 'create':
				return <h1>Create new Product</h1>;
			default:
				break;
		}
	};

	const createdToast = createError ? (
		<ToastPopup
			variant='danger'
			show={showCreatedToast}
			onCloseHandler={() => {
				setShowCreatedToast(false);
			}}
			title='Failed'
			delay={2500}>
			Something went wrong!
		</ToastPopup>
	) : (
		<ToastPopup
			variant='success'
			show={showCreatedToast}
			onCloseHandler={() => {
				setShowCreatedToast(false);
			}}
			title='Created'
			delay={2500}>
			Product {newProduct?.name} Created!
		</ToastPopup>
	);

	return (
		<>
			{createdToast}
			<Link to='/admin/productlist' className='btn btn-light my-3'>
				&larr;BACK
			</Link>

			<FormContainer>
				{createHeading()}
				{createError && <Message variant='danger'>{createError}</Message>}
				{createLoading && <Loader />}{' '}
				{updateError && <Message variant='danger'>{updateError}</Message>}
				{updateLoading && <Loader />}{' '}
				{detailsError && <Message variant='danger'>{detailsError}</Message>}
				{detailsLoading && <Loader />}
				{!detailsError && !detailsLoading && (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter name'
								value={name}
								onChange={(e) => setName(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId='price'>
							<Form.Label>Price</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter price ($)'
								value={price}
								onChange={(e) =>
									setPrice(Number(e.target.value))
								}></Form.Control>
						</Form.Group>
						<Form.Group controlId='image'>
							<Form.Label>Image</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter image url'
								value={image}
								onChange={(e) => setImage(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Control
							type='file'
							id='image-form'
							label='Choose file'
							onChange={uploadFileHandler}></Form.Control>
						{uploading && <Loader />}
						<Form.Group controlId='brand'>
							<Form.Label>Brand</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter brand name'
								value={brand}
								onChange={(e) => setBrand(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId='countinstock'>
							<Form.Label>Count In Stock</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter Count In Stock'
								value={countInStock}
								onChange={(e) =>
									setCountInStock(Number(e.target.value))
								}></Form.Control>
						</Form.Group>
						<Form.Group controlId='category'>
							<Form.Label>Category</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter category'
								value={category}
								onChange={(e) => setCategory(e.target.value)}></Form.Control>
						</Form.Group>
						<Form.Group controlId='Description'>
							<Form.Label>Description</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}></Form.Control>
						</Form.Group>

						<Button className='mt-3' type='submit' variant='dark'>
							{productAction === 'edit' ? 'Update product' : 'Create New'}
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	);
};

export default ProductManageScreen;
