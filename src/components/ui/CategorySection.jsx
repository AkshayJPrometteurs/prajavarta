import CategoryUnderline from "./CategoryUnderline";
import FeaturedCard from "../cards/FeaturedCard";
import StandardCard from "../cards/StandardCard";
import { useScreenSize } from "../../hooks/useScreenSize";

export default function CategorySection({ cat, hero, stories }) {
    const { screenWidth } = useScreenSize();
    return (
        <section style={{ padding: '8px 0 24px' }}>
            <CategoryUnderline name={cat} />
            {screenWidth < 992 ? (
                <>
                    {/* Mobile layout: featured + stacked list */}
                    <div>
                        <FeaturedCard category={cat} headline={hero} />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 14,
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: '1px solid var(--border-default)',
                            }}
                        >
                            {stories.map((s, i) => (
                                <StandardCard key={i} category={cat} headline={s} />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Desktop layout: 1.4fr + 1fr grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <FeaturedCard category={cat} headline={hero} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {stories.map((s, i) => (
                                <StandardCard
                                    key={i}
                                    category={cat}
                                    headline={s}
                                    layout="row"
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}