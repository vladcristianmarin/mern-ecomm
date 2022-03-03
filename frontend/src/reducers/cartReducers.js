import {
	CART_ADD_ITEM,
	CART_CLEAR,
	CART_REMOVE_ITEM,
	CART_SAVE_PAYMENT_METHOD,
	CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstant';

export const cartReducer = (
	state = { cartQty: 0, cartItems: [], shippingAddress: {}, paymentMethod: '' },
	action
) => {
	switch (action.type) {
		case CART_ADD_ITEM:
			const item = action.payload;
			const existingItem = state.cartItems.find(
				(x) => x.product === item.product
			);
			if (existingItem) {
				if (action.isFixedNumber) {
					return {
						...state,
						cartItems: state.cartItems.map((x) =>
							x.product === existingItem.product ? item : x
						),
					};
				}
				item.qty = parseInt(existingItem.qty) + parseInt(item.qty);
				item.qty > item.countInStock && (item.qty = item.countInStock);
				return {
					...state,
					cartItems: state.cartItems.map((x) => {
						return x.product === existingItem.product ? item : x;
					}),
				};
			}
			return {
				...state,
				cartItems: [...state.cartItems, item],
			};
		case CART_REMOVE_ITEM:
			return {
				...state,
				cartItems: state.cartItems.filter(
					(item) => item.product !== action.payload
				),
			};
		case CART_SAVE_SHIPPING_ADDRESS:
			return { ...state, shippingAddress: action.payload };
		case CART_SAVE_PAYMENT_METHOD:
			return { ...state, paymentMethod: action.payload };
		case CART_CLEAR:
			return {
				...state,
				cartItems: [],
				cartQty: 0,
			};
		default:
			return state;
	}
};
