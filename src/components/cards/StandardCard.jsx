import Link from "next/link"
import { memo } from "react"
import ImagePlaceholder from "../ImagePlaceholder"
import Badge from "../ui/Badge"
import CategoryChip from "../ui/CategoryChip"
import Meta from "../ui/Meta"

const StandardCard = ({ category, headline, layout = 'row', badge }) => {
    return (
        <article className={`w-full md:w-auto ${layout === 'row' ? 'grid grid-cols-[96px_1fr] sm:grid-cols-[112px_1fr] gap-3 items-start' : ''}`}>
            <div className="relative">
                <Link href={`/article/${category}`}>
                    <ImagePlaceholder
                        ratio={layout === 'row' ? '1/1' : '16/9'}
                        label={layout === 'row' ? '240×240' : '600×338'}
                    />
                    {badge && <Badge type={badge} />}
                </Link>
            </div>

            <div className="pt-2">
                <Link href={`/category/${category}`}>
                    <CategoryChip name={category} size="sm" />
                </Link>

                <Link href={`/article/${category}`}>
                    <h4 className="mr mt-1.5 mb-1 font-semibold">
                        {headline}
                    </h4>
                </Link>
                <Meta minutes={3} compact />
            </div>
        </article>
    )
}

export default memo(StandardCard)