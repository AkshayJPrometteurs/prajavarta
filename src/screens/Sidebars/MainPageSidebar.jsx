"use client"

import React, { memo } from "react";
import Ad from "@/components/Ad";
import Newsletter from "@/components/Newsletter";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import CompactListItem from "@/components/ui/CompactListItem";
import { useScreenSize } from "@/hooks/useScreenSize";

const MINI_TRENDING = [
    'मनोज जरांगे पाटील आज औरंगाबादेत उपोषणाला बसणार',
    'गणेशोत्सव २०२६ साठी मंडळांची तयारी सुरू, परवानग्या जलद',
    'नवीन MPSC परीक्षा वेळापत्रक जाहीर, मे महिन्यात मुख्य परीक्षा',
    'शिवसेना (UBT) विजय सत्रात ठाकरेंचे आक्रमक भाषण',
    'महावितरणच्या वीजबिलात ८% वाढीचा प्रस्ताव',
]

const PUNE_UPDATES = [
    'हिंजवडीत वाहतूककोंडी कमी करण्यासाठी नवा फ्लायओव्हर मंजूर',
    'पुणे विमानतळावर तीन नवीन आंतरराष्ट्रीय उड्डाणे सुरू',
    'कात्रज-कोंढवा रस्त्याचे काम मार्चपर्यंत पूर्ण',
]

const MainPageSidebar = () => {
    const { screenWidth } = useScreenSize();
    return (
        <aside className="space-y-4">
            {/* Fold 1: 300×250 */}
            <Ad
                id="DH2a"
                name="Desktop Sidebar Fold 1"
                size="300×250"
                width={300}
                height={250}
                fluid={screenWidth <= 992}
            />

            <div style={{ padding: 20, border: '1px solid var(--border-default)' }}>
                <CategoryUnderline name="Maharashtra" label="मिनी ट्रेंडिंग" />
                <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {MINI_TRENDING.map((h, i) => (
                        <CompactListItem key={i} n={i + 1} headline={h} />
                    ))}
                </ol>
            </div>

            {/* Fold 2: 300×600 */}
            <Ad
                id="DH2b"
                name="Desktop Sidebar Fold 2"
                size="300×600"
                width={300}
                height={600}
                fluid={screenWidth <= 992}
            />

            <Newsletter />

            <div style={{ padding: 20, border: '1px solid var(--border-default)' }}>
                <CategoryUnderline name="Pune" label="पुण्यातील अद्यतन" />
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {PUNE_UPDATES.map((h, i) => (
                        <li key={i} className="mr" style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-default)', paddingBottom: 12 }}>
                            {h}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Fold 3: 300×250 */}
            <Ad
                id="DH2c"
                name="Desktop Sidebar Fold 3"
                size="300×250"
                width={300}
                height={250}
                fluid={screenWidth <= 992}
            />
        </aside>
    );
};

export default memo(MainPageSidebar);