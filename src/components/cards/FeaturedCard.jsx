import Badge from "../ui/Badge";
import CategoryChip from "../ui/CategoryChip";
import Meta from "../ui/Meta";
import Link from "next/link";
import CustomImage from "../ui/CustomImage";
import { getCategoryNamesEnglish } from "@/lib/helper";
import { useAuth } from "@/contexts/AuthContext";

export default function FeaturedCard({ category, headline, kicker, badge, data = null }) {
    const { categories } = useAuth();
    return (
        <article>
            <div style={{ position: 'relative' }}>
                <CustomImage
                    src={data.featuredImage}
                    alt={headline}
                    width={800}
                    height={185}
                    style={{ width: '100%', height: '185px', objectFit: 'cover', borderRadius: 4 }}
                />
                {badge && <Badge type={badge} />}
            </div>
            <div style={{ paddingTop: 10 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    {data?.categoryIds ? (
                        String(data.categoryIds).split(',').map((idStr, idx) => {
                            const id = parseInt(idStr.trim());
                            const cat = categories.find(c => c.id === id);
                            if (!cat) return null;
                            return (
                                <Link key={idx} href={`/category/${cat.nameEnglish}`}>
                                    <CategoryChip name={cat.name} size="sm" />
                                </Link>
                            );
                        })
                    ) : (
                        <CategoryChip name={category} size="sm" />
                    )}
                </div>
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