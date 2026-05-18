"use client"

import { useEffect, useState, memo } from "react"
import MainLayout from "@/layout/MainLayout"
import StandardCard from "@/components/cards/StandardCard"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import axiosInstance from "@/lib/axios"
import { getCategoryNames, getCategoryNamesEnglish } from "@/lib/helper"
import { useAuth } from "@/contexts/AuthContext"
import Pagination from "@/components/ui/Pagination"

const DistrictNews = () => {
    const { categories } = useAuth();
    const [news, setNews] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/news/by-district', {
                params: { page, limit: 12 }
            });
            if (response.data.success) {
                setNews(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching district news:", error);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <MainLayout isBannerAdvertisement>
            <div className="mb-8">
                <CategoryUnderline
                    name="Cities"
                    label="शहरांनुसार बातम्या"
                    viewAll={false}
                />
                <p className="text-gray-600 mt-2">
                    महाराष्ट्रातील विविध शहरे आणि जिल्ह्यांतील ताज्या घडामोडी.
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
                            <div key={item.id}>
                                <div className="text-[13px] font-bold mb-2.5 tracking-[0.04em] text-orange-600">
                                    {item.district?.name || 'शहर'}
                                </div>
                                <StandardCard
                                    layout="col"
                                    headline={item.title}
                                    imageUrl={item.featuredImage}
                                    data={item}
                                />
                            </div>
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

export default memo(DistrictNews);
