"use client"

import { memo, useEffect, useState } from "react"
import MainLayout from "@/layout/MainLayout"
import Ad from "@/components/Ad"
import { useScreenSize } from "@/hooks/useScreenSize"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import StandardCard from "@/components/cards/StandardCard"
import TrendingModule from "./HomePageSections/TrendingModule"
import HeroCard from "@/components/cards/HeroCard"
import { catColor } from "@/lib/catColors"
import { useParams } from "next/navigation"
import Newsletter from "@/components/Newsletter"
import TagSidebar from "./Sidebars/TagSidebar"
import Link from "next/link"
import SectionLayout from "@/layout/SectionLayout"
import axiosInstance from "@/lib/axios"

const Tags = () => {
    const { screenWidth } = useScreenSize()
    const params = useParams()
    const [tagData, setTagData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const slugArray = Array.isArray(params?.slug)
        ? params.slug
        : []

    const currentTag = decodeURIComponent(slugArray[0] || '')

    useEffect(() => {
        if (!currentTag) {
            setError('टॅग आवश्यक आहे.')
            setLoading(false)
            return
        }

        const fetchTagData = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get(`/tag/${encodeURIComponent(currentTag)}`)
                if (response.data.success) {
                    setTagData(response.data.data)
                    setError(null)
                } else {
                    setError(response.data.error || 'डेटा सापडला नाही')
                }
            } catch (err) {
                console.error('Error fetching tag data:', err)
                setError('टॅग डेटा लोड करण्यात अडचण आली आहे.')
            } finally {
                setLoading(false)
            }
        }

        fetchTagData()
    }, [currentTag])

    const TAG = tagData?.meta?.tag || currentTag

    const updatedDate =
        tagData?.meta?.lastUpdated
            ? new Date(
                tagData.meta.lastUpdated
            ).toLocaleDateString(
                'mr-IN',
                { day: 'numeric', month: 'long', year: 'numeric' }
            )
            : ''
    
    const hero = tagData?.hero || null
    const latestNews = tagData?.latestNews || []

    // Trending section uses mostRead
    const mostReadNews = tagData?.mostRead || []
    const relatedTags = tagData?.relatedTags || []

    if (loading) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="flex items-center justify-center py-20 min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
                </div>
            </MainLayout>
        )
    }

    if (error || !tagData) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="text-center py-20 min-h-[60vh]">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {error || 'टॅग सापडला नाही'}
                    </h2>

                    <Link
                        href="/"
                        className="text-orange-600 font-semibold hover:underline"
                    >
                        मुख्यपृष्ठावर परत जा
                    </Link>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout isBannerAdvertisement>
            <div>
                {/* Header */}

                <div
                    className="pb-6 mb-8 border-b-4"
                    style={{ borderColor: catColor(TAG) }}
                >
                    <div className="mr text-[11px] font-bold tracking-[0.08em] uppercase mb-2">
                        विषय
                    </div>

                    <h1 className="mr mb-3 text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                        #{TAG}
                    </h1>

                    <p className="mr m-0 text-[clamp(13px,1.2vw,16px)] leading-[1.6]">
                        #{TAG} विषयाशी संबंधित सर्व बातम्या, विश्लेषण आणि अद्यतने एकाच ठिकाणी.
                    </p>

                    <div className="flex gap-3 mt-3.5 text-[13px]">
                        <span className="mr">
                            { tagData?.meta ?.totalNews }{" "}
                            बातम्या
                        </span>

                        <span>·</span>

                        <span className="mr">
                            {updatedDate
                                ? `अद्यतनित: ${updatedDate}`
                                : 'अद्यतनित माहिती उपलब्ध नाही'}
                        </span>
                    </div>
                </div>

                <SectionLayout
                    sidebar={
                        <TagSidebar
                            tag={TAG}
                            mostRead={mostReadNews}
                            latestNews={latestNews}
                        />
                    }
                >
                {/* HERO */}

                {hero && (
                    <HeroCard
                        headline={hero?.title || ''}
                        subtitle={hero?.summary || ''}
                        redirectUrl={hero?.slug ? `/article/${hero.slug}` : '/'}
                        advertisementImage={hero?.featuredImage || ''}
                        data={hero}
                    />
                )}

                {/* Latest News */}

                <div className="mt-5">
                    <CategoryUnderline
                        name={TAG}
                        label="ताज्या बातम्या"
                        viewAll={false}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {latestNews.map(
                            (news, i) => (
                                <StandardCard
                                    key={news.id || i}
                                    headline={news?.title}
                                    layout="col"
                                    imageUrl={news?.featuredImage}
                                    data={news}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Ad */}

                <Ad
                    id={screenWidth <= 768 ? "C1" : "DC3"}
                    name={screenWidth <= 768 ? "Mobile Tag Below Hero" : "Desktop Tag Between Modules"}
                    size={screenWidth <= 768 ? "300×250" : "728×90"}
                    width={screenWidth <= 768 ? 300 : 728}
                    height={screenWidth <= 768 ? 250 : 90}
                    fluid={screenWidth <= 768}
                    className={`mx-auto ${screenWidth <= 768 ? "inline-block" : ""}`}
                />

                {/* Most Read / Trending */}

                {mostReadNews.length >
                    0 && (
                        <div className="bg-(--surface-secondary) p-6">
                            <TrendingModule
                                label={`${TAG}-मधील सर्वाधिक वाचलेले`}
                                items={mostReadNews}
                                url={`/most-read`}
                            />
                        </div>
                    )}

                {/* Related Tags */}

                {relatedTags.length >
                    0 && (
                        <div>
                            <div className="mr text-[13px] font-bold tracking-[0.06em] uppercase mb-3">
                                संबंधित विषय
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {relatedTags.map(
                                    tag => (
                                        <Link
                                            key={tag}
                                            href={`/tag/${encodeURIComponent(tag)}`}
                                            className="mr px-3.5 py-2 bg-(--brand-primary-light) text-[13px] font-semibold rounded-full cursor-pointer"
                                        >
                                            #{tag}
                                        </Link>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                <Newsletter />

                {/* Mobile Ad */}

                {screenWidth <= 768 && (
                    <Ad
                        id="C3"
                        name="Mobile Tag Before Footer"
                        size="Multiplex / Native"
                        height={300}
                        fluid
                    />
                )}
            </SectionLayout>
        </div>
        </MainLayout >
    )
}

export default memo(Tags)