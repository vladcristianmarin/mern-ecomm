import React, { useEffect } from 'react';
import {
	Link,
	useParams,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';
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
import { addToCart } from '../actions/cartActions';

const CartScreen = () => {
	const { id: productId } = useParams();
	const [searchParams] = useSearchParams();
	const qty = searchParams.get('qty') !== null ? searchParams.get('qty') : 1;

	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);

	const { cartItems } = cart;

	useEffect(() => {
		productId && dispatch(addToCart(productId, qty));
	}, [productId, qty, dispatch]);

	return <div>CartScreen</div>;
};

export default CartScreen;
