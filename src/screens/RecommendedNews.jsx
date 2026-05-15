"use client"

import { useEffect, useState, memo } from "react"
import MainLayout from "@/layout/MainLayout"
import SectionLayout from "@/layout/SectionLayout"
import StandardCard from "@/components/cards/StandardCard"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import { useSearchParams } from "next/navigation"
import axiosInstance from "@/lib/axios"
import { getCategoryNames, getCategoryNamesEnglish, slugToMarathi } from "@/lib/helper"
import { useAuth } from "@/contexts/AuthContext"
import Pagination from "@/components/ui/Pagination"

const RecommendedNews = () => {
    const { categories } = useAuth();
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category');
    const categoryName = slugToMarathi(categorySlug);

    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/news/recommended', {
                params: { category: categorySlug, page, limit: 12 }
            });
            if (response.data.success) {
                setNews(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching recommended news:", error);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [categorySlug, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <MainLayout isBannerAdvertisement>
            <div className="mb-8">
                <CategoryUnderline
                    name="Recommended"
                    label={categoryName ? `${categoryName} - तुमच्यासाठी शिफारस` : "तुमच्यासाठी शिफारस केलेल्या बातम्या"}
                />
                <p className="text-gray-600 mt-2">
                    {categoryName
                        ? `${categoryName} विभागातील तुमच्या आवडीच्या आणि महत्त्वाच्या बातम्या.`
                        : "तुमच्या आवडीनुसार आणि सध्याच्या महत्त्वाच्या घडामोडींच्या आधारे निवडलेल्या विशेष बातम्या."
                    }
                </p>
            </div>

            {loading && !news.length ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : news.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {news.map((item) => (
                            <StandardCard
                                key={item.id}
                                layout="col"
                                category={getCategoryNames(item.categoryIds, categories)}
                                categoryNameEnglish={getCategoryNamesEnglish(item.categoryIds, categories)}
                                headline={item.title}
                                imageUrl={item.featuredImage}
                                data={item}
                            />
                        ))}
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
                    <p className="text-gray-500">सध्या कोणतीही बातमी उपलब्ध नाही.</p>
                </div>
            )}
        </MainLayout>
    );
};

export default memo(RecommendedNews);
