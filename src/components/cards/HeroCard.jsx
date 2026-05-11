import { memo } from 'react'
import CategoryChip from '@/components/ui/CategoryChip'
import Meta from '@/components/ui/Meta'
import ImagePlaceholder from '../ImagePlaceholder'
import Link from 'next/link'

const HeroCard = ({ category, headline, subtitle, redirectUrl = "" }) => {
    return (
        <article>
            <Link href={redirectUrl}>
                <ImagePlaceholder
                    ratio="16/9"
                    label="hero image · 1200×675"
                />
            </Link>
            
            <div className="hero-card-body">
                <Link href={`/category/${category}`}>
                    <CategoryChip name={category} />
                </Link>

                <Link href={redirectUrl}>
                    <h2 className="hero-card-headline">{headline}</h2>
                </Link>

                <Link href={redirectUrl}>
                    <p className="hero-card-subtitle">{subtitle}</p>
                </Link>

                <Meta
                    author="संपादकीय टीम"
                    minutes={4}
                />
            </div>
        </article>
    )
}

export default memo(HeroCard)