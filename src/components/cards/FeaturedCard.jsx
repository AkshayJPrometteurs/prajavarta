import useImageExists from "@/hooks/useImageExists";
import ImagePlaceholder from "../ImagePlaceholder";
import Badge from "../ui/Badge";
import CategoryChip from "../ui/CategoryChip";
import Meta from "../ui/Meta";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedCard({ category, headline, kicker, badge, data = null }) {
    const { exists } = useImageExists(data?.featuredImage)
    return (
        <article>
            <div style={{ position: 'relative' }}>
                {exists ? (
                    <Image
                        src={data.featuredImage}
                        alt={headline}
                        width={800}
                        height={185}
                        style={{ width: '100%', height: '185px', objectFit: 'cover', borderRadius: 4 }}
                    />
                ) : (
                    <ImagePlaceholder ratio="16/9" label="featured · 800×450" />
                )}
                {badge && <Badge type={badge} />}
            </div>
            <div style={{ paddingTop: 10 }}>
                <CategoryChip name={category} size="sm" />
                <Link href={`/article/${data?.slug || ''}`}>
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
                </Link>
                {kicker && (
                    <p
                        className="mr"
                        style={{ margin: 0, fontSize: 13, color: 'var(--text-tertiary)' }}
                    >
                        {kicker}
                    </p>
                )}
                <Meta data={data} />
            </div>
        </article>
    )
}