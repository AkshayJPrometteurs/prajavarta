import { memo } from 'react'
import CategoryChip from '@/components/ui/CategoryChip'
import Meta from '@/components/ui/Meta'
import Link from 'next/link'
import CustomImage from '@/components/ui/CustomImage'

const HeroCard = ({
    category,
    headline,
    subtitle,
    redirectUrl = "",
    advertisementImage = "",
    data = null,
    categoryNameEnglish = ""
}) => {
    return (
        <article>
            <Link href={redirectUrl}>
                <CustomImage
                    src={advertisementImage}
                    priority
                    width={1200}
                    height={675}
                    alt={headline}
                    className="w-full"
                    style={{
                        height: "500px",
                    }}
                />
            </Link>

            <div className="hero-card-body">
                {category.length > 0 && (
                    <Link href={`/category/${categoryNameEnglish}`}>
                        <CategoryChip name={category} />
                    </Link>
                )}

                <Link href={redirectUrl}>
                    <h2 className="hero-card-headline">{headline}</h2>
                </Link>

                <Link href={redirectUrl}>
                    <div dangerouslySetInnerHTML={{ __html: subtitle }} />
                </Link>

                <Meta
                    author="संपादकीय टीम"
                    data={data}
                />
            </div>
        </article>
    )
}

export default memo(HeroCard)