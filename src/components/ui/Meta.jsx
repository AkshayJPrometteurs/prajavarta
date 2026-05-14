"use client"

import { memo } from 'react'
import { ClockIcon } from './Icons'
import { formatMarathiDate, timeAgo } from '@/lib/helper'

const Meta = ({ author, compact, data = null }) => {
    return (
        <div className={`flex items-center flex-wrap gap-2 text-[11px] text-gray-600 ${compact ? 'mt-1.5' : 'mt-2.5'}`}>
            {author && (
                <span className="mr truncate max-w-32 sm:max-w-none">
                    {author}
                </span>
            )}

            {author && <span>·</span>}

            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <ClockIcon />
                <span className="mr">{timeAgo(data?.createdAt)}</span>
            </span>

            <span>·</span>

            <span className="mr whitespace-nowrap">
                {formatMarathiDate(data?.createdAt)}
            </span>
        </div>
    )
}

export default memo(Meta)