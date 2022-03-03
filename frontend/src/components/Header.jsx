import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';

const Header = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [userInfo, setUserInfo] = useState(null);
	const [qty, setQty] = useState(0);

	const userDataFromLogin = useSelector((state) => state.userLogin);
	const userDataFromUpdate = useSelector((state) => state.userUpdateProfile);
	const cart = useSelector((state) => state.cart);

	useEffect(() => {
		if (userDataFromUpdate?.userInfo) {
			setUserInfo({
				...userDataFromLogin.userInfo,
				...userDataFromUpdate.userInfo,
			});
		} else if (userDataFromLogin?.userInfo) {
			setUserInfo({ ...userDataFromLogin.userInfo });
		} else {
			setUserInfo(null);
		}
		setQty(cart.cartItems.reduce((acc, item) => acc + parseInt(item.qty), 0));
	}, [userDataFromLogin, userDataFromUpdate, cart]);

	const logoutHandler = (e) => {
		e.preventDefault();
		dispatch(logout());
		setUserInfo(null);
	};

	return (
		<header>
			<Navbar bg='light' variant='light' expand='lg' collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>ProShop</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<SearchBox />
						<Nav className='ms-auto'>
							<LinkContainer to='/cart'>
								<Nav.Link
									className='position-relative'
									onClick={() => {
										navigate('/cart');
									}}>
									<i className='fas fa-shopping-cart' />
									{qty > 0 && <span className='cart-items-counter'>{qty}</span>}
									Cart
								</Nav.Link>
							</LinkContainer>

							{userInfo && userInfo.isAdmin && (
								<NavDropdown className='mx-0' title='ADMIN' id='adminmenu'>
									<LinkContainer to='/admin/userList'>
										<NavDropdown.Item>Users</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/productlist'>
										<NavDropdown.Item>Products</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/orderlist'>
										<NavDropdown.Item>Orders</NavDropdown.Item>
									</LinkContainer>
								</NavDropdown>
							)}

							{userInfo && (
								<NavDropdown
									className='mx-0'
									title={userInfo.name}
									id='username'>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							)}
							{!userInfo && (
								<LinkContainer to='/login'>
									<Nav.Link>
										<i className='fas fa-user' />
										Sign In
									</Nav.Link>
								</LinkContainer>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
