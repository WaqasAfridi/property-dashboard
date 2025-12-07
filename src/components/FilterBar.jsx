// src/components/FilterBar.jsx
import { useProperty } from '../context/PropertyContext';
import { BiGridAlt, BiListUl, BiReset } from 'react-icons/bi';
import PriceRange from './PriceRange';

const FilterBar = ({ viewMode, setViewMode }) => {
	const {
		filters,
		setFilters,
		resetFilters,
		isLoading,
		filterOptions = {},
		dataMinPrice = 0,
		dataMaxPrice = 1000000,
	} = useProperty();

	// Prefer the context-provided derived options when available.
	const cities = filterOptions.cities ?? ['All'];
	const types = filterOptions.types ?? ['All'];

	const formatPriceForDisplay = (price) => {
		if (!price && price !== 0) return 'PKR —';
		if (price >= 10000000) return `PKR ${(price / 10000000).toFixed(2)} Cr`;
		if (price >= 100000) return `PKR ${(price / 100000).toFixed(1)} Lakh`;
		if (price >= 1000) return `PKR ${Math.round(price / 1000)}K`;
		return `PKR ${price}`;
	};

	const inputClass = `bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`;

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 border border-slate-100 dark:border-gray-700 transition-colors duration-300">
			{/* Mobile Layout (< md) - Stacked vertically */}
			<div className="md:hidden p-4 space-y-4">
				{/* Row 1: City & Type */}
				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col">
						<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
							Location
						</label>
						<select
							value={filters.city}
							disabled={isLoading}
							onChange={(e) => setFilters({ ...filters, city: e.target.value })}
							className={inputClass}
							aria-label="Filter by city"
						>
							{cities.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col">
						<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
							Property Type
						</label>
						<select
							value={filters.type}
							disabled={isLoading}
							onChange={(e) => setFilters({ ...filters, type: e.target.value })}
							className={inputClass}
							aria-label="Filter by property type"
						>
							{types.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Row 2: Rating */}
				<div className="flex flex-col">
					<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
						Min Rating
					</label>
					<select
						value={filters.rating}
						disabled={isLoading}
						onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
						className={inputClass}
						aria-label="Filter by minimum rating"
					>
						<option value="All">Any Rating</option>
						<option value="4">4+ Stars</option>
						<option value="4.5">4.5+ Stars</option>
						<option value="4.8">4.8+ Stars</option>
					</select>
				</div>

				{/* Row 3: Price Range */}
				<div className={`flex flex-col ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
					<div className="flex justify-between items-center mb-1.5">
						<label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-0.5">
							Price Range
						</label>
						<span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
							{formatPriceForDisplay(filters.priceRange[0])} — {formatPriceForDisplay(filters.priceRange[1])}
						</span>
					</div>
					<div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3 border border-slate-200 dark:border-gray-600">
						<PriceRange
							min={dataMinPrice}
							max={dataMaxPrice}
							step={1}
							value={filters.priceRange}
							onChange={(newRange) => setFilters({ ...filters, priceRange: newRange })}
						/>
					</div>
				</div>

				{/* Row 4: Actions */}
				<div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-gray-700">
					<button
						onClick={resetFilters}
						disabled={isLoading}
						className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
						aria-label="Reset filters"
					>
						<BiReset className="text-lg" />
						<span>Reset</span>
					</button>

					<div className="flex bg-slate-100 dark:bg-gray-700 rounded-lg p-1">
						<button
							onClick={() => setViewMode('grid')}
							aria-label="Grid view"
							className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}
						>
							<BiGridAlt className="text-lg" />
						</button>
						<button
							onClick={() => setViewMode('list')}
							aria-label="List view"
							className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}
						>
							<BiListUl className="text-lg" />
						</button>
					</div>
				</div>
			</div>

			{/* Tablet Layout (md to lg) - Two rows */}
			<div className="hidden md:block lg:hidden p-4 space-y-4">
				{/* Row 1: Basic Filters */}
				<div className="flex items-end gap-3">
					<div className="flex flex-col flex-1">
						<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
							Location
						</label>
						<select
							value={filters.city}
							disabled={isLoading}
							onChange={(e) => setFilters({ ...filters, city: e.target.value })}
							className={inputClass}
							aria-label="Filter by city"
						>
							{cities.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col flex-1">
						<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
							Property Type
						</label>
						<select
							value={filters.type}
							disabled={isLoading}
							onChange={(e) => setFilters({ ...filters, type: e.target.value })}
							className={inputClass}
							aria-label="Filter by property type"
						>
							{types.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col flex-1">
						<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
							Min Rating
						</label>
						<select
							value={filters.rating}
							disabled={isLoading}
							onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
							className={inputClass}
							aria-label="Filter by minimum rating"
						>
							<option value="All">Any Rating</option>
							<option value="4">4+ Stars</option>
							<option value="4.5">4.5+ Stars</option>
							<option value="4.8">4.8+ Stars</option>
						</select>
					</div>
				</div>

				{/* Row 2: Price Range + Actions */}
				<div className="flex items-center gap-3">
					<div className={`flex flex-col flex-1 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
						<div className="flex justify-between items-center mb-1.5">
							<label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-0.5">
								Price Range
							</label>
							<span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
								{formatPriceForDisplay(filters.priceRange[0])} — {formatPriceForDisplay(filters.priceRange[1])}
							</span>
						</div>
						<div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3 border border-slate-200 dark:border-gray-600">
							<PriceRange
								min={dataMinPrice}
								max={dataMaxPrice}
								step={1}
								value={filters.priceRange}
								onChange={(newRange) => setFilters({ ...filters, priceRange: newRange })}
							/>
						</div>
					</div>

					<div className="flex items-center gap-2 pt-6">
						<button
							onClick={resetFilters}
							disabled={isLoading}
							className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
							title="Reset Filters"
							aria-label="Reset filters"
						>
							<BiReset className="text-xl" />
						</button>

						<div className="flex bg-slate-100 dark:bg-gray-700 rounded-lg p-1">
							<button
								onClick={() => setViewMode('grid')}
								aria-label="Grid view"
								className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}
							>
								<BiGridAlt className="text-lg" />
							</button>
							<button
								onClick={() => setViewMode('list')}
								aria-label="List view"
								className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}
							>
								<BiListUl className="text-lg" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Desktop Layout (lg+) - Single row, all aligned */}
			<div className="hidden lg:flex items-center gap-4 p-4">
				{/* City Filter */}
				<div className="flex flex-col min-w-[140px]">
					<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
						Location
					</label>
					<select
						value={filters.city}
						disabled={isLoading}
						onChange={(e) => setFilters({ ...filters, city: e.target.value })}
						className={inputClass}
						aria-label="Filter by city"
					>
						{cities.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>

				{/* Type Filter */}
				<div className="flex flex-col min-w-[140px]">
					<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
						Type
					</label>
					<select
						value={filters.type}
						disabled={isLoading}
						onChange={(e) => setFilters({ ...filters, type: e.target.value })}
						className={inputClass}
						aria-label="Filter by property type"
					>
						{types.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</div>

				{/* Rating Filter */}
				<div className="flex flex-col min-w-[130px]">
					<label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 ml-0.5">
						Rating
					</label>
					<select
						value={filters.rating}
						disabled={isLoading}
						onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
						className={inputClass}
						aria-label="Filter by minimum rating"
					>
						<option value="All">All</option>
						<option value="4">4+</option>
						<option value="4.5">4.5+</option>
						<option value="4.8">4.8+</option>
					</select>
				</div>

				{/* Vertical Divider */}
				<div className="h-14 w-px bg-slate-200 dark:bg-gray-700 mx-1" />

				{/* Price Range - Takes available space */}
				<div className={`flex flex-col flex-1 min-w-[320px] max-w-[450px] ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
					<div className="flex justify-between items-center mb-1.5">
						<label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-0.5">
							Price Range
						</label>
						<span className="text-xs font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">
							{formatPriceForDisplay(filters.priceRange[0])} — {formatPriceForDisplay(filters.priceRange[1])}
						</span>
					</div>
					<div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-3 border border-slate-200 dark:border-gray-600">
						<PriceRange
							min={dataMinPrice}
							max={dataMaxPrice}
							step={1}
							value={filters.priceRange}
							onChange={(newRange) => setFilters({ ...filters, priceRange: newRange })}
						/>
					</div>
				</div>

				{/* Vertical Divider */}
				<div className="h-14 w-px bg-slate-200 dark:bg-gray-700 mx-1" />

				{/* Actions - Right side */}
				<div className="flex items-center gap-2 ml-auto">
					<button
						onClick={resetFilters}
						disabled={isLoading}
						className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
						title="Reset Filters"
						aria-label="Reset filters"
					>
						<BiReset className="text-xl" />
					</button>

					<div className="flex bg-slate-100 dark:bg-gray-700 rounded-lg p-1">
						<button
							onClick={() => setViewMode('grid')}
							aria-label="Grid view"
							className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
						>
							<BiGridAlt className="text-lg" />
						</button>
						<button
							onClick={() => setViewMode('list')}
							aria-label="List view"
							className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
						>
							<BiListUl className="text-lg" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterBar;
