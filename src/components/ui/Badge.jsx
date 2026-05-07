const BADGE_STYLES = {
    LIVE: { bg: 'var(--color-live)', color: '#fff', icon: true, label: 'LIVE' },
    VIDEO: { bg: 'rgba(0,0,0,0.7)', color: '#fff', icon: false, label: '▶ Video' },
    PHOTOS: { bg: 'rgba(0,0,0,0.7)', color: '#fff', icon: false, label: '◫ 12 photos' },
    SPONSORED: { bg: 'var(--color-sponsored)', color: '#fff', icon: false, label: 'Sponsored' },
}

export default function Badge({ type, small }) {
    const s =
        BADGE_STYLES[type] || {
            bg: '#000',
            color: '#fff',
            icon: false,
            label: type,
        }

    return (
        <span
            style={{
                position: 'absolute',
                top: 8,
                left: 8,
                padding: small ? '3px 6px' : '4px 8px',
                background: s.bg,
                color: s.color,
                fontSize: small ? 9 : 10,
                fontWeight: 800,
                letterSpacing: '0.06em',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
            }}
        >
            {s.icon && (
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'inline-block',
                    }}
                />
            )}
            {s.label}
        </span>
    )
}