import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { BiSearch, BiHome, BiTrendingUp } from 'react-icons/bi';

const HeroSection = () => {
	const heroRef = useRef(null);
	const titleRef = useRef(null);
	const subtitleRef = useRef(null);
	const statsRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline();

			// Animate title
			tl.from(titleRef.current, {
				y: 50,
				opacity: 0,
				duration: 0.8,
				ease: 'power3.out',
			});

			// Animate subtitle
			tl.from(
				subtitleRef.current,
				{
					y: 30,
					opacity: 0,
					duration: 0.6,
					ease: 'power3.out',
				},
				'-=0.4'
			);

			// Animate stats
			tl.from(
				statsRef.current.children,
				{
					scale: 0.8,
					opacity: 0,
					duration: 0.5,
					stagger: 0.1,
					ease: 'back.out(1.7)',
				},
				'-=0.3'
			);
		}, heroRef);

		return () => ctx.revert();
	}, []);

	return (
		<motion.div
			ref={heroRef}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white"
		>
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute inset-0" style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
				}} />
			</div>

			<div className="relative p-8 md:p-12">
				<div className="max-w-4xl">
					<h1
						ref={titleRef}
						className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight"
					>
						Find Your Dream Property
					</h1>
					<p
						ref={subtitleRef}
						className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl"
					>
						Discover the best properties in Pakistan's prime locations. From cozy apartments to luxurious villas, find your perfect home today.
					</p>

					{/* Stats */}
					<div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
							<div className="flex items-center gap-2 mb-2">
								<BiHome className="text-2xl" />
								<span className="text-2xl md:text-3xl font-bold">500+</span>
							</div>
							<p className="text-purple-100 text-sm">Properties</p>
						</div>

						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
							<div className="flex items-center gap-2 mb-2">
								<BiSearch className="text-2xl" />
								<span className="text-2xl md:text-3xl font-bold">50+</span>
							</div>
							<p className="text-purple-100 text-sm">Locations</p>
						</div>

						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
							<div className="flex items-center gap-2 mb-2">
								<BiTrendingUp className="text-2xl" />
								<span className="text-2xl md:text-3xl font-bold">98%</span>
							</div>
							<p className="text-purple-100 text-sm">Satisfaction</p>
						</div>

						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
							<div className="flex items-center gap-2 mb-2">
								<BiHome className="text-2xl" />
								<span className="text-2xl md:text-3xl font-bold">24/7</span>
							</div>
							<p className="text-purple-100 text-sm">Support</p>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default HeroSection;
