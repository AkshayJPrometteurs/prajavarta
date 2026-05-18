"use client";

import { memo } from "react";
import Badge from "../ui/Badge";
import CategoryChip from "../ui/CategoryChip";
import Meta from "../ui/Meta";
import Link from "next/link";
import CustomImage from "../ui/CustomImage";
import { useAuth } from "@/contexts/AuthContext";
import { getCategoryNames, getCategoryNamesEnglish } from "@/lib/helper";

const FeaturedCard = ({ headline, kicker, badge, data = null }) => {
    const { categories } = useAuth();

    return (
        <article>
            <div className="relative">
                <CustomImage
                    src={data.featuredImage}
                    alt={headline}
                    width={800}
                    height={185}
                    className="h-46.25 w-full rounded object-cover"
                />

                {badge && <Badge type={badge} />}
            </div>

            <div className="pt-2.5">
                <div className="mb-2 flex flex-wrap gap-2">
                    {data?.categoryIds &&
                        String(data.categoryIds)
                            .split(',')
                            .map((id) => id.trim())
                            .filter(Boolean)
                            .map((id) => {
                                const categoryName = getCategoryNames(id, categories);
                                const categoryEnglishName = getCategoryNamesEnglish(id, categories);

                                // Skip if category not found
                                if (!categoryName || !categoryEnglishName) {
                                    return null;
                                }

                                return (
                                    <CategoryChip
                                        key={id}
                                        name={categoryName}
                                        url={`/category/${categoryEnglishName}`}
                                    />
                                );
                            }
                        )
                    }
                </div>

                <Link href={`/article/${data?.slug || ''}`}>
                    <h3
                        className="mr my-2 mb-1.5 text-[18px] font-bold leading-[1.35]"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {headline}
                    </h3>
                </Link>

                {kicker && (
                    <p
                        className="mr m-0 text-[13px]"
                        style={{ color: 'var(--text-tertiary)' }}
                    >
                        {kicker}
                    </p>
                )}

                <Meta data={data} />
            </div>
        </article>
    );
}

export default memo(FeaturedCard);