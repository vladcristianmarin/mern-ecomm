import React from 'react';
import { ToastContainer, Toast, ToastHeader } from 'react-bootstrap';
import ReactDOM from 'react-dom';

const ToastPopup = ({
	children,
	show,
	variant,
	title,
	delay,
	onCloseHandler,
}) => {
	const portal = document.getElementById('toast');

	return ReactDOM.createPortal(
		<ToastContainer className='p-4 mw-100 sticky-top-right'>
			<Toast
				style={{ width: '25rem' }}
				show={show}
				className='d-inline-block m-1'
				bg={variant}
				delay={delay}
				autohide={true}
				onClose={onCloseHandler}>
				<ToastHeader closeButton={false}>
					<strong className='me-auto'>{title}</strong>
					<Toast.Body>{children}</Toast.Body>
				</ToastHeader>
			</Toast>
		</ToastContainer>,
		portal
	);
};

ToastPopup.defaultProps = {
	show: true,
	variant: 'success',
	title: 'Default',
	delay: 3000,
};

export default ToastPopup;
