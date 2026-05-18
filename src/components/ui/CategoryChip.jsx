"use client"

import { memo } from "react"
import { catColor } from "@/lib/catColors"
import Link from "next/link"

const CategoryChip = ({ name, size = 'md', url = "" }) => {
    return (
        <Link href={url}>
            <span
                className={`mr inline-block font-bold tracking-[0.04em] text-white uppercase rounded-xs whitespace-nowrap text-xs py-1 ${size === 'sm' ? 'px-2' : 'px-3'}`}
                style={{ background: catColor(name) }}
            >
                {name}
            </span>
        </Link>
    )
}

export default memo(CategoryChip)