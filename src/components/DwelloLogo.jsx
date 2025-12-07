import { BiBuildingHouse } from "react-icons/bi";

const DwelloLogo = () => {
	return (
		<div className="flex items-center gap-2 text-primary">
			<div className="p-1.5 bg-primary rounded-lg text-white">
				<BiBuildingHouse className="text-xl" />
			</div>
			<span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
				Dwello
			</span>
		</div>
	);
};

export default DwelloLogo;