"use client"

import { catColor } from '@/lib/catColors'
import Link from 'next/link'
import { memo } from 'react'

const CompactListItem = ({ n, headline, category, slug, isLast = false }) => {
    const content = (
        <li
            className={`
                grid grid-cols-[32px_1fr] gap-3 py-3 list-none
                ${!isLast ? 'border-b border-(--border-default)' : ''}
                ${slug ? 'cursor-pointer' : 'cursor-default'}
            `}
        >
            <span
                className="text-2xl font-extrabold leading-none"
                style={{
                    color: 'var(--brand-primary)',
                    fontFamily: 'var(--font-en, system-ui)',
                }}
            >
                {String(n).padStart(2, '0')}
            </span>

            <div>
                {category && (
                    <span
                        className="mr text-[11px] font-bold uppercase tracking-wider"
                        style={{
                            color: catColor(category),
                        }}
                    >
                        {category}
                    </span>
                )}

                <p
                    className="mr text-sm font-semibold leading-[1.4]"
                    style={{
                        color: 'var(--text-primary)',
                    }}
                >
                    {headline}
                </p>
            </div>
        </li>
    )

    if (slug) {
        return (
            <Link
                href={`/article/${slug}`}
                className="no-underline transition-opacity hover:opacity-80"
            >
                {content}
            </Link>
        )
    }

    return content
}

export default memo(CompactListItem)