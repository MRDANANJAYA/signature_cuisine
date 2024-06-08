import React, { createContext, useState,useMemo } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
	const [itemsCount, setItemsCount] = useState(0);

	const values = useMemo(
		() => ({
			itemsCount,
			setItemsCount,
		}),
		[itemsCount],
	);

	return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};
