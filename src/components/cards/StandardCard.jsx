import Link from "next/link"
import { memo } from "react"
import ImagePlaceholder from "../ImagePlaceholder"
import Badge from "../ui/Badge"
import CategoryChip from "../ui/CategoryChip"
import Meta from "../ui/Meta"
import useImageExists from "@/hooks/useImageExists"
import Image from "next/image"

const StandardCard = ({
    category,
    headline,
    layout = 'row',
    badge,
    imageUrl,
    data = null
}) => {
    const { exists } = useImageExists(imageUrl);
    return (
        <article className={`w-full md:w-auto ${layout === 'row' ? 'grid grid-cols-[96px_1fr] sm:grid-cols-[112px_1fr] gap-3 items-start' : ''}`}>
            <div className="relative">
                <Link href={`/article/${data?.slug}`}>
                    {exists ? (
                        <Image
                            src={imageUrl}
                            priority
                            width={600}
                            height={layout === 'row' ? 96 : 185}
                            alt={imageUrl}
                            style={{
                                width: "100%",
                                height: layout === 'row' ? 96 : 185,
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <ImagePlaceholder
                            ratio={layout === 'row' ? '1/1' : '16/9'}
                            label={layout === 'row' ? '240×240' : '600×338'}
                        />
                    )}

                    {badge && <Badge type={badge} />}
                </Link>
            </div>

            <div className="pt-2">
                {category.length > 0 && (
                    <Link href={`/category/${category}`}>
                        <CategoryChip name={category} />
                    </Link>
                )}

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