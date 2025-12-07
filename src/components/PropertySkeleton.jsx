// This component provides the placeholder UI for property cards while data is loading.
const PropertySkeleton = ({ viewMode }) => {

	// Base classes for the animated placeholder blocks
	const placeholderClass = "bg-slate-200 dark:bg-gray-600 rounded";

	return (
		// FIX: Enhanced base styling to match PropertyCard's outer wrapper
		<div className={`
      bg-white dark:bg-gray-800 
      rounded-2xl overflow-hidden 
      shadow-sm 
      transition-all duration-300 
      border border-slate-100 dark:border-gray-700 
      animate-pulse 
      ${viewMode === 'list' ? 'flex flex-row h-48' : 'flex-col'}
    `}>

			{/* 1. Image and Overlays Skeleton Area */}
			<div className={`
        relative 
        overflow-hidden 
        bg-slate-300 dark:bg-gray-700 
        ${viewMode === 'list' ? 'w-1/3' : 'w-full h-48'}
      `}>
				{/* Price Tag Placeholder */}
				<div className={`absolute top-3 left-3 h-6 w-1/4 ${placeholderClass}`} />
				{/* Favorite Button Placeholder */}
				<div className={`absolute top-3 right-3 h-8 w-8 rounded-full ${placeholderClass}`} />
			</div>

			{/* 2. Content Skeleton */}
			<div className="p-4 flex flex-col justify-between flex-1">

				{/* Top Details (Type, Name, Location) */}
				<div className="space-y-3">
					{/* Type */}
					<div className={`h-3 w-1/4 ${placeholderClass}`} />
					{/* Name */}
					<div className={`h-5 w-3/4 ${placeholderClass}`} />
					{/* Location */}
					<div className={`h-3 w-1/2 ${placeholderClass}`} />
				</div>

				{/* Amenities Line (Beds, Baths, Area) */}
				<div className="flex gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-gray-700">
					{/* Bed */}
					<div className={`h-4 w-1/5 ${placeholderClass}`} />
					{/* Bath */}
					<div className={`h-4 w-1/5 ${placeholderClass}`} />
					{/* Area */}
					<div className={`h-4 w-1/5 ${placeholderClass}`} />
				</div>
			</div>
		</div>
	);
};

export default PropertySkeleton;