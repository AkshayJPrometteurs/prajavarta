"use client"

import React from "react";
import Ad from "@/components/Ad";
import Newsletter from "@/components/Newsletter";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import CompactListItem from "@/components/ui/CompactListItem";

const CAT = 'महाराष्ट्र'

const MOST_READ = [
    'मराठा आरक्षणावर सर्वोच्च न्यायालयाची सुनावणी',
    'शिवसेनेच्या अधिवेशनात ठाकरेंचे आक्रमक भाषण',
    'महावितरणच्या वीजबिलात ८% वाढीचा प्रस्ताव',
    'MPSC परीक्षेचे नवीन वेळापत्रक जाहीर',
    'गणेशोत्सव परवानगी प्रक्रिया जलद',
]

const RECENTLY_UPDATED = [
    { t: '६ मि.', h: 'विधान परिषद निवडणूक वेळापत्रक' },
    { t: '१४ मि.', h: 'मुंबईत पावसाचा रेड अलर्ट' },
    { t: '३२ मि.', h: 'नागपूरमध्ये जिल्हाधिकारी बदल' },
    { t: '१ तास', h: 'सोलापूर बँक घोटाळा प्रकरणी अटक' },
]

const TagSidebar = () => {
    return (
        <aside className="space-y-5">
            <Ad id="DC2a" name="Desktop Tag Sidebar Fold 1" size="300×250" width={300} height={250} />

            <div className="p-5 border border-(--border-default)">
                <CategoryUnderline name={CAT} label="सर्वाधिक वाचलेले" />
                <ol className="list-none m-0 p-0">
                    {MOST_READ.map((h, i) => (
                        <CompactListItem key={i} n={i + 1} headline={h} />
                    ))}
                </ol>
            </div>

            <div className="p-5 border border-(--border-default)">
                <CategoryUnderline name={CAT} label="नुकतेच अद्यतनित" />

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

            <Ad id="DC2b" name="Desktop Tag Sidebar Fold 2" size="300×600" width={300} height={600} />

            <Newsletter />

            <Ad id="DC2c" name="Desktop Tag Sidebar Fold 3" size="300×250" width={300} height={250} />
        </aside>
    );
};

export default TagSidebar;