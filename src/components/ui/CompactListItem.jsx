import { catColor } from '@/lib/catColors'

export default function CompactListItem({ n, headline, category }) {
    return (
        <li
            style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid var(--border-default)',
                listStyle: 'none',
            }}
        >
            <span
                style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: 'var(--brand-primary)',
                    lineHeight: 1,
                    fontFamily: 'var(--font-en, system-ui)',
                }}
            >
                {String(n).padStart(2, '0')}
            </span>

            <div>
                {category && (
                    <span
                        className="mr"
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: catColor(category),
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {category}
                    </span>
                )}

                <p
                    className="mr"
                    style={{
                        fontSize: 14,
                        lineHeight: 1.4,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                    }}
                >
                    {headline}
                </p>
            </div>
        </li>
    )
}