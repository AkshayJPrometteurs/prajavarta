"use client"

import React from "react";
import { useScreenSize } from "@/hooks/useScreenSize";
import Ad from "@/components/Ad";
import Newsletter from "@/components/Newsletter";
import CategoryUnderline from "@/components/ui/CategoryUnderline";
import Link from "next/link";

const AUTHOR_STATS = [
    { l: 'एकूण लेख', v: '२,४६८' },
    { l: 'या वर्षी', v: '१४२' },
    { l: 'या महिन्यात', v: '२८' },
    { l: 'फॉलोअर्स', v: '३४.६ K' },
    { l: 'सरासरी वाचन वेळ', v: '५:४२ मि.' },
]

const RELATED_EDITORS = [
    { n: 'मीना पाटील', r: 'महाराष्ट्र संपादक', a: 'मीप' },
    { n: 'राहुल जोशी', r: 'पुणे रिपोर्टर', a: 'राजो' },
    { n: 'प्रिया कुलकर्णी', r: 'मंत्रालय बातमीदार', a: 'प्रकु' },
]

const AuthorSidebar = () => {
    const { screenWidth } = useScreenSize();

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
            <div className="p-5 border border-(--border-default)">
                <div className="mr text-[13px] font-bold text-(--text-tertiary) tracking-[0.06em] uppercase mb-3.5">
                    लेखकाची आकडेवारी
                </div>

                <div className="flex flex-col gap-3.5">
                    {AUTHOR_STATS.map((s) => (
                        <div
                            key={s.l}
                            className="flex justify-between pb-2.5 border-b border-(--border-default)"
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
            <div className="p-5 border border-(--border-default)">
                <CategoryUnderline name="Politics" label="संबंधित संपादक" />

                <div className="flex flex-col gap-3.5">
                    {RELATED_EDITORS.map((p, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 pb-3 border-b border-(--border-default)"
                        >
                            <div className="w-10 h-10 rounded-full bg-(--brand-primary-light) flex items-center justify-center font-bold text-(--brand-primary) text-[13px] [font-family:var(--font-mr)] shrink-0">
                                {p.a}
                            </div>

                            <div className="flex-1">
                                <Link href={`/author/${p.n}`} className="mr text-sm font-semibold">
                                    {p.n}
                                </Link>

                                <div className="mr text-[11px] text-(--text-tertiary)">
                                    {p.r}
                                </div>
                            </div>

                            <button className="text-[11px] px-2.5 py-1 border border-(--brand-primary) text-(--brand-primary) bg-white font-semibold cursor-pointer rounded">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
            </div>

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

export default AuthorSidebar;