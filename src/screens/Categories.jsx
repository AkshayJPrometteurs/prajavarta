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
import CategoriesSidebar from "./Sidebars/CategoriesSidebar"
import { useParams } from "next/navigation"
import { convertToMarathiNumber, formatMarathiDateFull } from "@/lib/helper"
import axiosInstance from "@/lib/axios"
import SectionLayout from "@/layout/SectionLayout"
import Link from "next/link"

const Categories = () => {
    const { screenWidth } = useScreenSize();
    const { slug } = useParams();
    const CAT = decodeURIComponent(slug);
    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCategoryData = async () => {
        if (!slug) return;
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/category/${slug}`);
            if (response?.data?.success) {
                setCategoryData(response?.data?.data);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { getCategoryData() }, [slug]);

    if (loading) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const LATEST = categoryData?.latest_news || [];
    const MOST_READ = categoryData?.most_read_news || [];
    const SUBCITIES = categoryData?.location_news || [];
    const EVERGREEN = categoryData?.evergreen_news || [];
    const RELATED_TAGS = categoryData?.related_tags || [];
    const TRENDING_CAT = categoryData?.trending_news || [];
    const stats = categoryData?.stats || {};

    const hasNoNews = LATEST.length === 0 &&
        MOST_READ.length === 0 &&
        SUBCITIES.length === 0 &&
        EVERGREEN.length === 0 &&
        TRENDING_CAT.length === 0;

    if (!categoryData || hasNoNews) {
        return (
            <MainLayout isBannerAdvertisement>
                <div className="flex items-center justify-center py-20 min-h-[60vh]">
                    <div className="text-center py-20 bg-gray-50 rounded-lg w-full max-w-2xl mx-auto px-4">
                        <p className="text-gray-500 text-lg">या श्रेणीसाठी सध्या कोणतीही बातमी उपलब्ध नाही.</p>
                        <Link href="/" className="mt-4 inline-block text-orange-600 font-semibold hover:underline">
                            मुख्यपृष्ठावर जा
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout isBannerAdvertisement>
            {/* Category header — full width */}
            <div style={{ borderBottom: `4px solid ${catColor(CAT)}`, paddingBottom: 24, marginBottom: 32 }}>
                <h1 className="mr mb-3 text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                    {categoryData?.category?.name}
                </h1>

                <p className="mr m-0 text-[clamp(14px,1.2vw,17px)] leading-[1.6]">
                    राजकारण, समाज, अर्थकारण, संस्कृती आणि शहर-ग्रामीण घडामोडी. राज्याच्या प्रत्येक कोपऱ्यातील विश्वासार्ह बातम्या.
                </p>

                <div className="flex gap-3.5 mt-3.5 text-[13px] text-(--text-tertiary)">
                    <span className="mr">{convertToMarathiNumber(stats.total_news) || 0} बातम्या</span>
                    <span>·</span>
                    <span className="mr">
                        {stats.last_updated
                            ? formatMarathiDateFull(stats.last_updated)
                            : 'अद्यतनित नाही'
                        }
                    </span>
                </div>
            </div>

            <SectionLayout sidebar={
                <CategoriesSidebar
                    cat={categoryData?.category?.name}
                    categoryId={categoryData?.category?.id}
                    categorySlug={categoryData?.category?.slug}
                    mostRead={MOST_READ}
                    recentlyUpdated={LATEST.slice(0, 5)}
                />
            }>
                {LATEST.length > 0 && (
                    <HeroCard
                        headline={LATEST[0]?.title || "No news available"}
                        subtitle={LATEST[0]?.summary}
                        redirectUrl={`/article/${LATEST[0]?.slug}`}
                        advertisementImage={LATEST[0]?.featuredImage}
                        data={LATEST[0]}
                    />
                )}

                {/* Latest feed */}
                {LATEST.length > 1 && (
                    <div className="mt-5">
                        <CategoryUnderline name={CAT} label="ताज्या बातम्या" url={`/latest-news/?category=${slug}`} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {LATEST.slice(1).map((news, i) => (
                                <StandardCard
                                    key={news.id}
                                    headline={news.title}
                                    layout="col"
                                    imageUrl={news.featuredImage}
                                    data={news}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <Ad
                    id="DH3"
                    name={screenWidth >= 1200 ? "Desktop Between Categories" : "Mobile Homepage Below-Header"}
                    size={screenWidth >= 1200 ? "728×90" : "300×250"}
                    width={screenWidth >= 1200 ? 728 : '100%'}
                    height={screenWidth >= 1200 ? 90 : 250}
                    className="flex items-center flex-col mx-auto"
                />

                {/* Trending */}
                {TRENDING_CAT.length > 0 && (
                    <div className="mt-5">
                        <TrendingModule
                            label={`${categoryData?.category?.name} - मधील ट्रेंडिंग`}
                            items={TRENDING_CAT}
                            url={`/trending?categoryId=${categoryData?.category?.id}&categoryName=${categoryData?.category?.name}`}
                        />
                    </div>
                )}

                {/* Mobile most-read */}
                {screenWidth <= 768 && MOST_READ.length > 0 && (
                    <div className="mt-5">
                        <CategoryUnderline name={categoryData?.category?.name} label="सर्वाधिक वाचलेले" />
                        <ul className="list-none m-0 p-0">
                            {MOST_READ.map((news, i) => (
                                <li key={news.id} className="mr text-sm py-3.5 border-b border-(--border-default) font-medium">
                                    <Link href={`/article/${news.slug}`} className="hover:text-orange-600">
                                        {news.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Mobile ad */}
                {screenWidth <= 768 && (
                    <Ad
                        id="C2"
                        name="Mobile Category Between Grids"
                        size="300×250 / Native"
                        height={250}
                        fluid
                        className="my-5"
                    />
                )}

                {/* Desktop subcategories */}
                {screenWidth >= 768 && SUBCITIES.length > 0 && (
                    <div className="mt-5">
                        <CategoryUnderline
                            name={CAT}
                            label="शहरांनुसार बातम्या"
                            url="/city-wise-news"
                        />
                        <div className="grid grid-cols-3 gap-6">
                            {SUBCITIES.map((news) => (
                                <div key={news.id}>
                                    <div
                                        className="mr text-[13px] font-bold mb-2.5 tracking-[0.04em]"
                                        style={{ color: catColor(CAT) }}
                                    >
                                        {news.district?.name || 'शहर'}
                                    </div>
                                    <StandardCard
                                        layout="col"
                                        headline={news.title}
                                        imageUrl={news.featuredImage}
                                        data={news}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mobile subcategories */}
                {screenWidth <= 768 && categoryData?.subdivisions?.length > 0 && (
                    <div className="mt-5">
                        <CategoryUnderline name={categoryData?.category?.name} label="उप-विभाग" />
                        <div className="grid grid-cols-3 gap-3">
                            {categoryData.subdivisions.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/subdivision/${sub.nameEnglish}`}
                                    className="mr block px-3 py-3.5 border border-(--border-default) text-[13px] font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    {sub.name} →
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Evergreen */}
                {EVERGREEN.length > 0 && (
                    <div className="mt-5">
                        <CategoryUnderline 
                            name={CAT} 
                            label="विशेष वाचा" 
                            url={categoryData?.category?.slug ? `/evergreen?category=${categoryData.category.slug}` : "/evergreen"}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {EVERGREEN.map((news, i) => (
                                <StandardCard
                                    key={news.id}
                                    layout="col"
                                    headline={news.title}
                                    imageUrl={news.featuredImage}
                                    data={news}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Related tags */}
                {RELATED_TAGS.length > 0 && (
                    <div className="mt-5">
                        <div className="mr text-[13px] font-bold tracking-[0.06em] uppercase mb-3.5">
                            संबंधित विषय · TOPIC CLUSTER
                        </div>

                        <div className="flex flex-wrap gap-2.5">
                            {RELATED_TAGS.map((t) => (
                                <Link
                                    key={t}
                                    href={`/tag/${CAT}/${t}`}
                                    className="mr px-3.5 py-2 bg-(--brand-primary-light) text-sm font-semibold rounded-full cursor-pointer"
                                >
                                    #{t}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mobile ad */}
                {screenWidth <= 768 && (
                    <Ad
                        id="C3"
                        name="Mobile Category Before Footer"
                        size="Multiplex / Native"
                        height={300}
                        fluid
                        className="mt-5"
                    />
                )}
            </SectionLayout>
        </MainLayout>
    )
}

export default memo(Categories)