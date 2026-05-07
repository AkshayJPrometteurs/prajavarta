"use client"

import HeroCard from "@/components/cards/HeroCard";

const HeroSection = () => {
    return (
        <div className="space-y-4">
            {/* Hero story */}
            <HeroCard
                category="महाराष्ट्र"
                headline="विधानसभेत सत्तासंघर्ष: सरकार स्थापनेच्या हालचालींना वेग, दिल्लीत रात्री बैठक"
                subtitle="राज्यपाल भेट उद्या सकाळी; नवीन मंत्रिमंडळाची संभाव्य रचना समोर"
                redirectUrl="/article/महाराष्ट्र"
            />
        </div>
    )
}

export default HeroSection;