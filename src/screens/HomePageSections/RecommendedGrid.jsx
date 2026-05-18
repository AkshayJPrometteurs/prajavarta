"use client";

import StandardCard from "@/components/cards/StandardCard";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import { getCategoryNames } from "@/lib/helper";
import { useAuth } from "@/contexts/AuthContext";

const RecommendedGrid = ({ items = [] }) => {
	const { categories } = useAuth();
	return (
		<div>
			<CategoryUnderline name="Maharashtra" label="तुमच्यासाठी निवडक" url="/recommended" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{(items && items.length > 0) && items.map((s, i) => (
					<StandardCard 
						key={i} 
						headline={s.title} 
						layout="col" 
						imageUrl={s?.featuredImage}
						data={s}
					/>
				))}
			</div>
		</div>
	);
};

export default RecommendedGrid;
