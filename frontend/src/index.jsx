import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import store from './store';
import './bootstrap.min.css';
import './index.css';
import App from './App';

ReactDOM.render(
	<Provider store={store}>
		<>
			<Helmet>
				<meta name='theme-color' content='rgb(52,58,61)' />
				<meta
					name='theme-color'
					content='rgb(52,58,61)'
					media='(prefers-color-scheme: light)'
				/>
				<meta
					name='theme-color'
					content='rgb(52,58,61)'
					media='(prefers-color-scheme: dark)'
				/>
			</Helmet>
			<App />
		</>
	</Provider>,
	document.getElementById('root')
);
