"use client";

import { memo } from "react";
import StandardCard from "../../components/cards/StandardCard";

const SecondaryStories = ({ data }) => {
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{data?.map((content) => {
					return (
						<div key={content?.id}>
							<StandardCard
								headline={content?.title}
								layout="col"
								imageUrl={content?.featuredImage}
							/>
						</div>
					)
				})}
			</div>
			<div className="mt-4 md:hidden">
				<StandardCard
					category="गुन्हेगारी"
					headline="कोथरूडमध्ये बँक दरोडा प्रकरणी तीन संशयित ताब्यात"
					layout="col"
				/>
			</div>
		</div>
	);
};

export default memo(SecondaryStories);
