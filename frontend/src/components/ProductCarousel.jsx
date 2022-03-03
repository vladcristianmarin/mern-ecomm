import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/productActions';

const ProductCarousel = () => {
	const dispatch = useDispatch();

	const productsTopRated = useSelector((state) => state.productsTopRated);
	const { loading, error, topProducts } = productsTopRated;

	useEffect(() => {
		dispatch(listTopProducts());
	}, [dispatch]);

	return (
		<>
			{loading && <Loader />}
			{error && <Message variant='danger'>{error}</Message>}
			{!loading && !error && (
				<Carousel pause='hover' className='bg-dark'>
					{topProducts.map((product, i) => {
						return (
							<Carousel.Item key={i}>
								<Link to={`/product/${product._id}`}>
									<Image src={product.image} alt={product.name}></Image>
									<Carousel.Caption className='carousel-caption'>
										<h2 style={{ color: '#fff' }}>
											{product.name} ({product.price})
										</h2>
									</Carousel.Caption>
								</Link>
							</Carousel.Item>
						);
					})}
				</Carousel>
			)}
		</>
	);
};

export default ProductCarousel;
