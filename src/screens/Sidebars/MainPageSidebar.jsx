"use client"

import React, { useEffect, useState, memo } from "react";
import Ad from "@/components/Ad";
import Newsletter from "@/components/Newsletter";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import CompactListItem from "@/components/ui/CompactListItem";
import { useScreenSize } from "@/hooks/useScreenSize";
import Link from "next/link";
import axiosInstance from "@/lib/axios";

const MainPageSidebar = ({ data = null }) => {
    const { screenWidth } = useScreenSize();
    const [puneUpdates, setPuneUpdates] = useState([]);

    const getPuneUpdates = async () => {
        try {
            const response = await axiosInstance.get('/specific-city-wise-news', {
                params: { district: 'Pune', limit: 3 }
            });

            if (response.data.success) {
                setPuneUpdates(response.data.data.news || []);
            }
        } catch (error) {
            console.error('Error fetching Pune updates:', error);
        }
    }

    useEffect(() => {
        getPuneUpdates();
    }, []);

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
                <CategoryUnderline
                    name="Maharashtra"
                    label="मिनी ट्रेंडिंग"
                    url="/mini-trending"
                />
                <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {data?.mini_trending_news?.map((h, i) => {
                        const isLast = i === data.mini_trending_news.length - 1
                        return (
                            <CompactListItem
                                key={i}
                                n={i + 1}
                                headline={h?.title}
                                slug={h?.slug}
                                isLast={isLast}
                            />
                        )
                    })}
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
                <CategoryUnderline name="Pune" label="पुण्यातील अद्यतन" url="/city-updates?district=Pune" />
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {puneUpdates.map((item, i) => {
                        return (
                            <Link href={`article/${item?.slug}`} key={i}>
                                <li
                                    className="mr"
                                    style={{
                                        fontSize: 14,
                                        lineHeight: 1.4,
                                        color: 'var(--text-primary)',
                                        borderBottom: '1px solid var(--border-default)',
                                        paddingBottom: 12
                                    }}
                                >
                                    {item?.title || item}
                                </li>
                            </Link>
                        )
                    })}
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