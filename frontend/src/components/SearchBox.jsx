import React, { useEffect, useState } from 'react';
import { Form, Button, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
	const [keyword, setKeyword] = useState('');

	const navigate = useNavigate();

	const submitHandler = (e) => {
		e.preventDefault();
		if (keyword.trim()) {
			navigate(`/search/${keyword}`);
		}
	};

	return (
		<Form onSubmit={submitHandler} style={{ display: 'inherit' }}>
			<FormControl
				name='q'
				placeholder='Search Products...'
				className='mr-sm-3 ml-sm-5'
				onChange={(e) => setKeyword(e.target.value)}
			/>
			<Button
				type='submit'
				variant='secondary'
				className='text-primary mx-2 p-2 text-justify'
				style={{ fontSize: '1.6rem' }}>
				<i className='fas fa-search'></i>
			</Button>
		</Form>
	);
};

export default SearchBox;
