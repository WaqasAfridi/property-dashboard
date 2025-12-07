import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyProvider, useProperty } from './context/PropertyContext.jsx';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import MapSection from './components/MapSection.jsx';
import FilterBar from './components/FilterBar.jsx';
import PropertyCard from './components/PropertyCard.jsx';
import PropertyModal from './components/PropertyModal.jsx';
import PropertySkeleton from './components/PropertySkeleton.jsx';

// =======================================================
// Home Page Component
// =======================================================
const Home = () => {
	const { filteredProperties, isLoading } = useProperty();
	const [viewMode, setViewMode] = useState('grid');
	const [selectedProperty, setSelectedProperty] = useState(null);

	const handleCloseModal = () => setSelectedProperty(null);

	// Helper to render the property list or loading state
	const renderPropertyContent = () => {
		// 1. Loading State (Show Skeletons)
		if (isLoading) {
			const skeletonCount = viewMode === 'grid' ? 6 : 3;
			return Array.from({ length: skeletonCount }).map((_, index) => (
				<PropertySkeleton key={`skeleton-${index}`} viewMode={viewMode} />
			));
		}

		// 2. Data Loaded but No Results Found
		if (filteredProperties.length === 0) {
			return (
				<motion.div
					key="not-found"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4 }}
					className="col-span-full text-center py-20"
				>
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border-2 border-dashed border-slate-300 dark:border-gray-700">
						<div className="text-6xl mb-4">🔍</div>
						<h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
							No Properties Found
						</h2>
						<p className="text-slate-500 dark:text-slate-400">
							Try adjusting your filters to find what you're looking for.
						</p>
					</div>
				</motion.div>
			);
		}

		// 3. Properties Found (Normal Rendering)
		return filteredProperties.map((property) => (
			<PropertyCard
				key={property.id}
				property={property}
				viewMode={viewMode}
				onClick={() => setSelectedProperty(property)}
			/>
		));
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Hero Section */}
			<HeroSection />

			{/* Filter Bar */}
			<FilterBar viewMode={viewMode} setViewMode={setViewMode} />

			{/* Property Results Header */}
			{!isLoading && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-6 flex items-center justify-between"
				>
					<h2 className="text-2xl font-bold text-slate-800 dark:text-white">
						{filteredProperties.length > 0 ? (
							<>
								Found <span className="text-purple-600 dark:text-purple-400">{filteredProperties.length}</span> Properties
							</>
						) : (
							'Browse Properties'
						)}
					</h2>
				</motion.div>
			)}

			{/* Property Grid/List Container */}
			<motion.div
				layout
				className={`grid gap-6 mb-8 ${
					viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
				}`}
			>
				{renderPropertyContent()}
			</motion.div>

			{/* Map Section */}
			{!isLoading && filteredProperties.length > 0 && <MapSection />}

			{/* MODAL RENDERING */}
			<AnimatePresence>
				{selectedProperty && (
					<PropertyModal
						key={selectedProperty.id}
						property={selectedProperty}
						closeModal={handleCloseModal}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

// =======================================================
// Favorites Page Component
// =======================================================
const Favorites = () => {
	const { properties, favorites, isLoading } = useProperty();
	const favProperties = properties.filter((p) => favorites.includes(p.id));
	const [selectedProperty, setSelectedProperty] = useState(null);

	const handleCloseModal = () => setSelectedProperty(null);

	// Show a loading state for favorites if data hasn't loaded yet
	if (isLoading) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
					Your Favorites
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<PropertySkeleton viewMode="grid" />
					<PropertySkeleton viewMode="grid" />
					<PropertySkeleton viewMode="grid" />
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Page Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
					Your Favorites
				</h1>
				<p className="text-slate-600 dark:text-slate-400">
					{favProperties.length > 0
						? `You have ${favProperties.length} favorite ${favProperties.length === 1 ? 'property' : 'properties'}`
						: 'Start adding properties to your favorites'}
				</p>
			</motion.div>

			{favProperties.length > 0 ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{favProperties.map((property) => (
						<PropertyCard
							key={property.id}
							property={property}
							viewMode="grid"
							onClick={() => setSelectedProperty(property)}
						/>
					))}
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center py-20"
				>
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border-2 border-dashed border-slate-300 dark:border-gray-700 max-w-lg mx-auto">
						<div className="text-7xl mb-6">❤️</div>
						<h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
							No favorites yet
						</h3>
						<p className="text-slate-500 dark:text-slate-400 mb-6">
							Start exploring properties and click the heart icon to save your favorites!
						</p>
						<motion.a
							href="/"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
						>
							Browse Properties
						</motion.a>
					</div>
				</motion.div>
			)}

			{/* MODAL RENDERING */}
			<AnimatePresence>
				{selectedProperty && (
					<PropertyModal
						key={selectedProperty.id}
						property={selectedProperty}
						closeModal={handleCloseModal}
					/>
				)}
			</AnimatePresence>
		</div>
	);
};

// =======================================================
// Main App Component
// =======================================================
function App() {
	return (
		<PropertyProvider>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/favorites" element={<Favorites />} />
				</Routes>

				{/* Footer */}
				<footer className="mt-16 py-8 border-t border-slate-200 dark:border-gray-700">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<p className="text-slate-600 dark:text-slate-400">
							© 2024 Property Dashboard. Made with ❤️ for property seekers in Pakistan.
						</p>
					</div>
				</footer>
			</div>
		</PropertyProvider>
	);
}

export default App;
