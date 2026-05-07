"use client";

import StandardCard from "@/components/cards/StandardCard";
import CategoryUnderline from "@/components/ui/CategoryUnderline";

const RECOMMENDED = [
	{ c: 'मनोरंजन', h: 'मराठी रंगभूमीचा ७५ वा वर्धापनदिन: \'नटसम्राट\' चे भव्य पुनःप्रदर्शन' },
	{ c: 'व्यवसाय', h: 'टाटा मोटर्सच्या इलेक्ट्रिक एसयूव्हीचे अनावरण, बुकिंग सुरू' },
	{ c: 'महाराष्ट्र', h: 'कोकणात पावसाने सरासरी ओलांडली, शेतकऱ्यांना दिलासा' },
	{ c: 'पुणे', h: 'पुणे विद्यापीठात नवीन AI संशोधन केंद्र सुरू होणार' },
	{ c: 'राजकारण', h: 'मनसेच्या अधिवेशनात राज ठाकरे यांचे आक्रमक भाषण' },
	{ c: 'क्रीडा', h: 'महाराष्ट्र केसरी कुस्ती स्पर्धेला कोल्हापुरात सुरुवात' },
]

const RecommendedGrid = () => {
	return (
		<div>
			<CategoryUnderline name="Maharashtra" label="तुमच्यासाठी निवडक" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{RECOMMENDED.map((s, i) => (
					<StandardCard key={i} category={s.c} headline={s.h} layout="col" />
				))}
			</div>
		</div>
	);
};

export default RecommendedGrid;
