import { Link, useLocation } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext.jsx';
import { BiSearch, BiMoon, BiSun, BiHeart } from 'react-icons/bi';
import DwelloLogo from './DwelloLogo.jsx';

// =======================================================
// FIX: EXTRACT SEARCHBAR COMPONENT OUTSIDE OF NAVBAR
// This prevents the input from losing focus on every re-render.
// =======================================================
const SearchBar = ({ className, filters, setFilters, isLoading }) => (
	// FIX: Add disabled class when loading
	<div className={`items-center rounded-full px-4 py-2 transition-colors ${className} ${isLoading ? 'bg-slate-200 dark:bg-gray-700 opacity-60' : 'bg-slate-100 dark:bg-gray-800'}`}>
		<BiSearch className="text-slate-400 text-xl shrink-0" />
		<input
			type="text"
			placeholder={isLoading ? "Loading properties..." : "Search by name or area..."}
			// FIX: Disable input when loading
			disabled={isLoading}
			className="bg-transparent border-none outline-none ml-2 w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
			value={filters.search}
			// Pass the updated filter value
			onChange={(e) => setFilters({ ...filters, search: e.target.value })}
		/>
	</div>
);


const Navbar = () => {
	// Note: We only need to destructure the values used by Navbar directly.
	// The rest are passed to the now external SearchBar.
	const {
		filters,
		setFilters,
		darkMode,
		toggleTheme,
		favorites,
		isLoading // Pass to SearchBar
	} = useProperty();

	const location = useLocation();
	const isFavoritesPage = location.pathname === '/favorites';
	const isHomePage = location.pathname === '/';


	return (
		// FIX: Ensure dark background uses the custom 'dark' variable
		<nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-700 transition-colors">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

				{/* ROW 1: Logo, Desktop Search, Actions */}
				<div className="flex justify-between items-center h-16 gap-4">

					{/* Logo */}
					<Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg -ml-2 p-2">
						<DwelloLogo />
					</Link>

					{/* DESKTOP SEARCH: Visible only on MD screens and up */}
					{isHomePage && (
						<div className="hidden md:block w-1/3 max-w-md">
							<SearchBar
								className="flex"
								filters={filters}
								setFilters={setFilters}
								isLoading={isLoading}
							/>
						</div>
					)}

					{/* Actions (Navigation, Theme Toggle & Favorites) */}
					<div className="flex items-center gap-3 sm:gap-4 shrink-0">

						{/* Favorites Link */}
						<Link
							to="/favorites"
							className={`relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition ${isFavoritesPage ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`}
						>
							<div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full ${isFavoritesPage ? 'bg-slate-100 dark:bg-gray-700' : ''}`}>
								<BiHeart className="text-xl" />
								<span className="hidden sm:inline text-sm">
									Favorites
								</span>
							</div>

							{/* Favorites Count Badge */}
							{favorites.length > 0 && (
								<span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white dark:border-dark">
									{favorites.length}
								</span>
							)}
						</Link>

						{/* Theme Toggle */}
						<button
							onClick={toggleTheme}
							className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition cursor-pointer"
							aria-label="Toggle Theme"
						>
							{darkMode ? <BiSun className="text-yellow-400 text-xl" /> : <BiMoon className="text-slate-600 text-xl" />}
						</button>
					</div>
				</div>

				{/* ROW 2: MOBILE SEARCH */}
				{/* Only visible on small screens (hidden on md+), adds padding bottom */}
				{isHomePage && (
					<div className="pb-4 md:hidden w-full">
						<SearchBar
							className="flex w-full"
							filters={filters}
							setFilters={setFilters}
							isLoading={isLoading}
						/>
					</div>
				)}

			</div>
		</nav>
	);
};

export default Navbar;