import CategoryChip from '@/components/ui/CategoryChip'
import Meta from '@/components/ui/Meta'
import ImagePlaceholder from '../ImagePlaceholder'
import Link from 'next/link'

export default function HeroCard({ category, headline, subtitle, redirectUrl = "" }) {
    return (
        <Link href={redirectUrl}>
            <article>
                <ImagePlaceholder ratio="16/9" label="hero image · 1200×675" />
                <div className="hero-card-body">
                    <CategoryChip name={category} />
                    <h2 className="hero-card-headline">{headline}</h2>
                    {subtitle && (
                        <p className="hero-card-subtitle">{subtitle}</p>
                    )}
                    <Meta author="संपादकीय टीम" minutes={4} />
                </div>
            </article>
        </Link>
    )
}