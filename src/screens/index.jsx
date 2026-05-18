"use client"
import { memo, useEffect, useState } from "react"
import Ad from "../components/Ad"
import SecondaryStories from "./HomePageSections/SecondaryStories"
import TrendingModule from "./HomePageSections/TrendingModule"
import RecommendedGrid from "./HomePageSections/RecommendedGrid"
import { useScreenSize } from "@/hooks/useScreenSize"
import CategorySection from "@/components/ui/CategorySection"
import MainLayout from "@/layout/MainLayout"
import MainPageSidebar from "./Sidebars/MainPageSidebar"
import SectionLayout from "@/layout/SectionLayout"
import HeroCard from "@/components/cards/HeroCard"
import axiosInstance from "@/lib/axios"
import StandardCard from "@/components/cards/StandardCard"
import { getCategoryNames, getCategoryNamesEnglish } from "@/lib/helper"
import { useAuth } from "@/contexts/AuthContext"

const MainPage = () => {
    const { categories } = useAuth();
    const { screenWidth } = useScreenSize();
    const [pageData, setPageData] = useState(null);
    const [categoriesWiseData, setCategoriesWiseData] = useState([])
    const [recommendedData, setRecommendedData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getMainPage = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/landing_page`);
            if (response?.data?.success) {
                setPageData(response?.data?.data || null);
                const categoriesData = response?.data?.data?.categories_wise_data || {}
                const formattedCategoriesData = Object.entries(categoriesData).map(([catName, newsItems]) => ({
                    cat: catName,
                    hero: newsItems[0] || {},
                    stories: newsItems.slice(1, 4).map((item) => ({
                        title: item.title || '',
                        categoryIds: item.categoryIds || '',
                        featuredImage: item.featuredImage || '',
                        slug: item.slug || '',
                        createdAt: item.createdAt || '',
                    }))
                }))
                setCategoriesWiseData(formattedCategoriesData)

                const recommendedSection = response?.data?.data?.recommended_news || []
                setRecommendedData(recommendedSection)
            }
        } catch (error) {
            console.error("Error fetching landing page:", error);
            setError("मुख्य पृष्ठ लोड करण्यात अडचण आली आहे.")
            return null;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { getMainPage() }, [])

    if (loading) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="flex items-center justify-center py-20 min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            </MainLayout>
        );
    }

    if (error || !pageData) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="text-center py-20 min-h-[60vh]">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "बातमी सापडली नाही."}</h2>
                    <Link href="/" className="text-orange-600 font-semibold hover:underline">
                        मुख्यपृष्ठावर परत जा
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout isBannerAdvertisement>
            <section>
                <SectionLayout
                    sidebar={
                        <MainPageSidebar data={pageData} />
                    }
                >
                    {/* Hero story */}
                    <HeroCard
                        headline={pageData?.one_latest_news[0]?.title}
                        subtitle={pageData?.one_latest_news[0]?.summary}
                        redirectUrl={`/article/${pageData?.one_latest_news?.[0]?.slug}`}
                        advertisementImage={pageData?.one_latest_news[0]?.featuredImage}
                        data={pageData?.one_latest_news[0]}
                    />

                    {/* <SecondaryStories data={pageData?.latest_news?.slice(1, 4)} /> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pageData?.latest_news?.map((content, index) => {
                            const isLast = index === pageData.latest_news.length - 1
                            return (
                                <div key={content?.id} className={isLast ? 'block md:hidden' : ''}>
                                    <StandardCard
                                        headline={content?.title}
                                        layout="col"
                                        imageUrl={content?.featuredImage}
                                        data={content}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    {screenWidth < 992 && (
                        <div className="flex justify-center">
                            <Ad
                                id="DH3"
                                name="Mobile Homepage Below-Header"
                                size="300×250"
                                width="100%"
                                height="250"
                                className="flex items-center flex-col"
                            />
                        </div>
                    )}

                    <TrendingModule items={pageData?.trending_news} isBgColor />

                    <div className="flex justify-center">
                        <Ad
                            id="DH3"
                            name={screenWidth >= 992 ? "Desktop Between Categories" : "Mobile Homepage Below-Header"}
                            size={screenWidth >= 992 ? "728×90" : "300×250"}
                            width={screenWidth >= 992 ? 728 : '100%'}
                            height={screenWidth >= 992 ? 90 : 250}
                            className="flex items-center flex-col"
                        />
                    </div>

                    {categoriesWiseData?.map((sec) => (
                        <CategorySection
                            key={sec.cat}
                            cat={sec.cat}
                            hero={sec.hero}
                            stories={sec.stories}
                        />
                    ))}

                    <RecommendedGrid items={recommendedData} />

                    {screenWidth < 992 && (
                        <Ad
                            id="H4"
                            name="Mobile Homepage Above Footer"
                            size="Multiplex / Native"
                            height={320}
                            fluid
                        />
                    )}
                </SectionLayout>

                {/* Before-footer ad */}
                <div className="mt-6">
                    <Ad id="DH4" name="Desktop Before Footer" size="Responsive Native" height={140} fluid />
                </div>
            </section>
        </MainLayout>
    )
}

export default memo(MainPage)