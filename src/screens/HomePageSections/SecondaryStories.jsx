"use client";

import StandardCard from "../../components/cards/StandardCard";

const SecondaryStories = () => {
	return (
		<div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<StandardCard
					category="राजकारण"
					headline="मुख्यमंत्र्यांच्या शपथविधीसाठी मुंबईत वानखेडेवर कार्यक्रम होणार"
					badge="LIVE"
					layout="col"
				/>
				<StandardCard
					category="पुणे"
					headline="पुणे महानगरपालिकेच्या अर्थसंकल्पात पाणीपुरवठा योजनेला प्राधान्य"
					layout="col"
				/>
			</div>
			<div className="mt-4 md:hidden">
				<StandardCard
					category="गुन्हेगारी"
					headline="कोथरूडमध्ये बँक दरोडा प्रकरणी तीन संशयित ताब्यात"
				/>
			</div>
		</div>
	);
};

export default SecondaryStories;
