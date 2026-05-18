"use client"

import React from "react"
import Ad from "@/components/Ad"
import Newsletter from "@/components/Newsletter"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import CompactListItem from "@/components/ui/CompactListItem"
import Link from "next/link"
import { timeAgo } from "@/lib/helper"

const TagSidebar = ({
    tag = '',
    mostRead = [],
    latestNews = []
}) => {
    return (
        <aside className="space-y-5">
            <Ad
                id="DC2a"
                name="Desktop Tag Sidebar Fold 1"
                size="300×250"
                width={300}
                height={250}
            />

            {/* MOST READ */}

            <div className="p-5 border border-(--border-default)">
                <CategoryUnderline
                    name={tag}
                    label="सर्वाधिक वाचलेले"
                    url="/most-read"
                />

                <ol className="list-none m-0 p-0">
                    {mostRead.map((news, i) => (
                        <CompactListItem
                            key={news.id || i}
                            n={i + 1}
                            headline={news.title}
                            href={
                                news.slug
                                    ? `/article/${news.slug}`
                                    : '#'
                            }
                        />
                    ))}
                </ol>
            </div>

            {/* RECENTLY UPDATED */}

            <div className="p-5 border border-(--border-default)">
                <CategoryUnderline
                    name={tag}
                    label="नुकतेच अद्यतनित"
                    url={`/recently-updated`}
                />

                <ul className="list-none m-0 p-0 flex flex-col gap-3.5">
                    {latestNews
                        .slice(0, 5)
                        .map((news, i) => {
                            const publishedTime =
                                news?.publishedDate
                                    ? timeAgo(
                                          news.publishedDate
                                      )
                                    : ''

                            return (
                                <li
                                    key={news.id || i}
                                    className="border-b border-(--border-default) pb-3.5"
                                >
                                    <div className="text-[11px] text-(--color-live) font-bold mb-1 tracking-[0.04em]">
                                        {publishedTime}
                                    </div>

                                    <Link
                                        href={
                                            news.slug
                                                ? `/article/${news.slug}`
                                                : '#'
                                        }
                                    >
                                        <p className="mr m-0 text-sm font-semibold leading-[1.4] hover:text-(--brand-primary)">
                                            {
                                                news.title
                                            }
                                        </p>
                                    </Link>
                                </li>
                            )
                        })}
                </ul>
            </div>

            <Ad
                id="DC2b"
                name="Desktop Tag Sidebar Fold 2"
                size="300×600"
                width={300}
                height={600}
            />

            <Newsletter />

            <Ad
                id="DC2c"
                name="Desktop Tag Sidebar Fold 3"
                size="300×250"
                width={300}
                height={250}
            />
        </aside>
    )
}

export default TagSidebar