import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from './index';

const mockProducts = {
	data: [
		{
			id: 1,
			imgSrc: 'https://picsum.photos/200',
			imgAltText: 'Product 1 Image',
			heading: 'Product 1',
			description: 'Description for Product 1.',
			category: 'electronics',
			price: 99.99,
		},
		{
			id: 2,
			imgSrc: 'https://picsum.photos/200',
			imgAltText: 'Product 2 Image',
			heading: 'Product 2',
			description: 'Description for Product 2.',
			category: 'clothing',
			price: 49.99,
		},
	],
};

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

jest.mock('../../context/CartContext', () => ({
	useCart: () => ({
		cart: [],
	}),
}));

jest.mock('../../pages/Products/helper', () => ({
	getFilteredProducts: jest.fn(() => Promise.resolve(mockProducts)),
	getCategories: jest.fn(() => Promise.resolve(mockProducts)),
}));

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

describe('Products Component', () => {
	beforeAll(() => {
		// const fetch = jest.spyOn(window, 'fetch');
	});

	test.only('renders products correctly', async () => {
		render(<Products />);
		screen.debug();
		await screen.findByText('Product 1');
		// mockProducts.forEach(product => {
		// 	expect(screen.getByText(product.heading)).toBeInTheDocument();
		// });
	});

	test('updates products on search and filter', async () => {
		render(<Products />);

		const getFilter = jest.fn();
		await screen.findByText('Product 1');

		// need to change
		fireEvent.change(screen.getByRole('textbox'), {
			target: { value: 'searchTerm' },
		});

		fireEvent.click(screen.getByText('Category 1'));

		// Check if products are updated based on search and filter
		await waitFor(() => {
			expect(getFilter).toHaveBeenCalledWith(
				'http://localhost:3000/products?search=searchTerm&category=electronics',
			);
		});
	});

	// Add more tests as needed for different scenarios (e.g., edge cases, loading states, etc.)
});
