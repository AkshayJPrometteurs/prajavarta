import Link from "next/link"
import { memo } from "react"
import ImagePlaceholder from "../ImagePlaceholder"
import Badge from "../ui/Badge"
import CategoryChip from "../ui/CategoryChip"
import Meta from "../ui/Meta"
import CustomImage from "../ui/CustomImage"

import { useAuth } from "@/contexts/AuthContext"
import { getCategoryNames, getCategoryNamesEnglish } from "@/lib/helper"

const StandardCard = ({
    category,
    categoryNameEnglish = "",
    headline,
    layout = 'row',
    badge,
    imageUrl,
    data = null
}) => {
    const { categories } = useAuth();
    return (
        <article className={`w-full md:w-auto ${layout === 'row' ? 'grid grid-cols-[96px_1fr] sm:grid-cols-[112px_1fr] gap-3 items-start' : ''}`}>
            <div className="relative">
                <Link href={`/article/${data?.slug}`}>
                    <CustomImage
                        src={imageUrl}
                        width={600}
                        height={layout === 'row' ? 96 : 185}
                        alt={headline}
                        className="w-full"
                        style={{
                            height: layout === 'row' ? 96 : 185,
                        }}
                    />

                    {badge && <Badge type={badge} />}
                </Link>
            </div>

            <div className={layout === 'row' ? 'pt-0' : 'pt-2.5'}>
                <div className="flex flex-wrap gap-2">
                    {data?.categoryIds &&
                        String(data.categoryIds)
                            .split(',')
                            .map((id) => id.trim())
                            .filter(Boolean)
                            .map((id) => {
                                const categoryName = getCategoryNames(id, categories)
                                const categoryEnglishName = getCategoryNamesEnglish(id, categories);

                                // Skip if category not found
                                if (!categoryName || !categoryEnglishName) {
                                    return null
                                }

                                return (
                                    <CategoryChip
                                        key={id}
                                        name={categoryName}
                                        url={`/category/${categoryEnglishName}`}
                                    />
                                )
                            }
                        )
                    }
                </div>

                <Link href={`/article/${data?.slug}`}>
                    <h4 className="mr mt-1.5 mb-1 font-semibold">
                        {headline}
                    </h4>
                </Link>
                <Meta compact data={data} />
            </div>
        </article>
    )
}

export default memo(StandardCard)