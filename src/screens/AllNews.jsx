"use client"

import { useEffect, useState, memo } from "react"
import MainLayout from "@/layout/MainLayout"
import StandardCard from "@/components/cards/StandardCard"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import axiosInstance from "@/lib/axios"
import { useAuth } from "@/contexts/AuthContext"
import Pagination from "@/components/ui/Pagination"

const AllNews = () => {
    const { categories } = useAuth()
    const [news, setNews] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchAllNews = async (page = 1) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/news/all', {
                params: { page, limit: 12 }
            })
            if (response.data.success) {
                setNews(response.data.data)
                setPagination(response.data.pagination)
            }
        } catch (error) {
            console.error("Error fetching all news:", error)
        } finally {
            setLoading(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        fetchAllNews(currentPage)
    }, [currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    return (
        <MainLayout isBannerAdvertisement>
            <div className="mb-8">
                <CategoryUnderline
                    name="All"
                    label="सर्व बातम्या"
                    viewAll={false}
                />
                <p className="text-gray-600 mt-2">
                    महाराष्ट्रातील सर्वात ताज्या आणि महत्वाच्या बातम्या.
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
                                headline={item.title}
                                imageUrl={item.featuredImage}
                                data={item}
                            />
                        ))}
                    </div>

                    {pagination.totalPages > 1 && (
                        <div className="mt-12">
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500">कोणतीही बातमी सापडली नाही</p>
                </div>
            )}
        </MainLayout>
    )
}

export default memo(AllNews)