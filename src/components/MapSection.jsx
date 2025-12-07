import { motion } from 'framer-motion';
import { BiMap, BiCurrentLocation } from 'react-icons/bi';

const MapSection = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="mb-8 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 shadow-sm"
		>
			<div className="p-6 border-b border-slate-200 dark:border-gray-700">
				<div className="flex items-center gap-3">
					<div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
						<BiMap className="text-2xl text-purple-600 dark:text-purple-400" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-slate-800 dark:text-white">
							Property Locations
						</h2>
						<p className="text-sm text-slate-500 dark:text-slate-400">
							Explore properties across Pakistan's prime locations
						</p>
					</div>
				</div>
			</div>

			{/* Map Container */}
			<div className="relative h-80 md:h-96 bg-slate-100 dark:bg-gray-900">
				{/* Static Map Placeholder - Replace with actual map API */}
				<img
					src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/73.0479,33.6844,10,0/1200x600@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazBjY2FjY2EwMDAwM25xaG1wZGdkZzAwIn0.example"
					alt="Pakistan Map showing property locations"
					className="w-full h-full object-cover"
					onError={(e) => {
						// Fallback to a colored placeholder if map fails to load
						e.target.style.display = 'none';
					}}
				/>

				{/* Fallback Placeholder */}
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900">
					<BiCurrentLocation className="text-6xl text-purple-600 dark:text-purple-400 mb-4 animate-pulse" />
					<h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">
						Interactive Map
					</h3>
					<p className="text-slate-500 dark:text-slate-400 text-center max-w-md px-4">
						View all property locations on an interactive map. Coming soon with live location tracking and property markers.
					</p>

					{/* Mock Location Markers */}
					<div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
						{['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Multan'].map((city) => (
							<div
								key={city}
								className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-slate-200 dark:border-gray-700 shadow-sm"
							>
								<div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
								<span className="text-sm font-medium text-slate-700 dark:text-slate-300">
									{city}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Legend */}
				<div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-slate-200 dark:border-gray-700">
					<div className="flex items-center gap-2 text-sm">
						<div className="w-3 h-3 bg-purple-600 rounded-full" />
						<span className="text-slate-700 dark:text-slate-300 font-medium">Available Properties</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default MapSection;
