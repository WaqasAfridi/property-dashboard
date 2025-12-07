// src/components/PropertyCard.jsx
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { BiBed, BiBath, BiArea, BiHeart, BiSolidHeart, BiStar } from 'react-icons/bi';
import { useProperty } from '../context/PropertyContext';
import PropertySkeleton from './PropertySkeleton';

// =======================================================
// Rating Display Component
// =======================================================
const RatingDisplay = ({ rating, size = 'sm' }) => {
	if (!rating || rating < 3) return null;

	const iconSizeClass = size === 'lg' ? 'text-lg' : 'text-sm';

	return (
		<div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 font-bold px-2 py-0.5 rounded-full text-xs shrink-0">
			<BiStar className={iconSizeClass} />
			{rating.toFixed(1)}
		</div>
	);
};

// =======================================================
// Main PropertyCard Component with GSAP Animations
// =======================================================
const PropertyCard = ({ property, viewMode, onClick }) => {
	const { favorites, toggleFavorite, isLoading } = useProperty();
	const cardRef = useRef(null);
	const imageRef = useRef(null);
	const contentRef = useRef(null);

	// GSAP Animation on mount
	useEffect(() => {
		if (!cardRef.current || isLoading) return;

		const ctx = gsap.context(() => {
			// Entrance animation
			gsap.from(cardRef.current, {
				scale: 0.9,
				opacity: 0,
				duration: 0.6,
				ease: 'power3.out',
			});

			// Hover animations
			const card = cardRef.current;
			const image = imageRef.current;
			const content = contentRef.current;

			if (!card) return;

			const onMouseEnter = () => {
				gsap.to(card, {
					y: -8,
					boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
					duration: 0.3,
					ease: 'power2.out',
					overwrite: 'auto',
				});
				if (image) {
					gsap.to(image, {
						scale: 1.1,
						duration: 0.5,
						ease: 'power2.out',
						overwrite: 'auto',
					});
				}
				if (content) {
					gsap.to(content, {
						y: -4,
						duration: 0.3,
						ease: 'power2.out',
						overwrite: 'auto',
					});
				}
			};

			const onMouseLeave = () => {
				gsap.to(card, {
					y: 0,
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
					duration: 0.3,
					ease: 'power2.out',
					overwrite: 'auto',
					onComplete: () => {
						// Remove inline transforms / boxShadow so nothing is left fighting with other libs
						try {
							gsap.set(card, { clearProps: 'transform,boxShadow' });
							if (image) gsap.set(image, { clearProps: 'transform' });
							if (content) gsap.set(content, { clearProps: 'transform' });
						} catch (err) {
							// ignore
						}
					},
				});
				if (image) {
					gsap.to(image, {
						scale: 1,
						duration: 0.5,
						ease: 'power2.out',
						overwrite: 'auto',
					});
				}
				if (content) {
					gsap.to(content, {
						y: 0,
						duration: 0.3,
						ease: 'power2.out',
						overwrite: 'auto',
					});
				}
			};

			card.addEventListener('mouseenter', onMouseEnter);
			card.addEventListener('mouseleave', onMouseLeave);

			// Cleanup: remove listeners and clear any possible inline props left
			return () => {
				card.removeEventListener('mouseenter', onMouseEnter);
				card.removeEventListener('mouseleave', onMouseLeave);
				try {
					gsap.set(card, { clearProps: 'transform,boxShadow' });
					if (image) gsap.set(image, { clearProps: 'transform' });
					if (content) gsap.set(content, { clearProps: 'transform' });
				} catch (err) {
					// ignore
				}
			};
		}, cardRef);

		return () => ctx.revert();
	}, [isLoading, property.id]);

	if (isLoading || !property) {
		return <PropertySkeleton viewMode={viewMode} />;
	}

	const isFav = favorites.includes(property.id);

	const formatPKRPrice = (price, isRented) => {
		if (typeof price !== 'number' || price <= 0) return 'POA';

		if (isRented) {
			if (price >= 1000000) return `PKR ${(price / 1000000).toFixed(1)} Lakh/mo`;
			if (price >= 100000) return `PKR ${(price / 100000).toFixed(1)} Lakh/mo`;
			return `PKR ${Math.round(price / 1000)}K/mo`;
		}

		if (price >= 10000000) return `PKR ${(price / 10000000).toFixed(2)} Crore`;
		if (price >= 100000) return `PKR ${(price / 100000).toFixed(1)} Lakh`;

		return `PKR ${price.toLocaleString()}`;
	};

	return (
		/* NOTE: Changed outer wrapper from motion.div (with layout) to a plain div to prevent
			 Framer Motion <-> GSAP transform collisions. Keep motion for internal micro-animations. */
		<div
			ref={cardRef}
			className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-gray-700 cursor-pointer ${viewMode === 'list' ? 'flex flex-row h-48' : 'flex-col'
				}`}
			onClick={onClick}
		>
			{/* Image & Overlays */}
			<div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-1/3' : 'w-full h-48'}`}>
				<img
					ref={imageRef}
					src={property.image}
					alt={property.name}
					className="w-full h-full object-cover object-center"
					loading="lazy"
				/>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				{/* Price Tag */}
				<motion.div
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-lg"
				>
					{formatPKRPrice(property.price, property.isRented)}
				</motion.div>

				{/* Favorite Button */}
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="absolute top-3 right-3"
				>
					<button
						onClick={(e) => {
							e.stopPropagation();
							toggleFavorite(property.id);
						}}
						className="p-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full hover:scale-110 transition-transform shadow-lg"
						aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
					>
						{isFav ? (
							<BiSolidHeart className="text-red-500 text-xl" />
						) : (
							<BiHeart className="text-slate-700 dark:text-white text-xl" />
						)}
					</button>
				</motion.div>

				{/* Rent/Sale Tag */}
				{property.isRented && (
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 }}
						className="absolute bottom-3 left-3 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
					>
						For Rent
					</motion.div>
				)}
			</div>

			{/* Content */}
			<div ref={contentRef} className="p-4 flex flex-col justify-between flex-1">
				<div>
					<div className="flex justify-between items-start gap-2">
						<div className="min-w-0">
							<span className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
								{property.type}
							</span>
							<h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1 truncate pr-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
								{property.name}
							</h3>
							<p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
								{property.area}, {property.city}
							</p>
						</div>

						{/* Rating Display */}
						<RatingDisplay rating={property.rating} />
					</div>
				</div>

				{/* Amenities */}
				<div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-gray-700 text-slate-600 dark:text-slate-400 text-sm">
					<div className="flex items-center gap-1.5 whitespace-nowrap" title={`${property.beds} Bedrooms`}>
						<BiBed className="text-purple-600 dark:text-purple-400" />
						{property.beds} Beds
					</div>
					<div className="flex items-center gap-1.5 whitespace-nowrap" title={`${property.baths} Bathrooms`}>
						<BiBath className="text-purple-600 dark:text-purple-400" />
						{property.baths} Baths
					</div>
					<div className="flex items-center gap-1.5 whitespace-nowrap" title={`Area: ${property.size}`}>
						<BiArea className="text-purple-600 dark:text-purple-400" />
						{property.size}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PropertyCard;
