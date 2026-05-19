"use client"

import React, { memo, useState, useEffect } from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import Ad from "@/components/Ad";
import Newsletter from "@/components/Newsletter";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import Link from "next/link";
import { User } from "lucide-react";
import { getShortName } from "@/lib/helper";
import axiosInstance from "@/lib/axios";

const AuthorSidebar = ({ stats, related = [], isAuthenticated, author }) => {
    const { screenWidth } = useScreenSize();
    const [localRelated, setLocalRelated] = useState(related);
    const [loadingStates, setLoadingStates] = useState({});

    // Update local state when related prop changes
    useEffect(() => {
        setLocalRelated(related);
    }, [related]);

    const handleFollowEditor = async (editorId) => {
        try {
            setLoadingStates(prev => ({ ...prev, [editorId]: true }));
            const response = await axiosInstance.post('/news/author/follow', {
                authorId: editorId
            });
            if (response.data.success) {
                setLocalRelated(prev => prev.map(editor => 
                    editor.id === editorId 
                    ? { ...editor, isFollowing: response.data.following } 
                    : editor
                ));
            }
        } catch (error) {
            console.error("Error following/unfollowing editor:", error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [editorId]: false }));
        }
    };

    const displayStats = [
        { l: 'एकूण लेख', v: stats?.totalArticles || 0 },
        { l: 'या वर्षी', v: stats?.articlesThisYear || 0 },
        { l: 'या महिन्यात', v: stats?.articlesThisMonth || 0 },
        { l: 'फॉलोअर्स', v: stats?.followers || 0 },
        { l: 'सरासरी वाचन वेळ', v: '५:४२ मि.' }, // Placeholder
    ];

    return (
        <aside className="space-y-6">
            <Ad
                id="DC2a"
                name="Author Sidebar Fold 1"
                size="300×250"
                width={300}
                height={250}
                fluid={screenWidth < 992}
            />

            {/* Author stats */}
            <div className="p-5 border border-(--border-default) rounded-lg">
                <div className="mr text-[13px] font-bold text-(--text-tertiary) tracking-[0.06em] uppercase mb-3.5">
                    लेखकाची आकडेवारी
                </div>

                <div className="flex flex-col gap-3.5">
                    {displayStats.map((s) => (
                        <div
                            key={s.l}
                            className="flex justify-between pb-2.5 border-b border-(--border-default) last:border-0 last:pb-0"
                        >
                            <span className="mr text-[13px] text-(--text-secondary)">
                                {s.l}
                            </span>

                            <span className="mr text-sm font-bold">
                                {s.v}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Related editors */}
            {localRelated.length > 0 && (
                <div className="p-5 border border-(--border-default) rounded-lg">
                    <CategoryUnderline
                        name="Authors"
                        label="संबंधित संपादक"
                        url={`/related-authors/?authorName=${author.nameEnglish || author.name}`}
                    />

                    <div className="flex flex-col gap-3.5">
                        {localRelated.map((p, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 pb-3 border-b border-(--border-default) last:border-0 last:pb-0"
                            >
                                <div className="w-10 h-10 rounded-full bg-(--brand-primary-light) flex items-center justify-center font-bold text-(--brand-primary) text-[13px] overflow-hidden shrink-0">
                                    {p.image ? (
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="mr">{getShortName(p.name)}</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <Link href={`/author/${p.nameEnglish || p.name}`} className="mr text-sm font-semibold hover:text-(--brand-primary) transition-colors">
                                        {p.name}
                                    </Link>

                                    <div className="mr text-[11px] text-(--text-tertiary) line-clamp-1">
                                        {p.role}
                                    </div>
                                </div>

                                {isAuthenticated && (
                                    <button 
                                        onClick={() => handleFollowEditor(p.id)}
                                        disabled={loadingStates[p.id]}
                                        className={`text-[11px] px-2.5 py-1 border font-semibold cursor-pointer rounded transition-all flex items-center justify-center min-w-17.5 ${
                                            p.isFollowing 
                                            ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200' 
                                            : 'bg-white border-(--brand-primary) text-(--brand-primary) hover:bg-(--brand-primary) hover:text-white'
                                        }`}
                                    >
                                        {loadingStates[p.id] ? (
                                            <div className="w-3 h-3 border-2 border-current border-t-transparent animate-spin rounded-full"></div>
                                        ) : p.isFollowing ? '✓ Following' : 'Follow'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Ad
                id="DC2b"
                name="Author Sidebar Fold 2"
                size="300×600"
                width={300}
                height={600}
                fluid={screenWidth < 992}
            />

            <Newsletter />

            <Ad
                id="DC2c"
                name="Author Sidebar Fold 3"
                size="300×250"
                width={300}
                height={250}
                fluid={screenWidth < 992}
            />
        </aside>
    );
};

export default memo(AuthorSidebar);