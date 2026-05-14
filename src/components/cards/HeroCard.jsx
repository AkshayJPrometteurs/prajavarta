import { memo } from 'react'
import CategoryChip from '@/components/ui/CategoryChip'
import Meta from '@/components/ui/Meta'
import ImagePlaceholder from '../ImagePlaceholder'
import Link from 'next/link'
import useImageExists from '@/hooks/useImageExists'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

const HeroCard = ({
    category,
    headline,
    subtitle,
    redirectUrl = "",
    advertisementImage = "",
    data = null
}) => {
    const { exists } = useImageExists(advertisementImage);
    const { categories } = useAuth();
    return (
        <article>
            <Link href={redirectUrl}>
                {exists ? (
                    <Image
                        src={advertisementImage}
                        priority
                        width={600}
                        height={500}
                        alt={advertisementImage}
                        style={{
                            width: "100%",
                            height: "500px",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <ImagePlaceholder ratio="16/9" label="hero image · 1200×675" />
                )}
            </Link>

            <div className="hero-card-body">
                {category.length > 0 && (
                    <Link href={`/category/${category}`}>
                        <CategoryChip name={category} />
                    </Link>
                )}

                <Link href={redirectUrl}>
                    <h2 className="hero-card-headline">{headline}</h2>
                </Link>

                <Link href={redirectUrl}>
                    {/* <p className="hero-card-subtitle">{subtitle}</p> */}
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