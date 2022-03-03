import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name='description' content={description} />
			<meta name='keyWords' content={keywords} />
		</Helmet>
	);
};

Meta.defaultProps = {
	title: 'ProShop',
	description: 'We sell the best electronics!',
	keywords: 'electronics, cheap electronics, ',
};

export default Meta;
