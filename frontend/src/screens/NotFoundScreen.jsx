import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundScreen = () => {
	return (
		<>
			<Link to='/'>&larr;Go Back</Link>
			<Container className='text-center'>
				<h1>404 Page not found</h1>
			</Container>
		</>
	);
};

export default NotFoundScreen;
