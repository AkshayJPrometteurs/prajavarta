"use client"

import { memo } from "react";
import CategoryUnderline from "./CategoryUnderline";
import FeaturedCard from "../cards/FeaturedCard";
import StandardCard from "../cards/StandardCard";
import { useScreenSize } from "../../hooks/useScreenSize";
import { getCategoryNamesEnglish } from "@/lib/helper";
import { useAuth } from "@/contexts/AuthContext";

const CategorySection = ({ cat, hero, stories }) => {
    const { screenWidth } = useScreenSize();
    const { categories } = useAuth();

    return (
        <section style={{ padding: '8px 0 24px' }}>
            <CategoryUnderline name={cat} url={`/category/${getCategoryNamesEnglish(hero?.categoryIds, categories)}`} />
            {screenWidth < 992 ? (
                <>
                    {/* Mobile layout: featured + stacked list */}
                    <div>
                        <FeaturedCard category={cat} headline={hero?.title} data={hero} />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: '1px solid var(--border-default)',
                            }}
                        >
                            {stories.map((s, i) => {
                                return (
                                    <StandardCard
                                        key={i}
                                        category={cat}
                                        headline={s?.title}
                                        imageUrl={s?.featuredImage}
                                        data={s}
                                        categoryNameEnglish={getCategoryNamesEnglish(s?.categoryIds, categories)}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Desktop layout: 1.4fr + 1fr grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <FeaturedCard category={cat} headline={hero?.title} data={hero} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {stories.map((s, i) => (
                                <StandardCard
                                    key={i}
                                    category={cat}
                                    headline={s?.title}
                                    layout="row"
                                    imageUrl={s?.featuredImage}
                                    data={s}
                                    categoryNameEnglish={getCategoryNamesEnglish(s?.categoryIds, categories)}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}

export default memo(CategorySection)