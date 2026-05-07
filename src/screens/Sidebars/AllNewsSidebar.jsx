"use client"

import React, { memo } from "react";
import Ad from "@/components/Ad";
import Newsletter from "@/components/Newsletter";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import CompactListItem from "@/components/ui/CompactListItem";
import { useScreenSize } from "@/hooks/useScreenSize";

const MOST_READ = [
    { c: 'राजकारण', h: 'मराठा आरक्षणावर सर्वोच्च न्यायालयाची सुनावणी' },
    { c: 'महाराष्ट्र', h: 'शिवसेनेच्या अधिवेशनात ठाकरेंचे आक्रमक भाषण' },
    { c: 'व्यवसाय', h: 'महावितरणच्या वीजबिलात ८% वाढीचा प्रस्ताव' },
    { c: 'पुणे', h: 'MPSC परीक्षेचे नवीन वेळापत्रक जाहीर' },
    { c: 'क्रीडा', h: 'रोहित शर्मा कसोटीतून निवृत्त' },
]

const RECENTLY_UPDATED = [
    { t: '३ मि.', h: 'जरांगे पाटीलांचे आज सकाळचे निवेदन' },
    { t: '१८ मि.', h: 'विधान परिषद निवडणूक वेळापत्रक जाहीर' },
    { t: '३५ मि.', h: 'मुंबईत पावसाचा रेड अलर्ट' },
    { t: '१ तास', h: 'नागपूरमध्ये जिल्हाधिकारी बदल' },
]

const AllNewsSidebar = () => {
    const { screenWidth } = useScreenSize();
    return (
        <aside className="space-y-5">
            <Ad
                id="AN-D2a"
                name="All News Sidebar Fold 1"
                size="300×250"
                width={300}
                height={250}
                fluid={screenWidth <= 992}
            />

            {/* Most read */}
            <div className="p-5 border border-(--border-default)">
                <CategoryUnderline name="Maharashtra" label="सर्वाधिक वाचलेले" />

                <ol className="list-none m-0 p-0">
                    {MOST_READ.map((s, i) => (
                        <CompactListItem key={i} n={i + 1} headline={s.h} />
                    ))}
                </ol>
            </div>

            {/* Recently updated */}
            <div className="p-5 border border-(--border-default)">
                <CategoryUnderline name="Maharashtra" label="नुकतेच अद्यतनित" />

                <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
                    {RECENTLY_UPDATED.map((s, i) => (
                        <li key={i} className="border-b border-(--border-default) pb-3.5">
                            <div className="text-[11px] text-(--color-live) font-bold mb-1 tracking-[0.04em]">
                                {s.t} पूर्वी
                            </div>

                            <p className="mr m-0 text-sm font-semibold leading-[1.4]">
                                {s.h}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            <Ad
                id="AN-D2b"
                name="All News Sidebar Fold 2"
                size="300×600"
                width={300}
                height={600}
                fluid={screenWidth <= 992}
            />

            <Newsletter />

            <Ad
                id="AN-D2c"
                name="All News Sidebar Fold 3"
                size="300×250"
                width={300}
                height={250}
                fluid={screenWidth <= 992}
            />
        </aside>
    );
};

export default memo(AllNewsSidebar);