import Link from "next/link"
import ImagePlaceholder from "../ImagePlaceholder"
import Badge from "../ui/Badge"
import CategoryChip from "../ui/CategoryChip"
import Meta from "../ui/Meta"

export default function StandardCard({ category, headline, layout = 'row', badge }) {
    if (layout === 'row') {
        return (
            <Link href={`/article/${category}`}>
                <article
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '112px 1fr',
                        gap: 12,
                        alignItems: 'start',
                    }}
                >
                    <div style={{ position: 'relative' }}>
                        <ImagePlaceholder ratio="1/1" label="240×240" />
                        {badge && <Badge type={badge} small />}
                    </div>
                    <div>
                        <CategoryChip name={category} size="sm" />
                        <h4
                            className="mr"
                            style={{
                                margin: '6px 0 4px',
                                fontSize: 15,
                                lineHeight: 1.4,
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                            }}
                        >
                            {headline}
                        </h4>
                        <Meta minutes={2} compact />
                    </div>
                </article>
            </Link>
        )
    }

    return (
        <Link href={`/article/${category}`}>
            <article className="w-full md:w-auto">
                <div style={{ position: 'relative' }}>
                    <ImagePlaceholder ratio="16/9" label="600×338" />
                    {badge && <Badge type={badge} />}
                </div>
                <div style={{ paddingTop: 8 }}>
                    <CategoryChip name={category} size="sm" />
                    <h4
                        className="mr"
                        style={{
                            margin: '6px 0 4px',
                            fontSize: 16,
                            lineHeight: 1.4,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                        }}
                    >
                        {headline}
                    </h4>
                    <Meta minutes={3} compact />
                </div>
            </article>
        </Link>
    )
}