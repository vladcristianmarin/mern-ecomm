import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstant';

export const cartReducer = (state = { cartItems: [] }, action) => {
	switch (action.type) {
		case CART_ADD_ITEM:
			const item = action.payload;
			const existingItem = state.cartItems.find(
				(x) => x.product === item.product
			);
			if (existingItem) {
				return {
					...state,
					cartItems: state.cartItems.map((x) =>
						x.product === existingItem.product ? item : x
					),
				};
			}
			return { ...state, cartItems: [...state.cartItems, item] };
		default:
			return state;
	}
};
