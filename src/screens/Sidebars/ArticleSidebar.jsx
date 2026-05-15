"use client"

import React, { memo } from "react";
import Ad from "@/components/Ad";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import CompactListItem from "@/components/ui/CompactListItem";
import { FacebookIcon, LinkIcon, WhatsAppIcon, XIcon } from "@/components/ui/Icons";
import { useScreenSize } from "@/hooks/useScreenSize";

const MINI_TRENDING = [
    'मनोज जरांगे पाटील आज औरंगाबादेत उपोषणाला बसणार',
    'गणेशोत्सव २०२६ साठी मंडळांची तयारी सुरू',
    'नवीन MPSC परीक्षा वेळापत्रक जाहीर',
    'महावितरणच्या वीजबिलात ८% वाढीचा प्रस्ताव',
    'ठाकरे गटाच्या अधिवेशनाची तारीख निश्चित',
]

const MOST_READ = [
    'मंत्रिमंडळ विस्ताराचे संभाव्य चेहरे: संपूर्ण यादी',
    'महायुतीच्या जागावाटपात अंतिम गठित कोणाला?',
    'उपमुख्यमंत्रीपदाची शर्यत: ३ नावांची चर्चा',
    'मराठा आरक्षणावर सर्वोच्च न्यायालयाची सुनावणी',
]

const SHARE_BUTTONS = [
    { icon: <WhatsAppIcon size={14} />, color: '#25D366', label: 'WhatsApp' },
    { icon: <FacebookIcon size={14} />, color: '#1877F2', label: 'Facebook' },
    { icon: <XIcon size={14} />, color: '#000', label: 'X' },
    { icon: <LinkIcon size={14} />, color: '#6B6B6B', label: 'Copy' },
]

const ArticleSidebar = ({ trending = [], mostRead = [] }) => {
    const { screenWidth } = useScreenSize();
    return (
        <aside className="space-y-5">
            {/* Desktop share rail */}
            <div className="p-4 border border-(--border-default) flex items-center gap-3.5 w-fit">
                <div className="text-[11px] font-bold tracking-[0.06em] uppercase text-(--text-tertiary)">
                    Share
                </div>

                {SHARE_BUTTONS.map((b, k) => (
                    <button
                        key={k}
                        className="w-9 h-9 border border-(--border-default) bg-white flex items-center justify-center cursor-pointer text-(--text-secondary) rounded"
                    >
                        {b.icon}
                    </button>
                ))}
            </div>

            {/* Fold 1 */}
            <Ad
                id="DA2a"
                name="Desktop Article Sidebar Fold 1"
                size="300×250"
                width={300}
                height={250}
                fluid={screenWidth <= 992}
            />

            {trending.length > 0 && (
                <div className="p-5 border border-(--border-default)">
                    <CategoryUnderline name="Maharashtra" label="मिनी ट्रेंडिंग" url="/mini-trending" />

                    <ol className="list-none m-0 p-0">
                        {trending.map((item, i) => (
                            <CompactListItem 
                                key={i} 
                                n={i + 1} 
                                headline={item.title} 
                                category={item.category?.name}
                                slug={item.slug} 
                            />
                        ))}
                    </ol>
                </div>
            )}

            {/* Fold 2 */}
            <Ad
                id="DA2b"
                name="Desktop Article Sidebar Fold 2"
                size="300×600"
                width={300}
                height={600}
                fluid={screenWidth <= 992}
            />

            <div className="p-5 border border-(--border-default)">
                <CategoryUnderline name="Politics" label="सर्वाधिक वाचलेले" url="/most-read" />

                <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
                    {(mostRead.length > 0 ? mostRead : MOST_READ).map((item, i) => (
                        <li
                            key={i}
                            className="mr text-sm leading-[1.45] text-(--text-primary) border-b border-(--border-default) pb-3.5 font-medium"
                        >
                            {typeof item === 'string' ? (
                                item
                            ) : (
                                <Link href={`/article/${item.slug}`} className="hover:text-(--brand-primary) transition-colors">
                                    {item.title}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <Newsletter />

            {/* Fold 3 */}
            <Ad
                id="DA2c"
                name="Desktop Article Sidebar Fold 3"
                size="300×250"
                width={300}
                height={250}
                fluid={screenWidth <= 992}
            />
        </aside>
    );
};

export default memo(ArticleSidebar);