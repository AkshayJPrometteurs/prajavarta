export default function BreakingStrip() {
    return (
        <div
            style={{
                height: 40,
                background: 'var(--color-breaking)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                overflow: 'hidden',
                gap: 12,
            }}
        >
            <span
                style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '3px 8px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    flexShrink: 0,
                }}
            >
                BREAKING
            </span>
            <span
                className="mr"
                style={{
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                विधानसभा निवडणूक निकाल जाहीर · सरकार स्थापनेच्या हालचालींना वेग · मुंबईत जोरदार पाऊस ·
            </span>
        </div>
    )
}
