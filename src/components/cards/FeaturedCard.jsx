import ImagePlaceholder from "../ImagePlaceholder";
import Badge from "../ui/Badge";
import CategoryChip from "../ui/CategoryChip";
import Meta from "../ui/Meta";

export default function FeaturedCard({ category, headline, kicker, badge }) {
    return (
        <article>
            <div style={{ position: 'relative' }}>
                <ImagePlaceholder ratio="16/9" label="featured · 800×450" />
                {badge && <Badge type={badge} />}
            </div>
            <div style={{ paddingTop: 10 }}>
                <CategoryChip name={category} size="sm" />
                <h3
                    className="mr"
                    style={{
                        margin: '8px 0 6px',
                        fontSize: 18,
                        lineHeight: 1.35,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                    }}
                >
                    {headline}
                </h3>
                {kicker && (
                    <p
                        className="mr"
                        style={{ margin: 0, fontSize: 13, color: 'var(--text-tertiary)' }}
                    >
                        {kicker}
                    </p>
                )}
                <Meta minutes={3} />
            </div>
        </article>
    )
}