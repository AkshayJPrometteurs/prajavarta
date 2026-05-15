import { catColor } from '@/lib/catColors'
import Link from 'next/link'

export default function CompactListItem({ n, headline, category, slug }) {
    const content = (
        <li
            style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid var(--border-default)',
                listStyle: 'none',
                cursor: slug ? 'pointer' : 'default'
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

    if (slug) {
        return (
            <Link href={`/article/${slug}`} className="no-underline hover:opacity-80 transition-opacity">
                {content}
            </Link>
        )
    }

    return content
}