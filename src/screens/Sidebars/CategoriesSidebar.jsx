import React from "react";
import Ad from "@/components/Ad";
import Newsletter from "@/components/Newsletter";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import CompactListItem from "@/components/ui/CompactListItem";
import Link from "next/link";
import { timeAgo } from "@/lib/helper";

const CategoriesSidebar = ({ cat, categoryId, categorySlug, mostRead = [], recentlyUpdated = [] }) => {
    const mostReadUrl = categorySlug 
        ? `/most-read?category=${categorySlug}`
        : "/most-read";
        
    const recentlyUpdatedUrl = categorySlug 
        ? `/recently-updated?category=${categorySlug}`
        : "/recently-updated";

    return (
        <aside className="space-y-5">
            <Ad
                id="DC2a"
                name="Desktop Category Sidebar Fold 1"
                size="300×250"
                width={300}
                height={250}
            />

            {mostRead.length > 0 && (
                <div className="p-5 border border-(--border-default)">
                    <CategoryUnderline name={cat} label="सर्वाधिक वाचलेले" url={mostReadUrl} />
                    <ol className="list-none m-0 p-0">
                        {mostRead.map((item, i) => (
                            <CompactListItem 
                                key={item.id} 
                                n={i + 1} 
                                headline={item.title} 
                                url={`/article/${item.slug}`}
                            />
                        ))}
                    </ol>
                </div>
            )}

            {recentlyUpdated.length > 0 && (
                <div className="p-5 border border-(--border-default)">
                    <CategoryUnderline name={cat} label="नुकतेच अद्यतनित" url={recentlyUpdatedUrl} />

                    <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
                        {recentlyUpdated.map((item, i) => (
                            <li key={item.id} className="border-b border-(--border-default) pb-3.5 last:border-0 last:pb-0">
                                <Link href={`/article/${item.slug}`}>
                                    <div className="text-[11px] text-(--color-live) font-bold mb-1 tracking-[0.04em]">
                                        {timeAgo(item.publishedDate || item.createdAt)}
                                    </div>

                                    <p className="mr m-0 text-sm font-semibold leading-[1.4] hover:text-orange-600 transition-colors">
                                        {item.title}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Ad
                id="DC2b"
                name="Desktop Category Sidebar Fold 2"
                size="300×600"
                width={300}
                height={600}
            />

            <Newsletter />

            <Ad
                id="DC2c"
                name="Desktop Category Sidebar Fold 3"
                size="300×250"
                width={300}
                height={250}
            />
        </aside>
    );
};

export default CategoriesSidebar;