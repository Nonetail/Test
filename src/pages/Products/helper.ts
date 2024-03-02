export const getFilteredProducts = async (query?: string) => {
	const response = await fetch(`http://localhost:3000/products?${query}`);
	return await response.json();
};

export const getCategories = async () => {
	const response = await fetch(`http://localhost:3000/products/catagories`);
	return await response.json();
};
