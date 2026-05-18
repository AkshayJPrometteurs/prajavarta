import { memo } from 'react'
import CategoryChip from '@/components/ui/CategoryChip'
import Meta from '@/components/ui/Meta'
import Link from 'next/link'
import CustomImage from '@/components/ui/CustomImage'
import { useAuth } from '@/contexts/AuthContext'
import { getCategoryNames, getCategoryNamesEnglish } from '@/lib/helper'

const HeroCard = ({
    headline,
    subtitle,
    redirectUrl = "",
    advertisementImage = "",
    data = null
}) => {
    const { categories } = useAuth()
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
                    style={{ height: "500px" }}
                />
            </Link>

            <div className="hero-card-body">
                <div className='flex gap-2'>
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