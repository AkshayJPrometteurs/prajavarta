"use client";

import { memo } from "react";

const Logo = ({ big, inverted }) => {
	const colorClass = inverted ? "text-white" : "text-inherit";

	return (
		<div className="flex items-baseline gap-0">
			<span className={`mr font-extrabold ${big ? "text-[22px]" : "text-[18px]"} ${colorClass}`}>
				प्रजावार्ता
			</span>

			<span className={`ml-1.5 text-[0.6rem] tracking-wider opacity-70 font-semibold ${colorClass}`}>.COM</span>
		</div>
	);
};

export default memo(Logo);