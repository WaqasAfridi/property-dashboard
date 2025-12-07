import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProperty } from "../context/PropertyContext";
import { BiBed, BiBath, BiArea, BiX, BiMap, BiHome, BiSolidHeart, BiHeart, BiStar, BiPhoneCall, BiMailSend } from "react-icons/bi"; // Imported BiStar, BiPhoneCall, BiMailSend

// Define a fallback image URL in case the property has no images.
const FALLBACK_IMAGE = "https://via.placeholder.com/600x400?text=No+Image+Available";

// NEW: Rating Display Component (Reused from PropertyCard for consistency)
const RatingDisplay = ({ rating }) => {
	if (!rating || rating < 3) return null; // Only show meaningful ratings

	return (
		<div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 font-bold px-3 py-1 rounded-full text-sm">
			<BiStar className="text-lg" />
			{rating.toFixed(1)}
		</div>
	);
};


const PropertyModal = ({ property, closeModal }) => {
	const { toggleFavorite, isFavorite } = useProperty();

	if (!property) return null;

	// FIX 1: Use the correct prop name (property.images). Ensure it's an array.
	const imagesArray = Array.isArray(property.images) ? property.images : [];

	// FIX 2 & 3: Initialize selectedImage safely based on property change and fallback
	const initialImage = imagesArray[0] || property.thumbnail || FALLBACK_IMAGE;
	const [selectedImage, setSelectedImage] = useState(initialImage);

	// Effect to reset the selected image when the property changes
	useEffect(() => {
		const newInitialImage = imagesArray[0] || property.thumbnail || FALLBACK_IMAGE;
		setSelectedImage(newInitialImage);
	}, [property]); // Only run when the main property object changes

	// Effect for Escape key listener (Kept as is - correct)
	useEffect(() => {
		const handleKeydown = (event) => {
			if (event.key === 'Escape') {
				closeModal();
			}
		};

		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	}, [closeModal]);

	// Format Price: PKR Lakh/Crore (Optimized for cleaner output)
	const formatPKRPrice = (price, isRented) => {
		if (typeof price !== 'number' || price <= 0) return 'Price on Request';

		if (isRented) {
			if (price >= 1000000) return `PKR ${(price / 1000000).toFixed(1)} Lakh/mo`; // e.g., 20.5 Lakh/mo
			return `PKR ${(price / 1000).toFixed(0)}K/mo`; // e.g., 500K/mo
		}
		if (price >= 10000000) return `PKR ${(price / 10000000).toFixed(2)} Crore`; // e.g., 1.50 Crore
		return `PKR ${(price / 100000).toFixed(1)} Lakh`; // e.g., 50.5 Lakh
	};

	const isFav = isFavorite(property.id);

	return (
		// The main overlay element. Clicking this triggers closeModal.
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={closeModal}
		>
			{/* The inner modal content. */}
			<motion.div
				className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all relative"
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 50, opacity: 0 }}
				onClick={(e) => e.stopPropagation()} // Prevents content clicks from closing modal
			>
				<button
					onClick={closeModal} // Cross button triggers closeModal
					className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-700 text-slate-700 dark:text-white z-10 hover:bg-slate-100 dark:hover:bg-slate-600 transition shadow-lg"
					aria-label="Close"
				>
					<BiX className="text-2xl" />
				</button>

				<div className="p-6 sm:p-8">
					{/* Header, Main Image and Gallery */}
					<div className="flex flex-col md:flex-row gap-6">
						{/* Image Gallery Column */}
						<div className="w-full md:w-3/5">
							<div className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-4 shadow-xl">
								<img
									src={selectedImage}
									alt={property.name}
									className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
									loading="lazy"
								/>
							</div>

							{/* Image Gallery Thumbnails */}
							{imagesArray.length > 0 && (
								<div className="flex gap-2 overflow-x-auto pb-2">
									{imagesArray.map((image, index) => (
										<img
											key={index}
											src={image}
											alt={`Gallery thumbnail ${index + 1}`}
											className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all border-2 ${selectedImage === image
												? 'border-primary'
												: 'border-transparent opacity-70 hover:opacity-100'
												}`}
											onClick={() => setSelectedImage(image)}
										/>
									))}
								</div>
							)}
						</div>

						{/* Property Details Column */}
						<div className="w-full md:w-2/5">
							<div className="flex justify-between items-center mb-3">
								{/* Rent/Sale Tag */}
								<span className={`px-3 py-1 text-sm font-bold rounded-full ${property.isRented
									? 'bg-red-100 text-red-600 dark:bg-red-700 dark:text-red-100'
									: 'bg-green-100 text-green-600 dark:bg-green-700 dark:text-green-100'
									}`}>
									{property.isRented ? "For Rent" : "For Sale"}
								</span>

								{/* Favorite Button (for Mobile/Small screens) */}
								<button
									onClick={() => toggleFavorite(property.id)}
									className="p-2 text-2xl text-red-500 hover:text-red-600 transition"
									aria-label="Toggle Favorite"
								>
									{isFav ? <BiSolidHeart /> : <BiHeart className="text-slate-400" />}
								</button>
							</div>

							<h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
								{property.name}
							</h2>

							{/* Price and Rating */}
							<div className="flex items-center gap-3 my-2">
								<p className="text-primary text-3xl font-extrabold">
									{formatPKRPrice(property.price, property.isRented)}
								</p>
								<RatingDisplay rating={property.rating} />
							</div>

							{/* Location */}
							<div className="flex items-center text-slate-600 dark:text-slate-400 mt-1 mb-4">
								<BiMap className="mr-2 text-xl shrink-0" />
								<p className="text-lg">
									**{property.area}**, {property.city}, Pakistan
								</p>
							</div>

							<p className="text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-gray-700 pt-4">
								{property.description}
							</p>
						</div>
					</div>

					{/* Amenities/Features Section */}
					<div className="mt-8 border-t border-slate-200 dark:border-gray-700 pt-6">
						<h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Features & Specifications</h3>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
							{/* Bed */}
							<div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
								<BiBed className="text-2xl text-primary" />
								<div>
									<p className="text-sm text-slate-500 dark:text-slate-400">Bedrooms</p>
									<p className="font-bold text-slate-900 dark:text-white">{property.beds > 0 ? property.beds : 'N/A'}</p>
								</div>
							</div>
							{/* Bath */}
							<div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
								<BiBath className="text-2xl text-primary" />
								<div>
									<p className="text-sm text-slate-500 dark:text-slate-400">Bathrooms</p>
									<p className="font-bold text-slate-900 dark:text-white">{property.baths > 0 ? property.baths : 'N/A'}</p>
								</div>
							</div>
							{/* Size */}
							<div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
								<BiArea className="text-2xl text-primary" />
								<div>
									<p className="text-sm text-slate-500 dark:text-slate-400">Area</p>
									<p className="font-bold text-slate-900 dark:text-white">{property.size}</p>
								</div>
							</div>
							{/* Type */}
							<div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700 p-3 rounded-lg">
								<BiHome className="text-2xl text-primary" />
								<div>
									<p className="text-sm text-slate-500 dark:text-slate-400">Type</p>
									<p className="font-bold text-slate-900 dark:text-white">{property.type}</p>
								</div>
							</div>
						</div>
					</div>

					{/* NEW: Contact Agent Section */}
					<div className="mt-8 border-t border-slate-200 dark:border-gray-700 pt-6">
						<h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Contact Agent</h3>
						<div className="flex flex-col sm:flex-row gap-4">
							<button
								onClick={() => alert("Simulating call to agent...")}
								className="flex items-center justify-center gap-2 w-full sm:w-1/2 py-3 rounded-lg text-lg font-semibold transition bg-green-500 text-white hover:bg-green-600"
							>
								<BiPhoneCall className="text-xl" /> Call Agent
							</button>
							<button
								onClick={() => alert("Simulating email to agent...")}
								className="flex items-center justify-center gap-2 w-full sm:w-1/2 py-3 rounded-lg text-lg font-semibold transition bg-blue-500 text-white hover:bg-blue-600"
							>
								<BiMailSend className="text-xl" /> Email Inquiry
							</button>
						</div>
					</div>

					{/* Favorite Action Button (Retained for bottom prominence) */}
					<div className="mt-8">
						<button
							onClick={() => toggleFavorite(property.id)}
							className={`w-full py-3 rounded-lg text-lg font-semibold transition flex items-center justify-center gap-2 ${isFav
								? "bg-red-500 text-white hover:bg-red-600"
								: "bg-primary text-white hover:bg-indigo-600 dark:bg-primary/80 dark:hover:bg-primary"
								}`}
						>
							{isFav ? <BiSolidHeart className="text-xl" /> : <BiHeart className="text-xl" />}
							{isFav ? "Remove from Favorites" : "Add to Favorites"}
						</button>
					</div>

				</div>
			</motion.div>
		</motion.div>
	);
};

export default PropertyModal;