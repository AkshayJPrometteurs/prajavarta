"use client"

import { memo } from "react"
import { catColor } from "@/lib/catColors"

const CategoryChip = ({ name, size = 'md' }) => {
    return (
        <span
            className={`mr inline-block font-bold tracking-[0.04em] text-white uppercase rounded-xs whitespace-nowrap text-xs py-1 ${size === 'sm' ? 'px-2' : 'px-3'}`}
            style={{ background: catColor(name) }}
        >
            {name}
        </span>
    )
}

export default memo(CategoryChip)