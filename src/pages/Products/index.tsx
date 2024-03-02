import { useCallback, useEffect, useState } from 'react';
import ProductCardsList from './ProductCardsList';
import Cart from '../../component/Cart';
import { useCart } from '../../context/CartContext';
import SearchInput from '../../component/SearchInput';
// import debounce from 'lodash/debounce';
import Filter from '../../component/Filter';
import { ProductCategory } from './models';
import { getCategories, getFilteredProducts } from './helper';

const Products = () => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	console.log('🚀 ~ Products ~ categories:', products, categories);
	const [searchTerm, setSearchTerm] = useState('');
	console.log('🚀 ~ Products ~ searchTerm:', searchTerm);
	const [filterTerm, setFilterTerm] = useState('');
	const { cart } = useCart();

	// unit test
	const productCount = cart.reduce((acc, item) => acc + item.quantity, 0);

	useEffect(() => {
		Promise.all([getFilteredProducts(), getCategories()])
			.then(([products, catagories]) => {
				setProducts(products.data);
				setCategories(catagories);
			})
			.catch(e => {
				console.log('🚀 ~ useEffect ~ e:', e);
			});
	}, []);

	const debounceSearch = useCallback(
		async (searchTerm: string, filterTerm: string) => {
			try {
				const response = await getFilteredProducts(
					`search=${searchTerm}&category=${filterTerm}`,
				);
				setProducts(response.data);
			} catch (error) {
				console.error('Error fetching products', error);
			}
		},
		[],
	);

	useEffect(() => {
		debounceSearch(searchTerm, filterTerm);
	}, [searchTerm, filterTerm, debounceSearch]);

	return (
		<div>
			<SearchInput
				handleSearch={event => {
					console.log(event.target.value);
					setSearchTerm(event.target.value);
				}}
			/>
			<Filter
				options={[
					{ label: 'Category 1', value: ProductCategory.ELECTRONICS },
					{ label: 'Category 2', value: ProductCategory.CLOTHING },
				]}
				handleFilter={value => setFilterTerm(value.join(','))}
			/>
			<Cart count={productCount} handleCartClick={() => {}} />
			<ProductCardsList products={products} />
		</div>
	);
};

export default Products;
