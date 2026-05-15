"use client"

import { useEffect, useState, memo } from "react"
import MainLayout from "@/layout/MainLayout"
import SectionLayout from "@/layout/SectionLayout"
import StandardCard from "@/components/cards/StandardCard"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import { useParams } from "next/navigation"
import axiosInstance from "@/lib/axios"
import { getCategoryNames, getCategoryNamesEnglish } from "@/lib/helper"
import Pagination from "@/components/ui/Pagination"
import Link from "next/link"
import CustomImage from "@/components/ui/CustomImage"
import CategoryChip from "@/components/ui/CategoryChip"
import Meta from "@/components/ui/Meta"
import { useAuth } from "@/contexts/AuthContext"

const SubdivisionNews = () => {
    const { categories } = useAuth();
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async (page = 1) => {
        if (!slug) return;
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/subdivision/${slug}`, {
                params: { page, limit: 12 }
            });
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching subdivision news:", error);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [slug, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading && !data) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            </MainLayout>
        );
    }

    const news = data?.news || [];
    const subdivision = data?.subdivision || {};
    const pagination = data?.pagination || {};

    return (
        <MainLayout isBannerAdvertisement>
            <div className="mb-8">
                <CategoryUnderline
                    name={subdivision.name}
                    label={`${subdivision.name} - बातम्या`}
                />
                <p className="text-gray-600 mt-2">
                    {subdivision.district?.name} जिल्हयातील {subdivision.name} उप-विभागातील ताज्या घडामोडी.
                </p>
            </div>

            {news.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {news.map((item) => {
                            return (
                                <div>
                                    <div className="relative">
                                        <Link href={`/article/${item?.slug}`}>
                                            <CustomImage
                                                src={item.featuredImage}
                                                width={600}
                                                height={200}
                                                alt={item.title}
                                                className="w-full"
                                                style={{
                                                    height: 200,
                                                    width: "100%",
                                                }}
                                            />
                                        </Link>
                                    </div>

                                    <div className="pt-2">
                                        {getCategoryNames(item.categoryIds, categories).length > 0 && (
                                            <Link href={`/category/${getCategoryNamesEnglish(item.categoryIds, categories)[0]}`}>
                                                <CategoryChip name={getCategoryNames(item.categoryIds, categories)[0]} />
                                            </Link>
                                        )}

                                        <Link href={`/article/${item?.slug}`}>
                                            <h4 className="mr mt-1.5 mb-1 font-semibold">
                                                {item.title}
                                            </h4>
                                        </Link>
                                        <Meta compact data={item} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-12">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">या उप-विभागासाठी सध्या कोणतीही बातमी उपलब्ध नाही.</p>
                </div>
            )}
        </MainLayout>
    );
};

export default memo(SubdivisionNews);
