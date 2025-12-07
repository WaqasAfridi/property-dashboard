// src/context/PropertyContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import propertiesData from '../data/properties.json';

const PropertyContext = createContext();

// EXPORT CONSTANT (fallback)
export const MAX_PRICE = 150000000;

export const PropertyProvider = ({ children }) => {
	// =========================================================
	// 1. STATE MANAGEMENT
	// =========================================================

	// Data States
	const [properties, setProperties] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	// Derived dataset min/max (computed after data load)
	const [dataMinPrice, setDataMinPrice] = useState(0);
	const [dataMaxPrice, setDataMaxPrice] = useState(MAX_PRICE);

	// Track whether we already initialized filters from dataset bounds
	const [filtersInitialized, setFiltersInitialized] = useState(false);

	// Favorites Logic (Lazy initialization for localStorage)
	const [favorites, setFavorites] = useState(() => {
		try {
			const saved = localStorage.getItem('favorites');
			return saved ? JSON.parse(saved) : [];
		} catch (error) {
			console.error("Could not load favorites from localStorage:", error);
			return [];
		}
	});

	// Theme Logic (Lazy initialization for localStorage)
	const [darkMode, setDarkMode] = useState(() => {
		try {
			const savedTheme = localStorage.getItem('theme');
			const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
			if (savedTheme) {
				return savedTheme === 'dark';
			}
			return !!systemPrefersDark;
		} catch (error) {
			return false;
		}
	});

	// Filters State
	const [filters, setFilters] = useState({
		search: '',
		city: 'All',
		type: 'All',
		rating: 'All',
		// default placeholder until data loads; will be set to dataset bounds on load
		priceRange: [0, MAX_PRICE],
	});

	// =========================================================
	// 2. EFFECTS (Side Effects)
	// =========================================================

	// --- Data Fetching Simulation ---
	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => {
			setProperties(propertiesData || []);
			setIsLoading(false);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	// When properties change, compute dataset min/max once and initialize filters
	useEffect(() => {
		if (!properties || properties.length === 0) return;

		const prices = properties.map(p => (typeof p.price === 'number' ? p.price : 0)).filter(Boolean);
		const min = prices.length ? Math.min(...prices) : 0;
		const max = prices.length ? Math.max(...prices) : MAX_PRICE;

		setDataMinPrice(min);
		setDataMaxPrice(max);

		// Initialize filters priceRange to dataset bounds if not already initialized.
		if (!filtersInitialized) {
			setFilters(prev => ({ ...prev, priceRange: [min, max] }));
			setFiltersInitialized(true);
		}
	}, [properties, filtersInitialized]);

	// --- Save Favorites to localStorage ---
	useEffect(() => {
		try {
			localStorage.setItem('favorites', JSON.stringify(favorites));
		} catch (error) {
			console.error("Could not save favorites to localStorage:", error);
		}
	}, [favorites]);

	// --- Handle Theme Class on <html> element ---
	useEffect(() => {
		try {
			const root = document.documentElement;
			if (darkMode) {
				root.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				root.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
		} catch (err) {
			// ignore errors (e.g., during SSR or tests)
		}
	}, [darkMode]);


	// =========================================================
	// 3. MEMOIZED LOGIC (useMemo)
	// =========================================================

	const filteredProperties = useMemo(() => {
		if (isLoading) return [];

		let result = properties;

		// Search
		if (filters.search) {
			const query = filters.search.toLowerCase();
			result = result.filter(p =>
				(p.name || '').toLowerCase().includes(query) ||
				(p.area || '').toLowerCase().includes(query) ||
				(p.city || '').toLowerCase().includes(query)
			);
		}

		// City
		if (filters.city !== 'All') {
			result = result.filter(p => p.city === filters.city);
		}

		// Type
		if (filters.type !== 'All') {
			result = result.filter(p => p.type === filters.type);
		}

		// Rating
		if (filters.rating !== 'All') {
			const minRating = parseFloat(filters.rating);
			if (!Number.isNaN(minRating)) {
				result = result.filter(p => (p.rating || 0) >= minRating);
			}
		}

		// Price
		const [minP, maxP] = filters.priceRange || [0, MAX_PRICE];
		result = result.filter(p => {
			const price = typeof p.price === 'number' ? p.price : 0;
			return price >= minP && price <= maxP;
		});

		return result;
	}, [filters, properties, isLoading]);

	// Derived Filter Options
	const filterOptions = useMemo(() => {
		const cities = ['All', ...new Set(properties.map(p => p.city))].sort();
		const types = ['All', ...new Set(properties.map(p => p.type))].sort();
		const ratings = ['All', '4.5+', '4.0+', '3.0+'];
		return { cities, types, ratings };
	}, [properties]);


	// =========================================================
	// 4. ACTIONS (Memoized with useCallback)
	// =========================================================

	const toggleFavorite = useCallback((id) => {
		setFavorites(prevFavorites => {
			if (prevFavorites.includes(id)) {
				return prevFavorites.filter(favId => favId !== id);
			} else {
				return [...prevFavorites, id];
			}
		});
	}, []);

	const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

	const toggleTheme = useCallback(() => setDarkMode(prevMode => !prevMode), []);

	const resetFilters = useCallback(() => {
		setFilters({
			search: '',
			city: 'All',
			type: 'All',
			rating: 'All',
			priceRange: [dataMinPrice, dataMaxPrice],
		});
	}, [dataMinPrice, dataMaxPrice]);

	// stable setter wrapper
	const updateFilters = useCallback((newFilters) => setFilters(newFilters), []);


	// =========================================================
	// 5. PROVIDER VALUE
	// =========================================================

	const contextValue = useMemo(() => ({
		properties,
		filteredProperties,
		isLoading,
		favorites,
		toggleFavorite,
		isFavorite,
		darkMode,
		toggleTheme,
		filters,
		setFilters: updateFilters,
		resetFilters,
		// expose dataset bounds
		dataMinPrice,
		dataMaxPrice,
		filterOptions,
	}), [
		properties,
		filteredProperties,
		isLoading,
		favorites,
		toggleFavorite,
		isFavorite,
		darkMode,
		toggleTheme,
		filters,
		updateFilters,
		resetFilters,
		dataMinPrice,
		dataMaxPrice,
		filterOptions,
	]);

	return (
		<PropertyContext.Provider value={contextValue}>
			{children}
		</PropertyContext.Provider>
	);
};

export const useProperty = () => useContext(PropertyContext);
