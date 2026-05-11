"use client"

import { memo } from 'react'
import { ClockIcon } from './Icons'

const Meta = ({ author, minutes = 3, compact }) => {
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
                <span className="mr">{minutes} मिनिटे</span>
            </span>

            <span>·</span>

            <span className="mr whitespace-nowrap">
                २९ एप्रिल
            </span>
        </div>
    )
}

export default memo(Meta)