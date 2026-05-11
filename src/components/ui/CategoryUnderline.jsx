"use client"

import { memo } from 'react'
import Link from 'next/link'
import { catColor } from '@/lib/catColors'

const CategoryUnderline = ({ name, label, url }) => {
    return (
        <div
            className="flex items-center justify-between pb-2 mb-4 gap-3"
            style={{ borderBottom: `3px solid ${catColor(name)}` }}
        >
            <h3 className="mr m-0 text-base sm:text-lg font-bold">
                {label || name}
            </h3>

            <Link
                href={url || '/'}
                className="mr text-[11px] sm:text-[12px] font-semibold no-underline cursor-pointer whitespace-nowrap shrink-0"
                style={{ color: catColor(name) }}
            >
                सर्व पहा →
            </Link>
        </div>
    )
}

export default memo(CategoryUnderline)