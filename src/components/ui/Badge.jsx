import { memo } from "react"

const BADGE_STYLES = {
    LIVE: { bg: 'var(--color-live)', color: '#fff', icon: true, label: 'LIVE' },
    VIDEO: { bg: 'rgba(0,0,0,0.7)', color: '#fff', icon: false, label: '▶ Video' },
    PHOTOS: { bg: 'rgba(0,0,0,0.7)', color: '#fff', icon: false, label: '◫ 12 photos' },
    SPONSORED: { bg: 'var(--color-sponsored)', color: '#fff', icon: false, label: 'Sponsored' },
}

const Badge = ({ type, small }) => {
    const s =
        BADGE_STYLES[type] || {
            bg: '#000',
            color: '#fff',
            icon: false,
            label: type,
        }

    return (
        <span
            className={`absolute top-2 left-2 rounded-[3px] flex items-center gap-1 text-center font-extrabold tracking-[0.06em] z-1 ${small ? 'px-1.5 py-1 text-[9px]' : 'px-2 py-1 text-[10px]'}`}
            style={{
                background: s.bg,
                color: s.color,
            }}
        >
            {s.icon && (
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block shrink-0" />
            )}

            <span className="leading-none whitespace-nowrap">
                {s.label}
            </span>
        </span>
    )
}

export default memo(Badge)