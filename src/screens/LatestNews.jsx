"use client"

import { useEffect, useState, memo } from "react"
import MainLayout from "@/layout/MainLayout"
import StandardCard from "@/components/cards/StandardCard"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import { useSearchParams } from "next/navigation"
import axiosInstance from "@/lib/axios"
import Pagination from "@/components/ui/Pagination"

const LatestNews = () => {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get('category') || ''

    const [news, setNews] = useState([])
    const [category, setCategory] = useState(null)
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchLatestNews = async (page = 1) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/news/latest', {
                params: { category: categorySlug, page, limit: 12 }
            })
            if (response.data.success) {
                setNews(response.data.data)
                setPagination(response.data.pagination)
                setCategory(response.data.category)
            }
        } catch (error) {
            console.error('Error fetching latest news:', error)
        } finally {
            setLoading(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [categorySlug])

    useEffect(() => {
        fetchLatestNews(currentPage)
    }, [categorySlug, currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const title = category ? `${category.name} - नवीनतम` : 'नवीनतम बातम्या'
    const description = category
        ? `${category.name} विभागातील ताज्या आणि नवीनतम बातम्या.`
        : 'संपूर्ण महाराष्ट्रातील नवीनतम आणि ताज्या बातम्या.'

    return (
        <MainLayout isBannerAdvertisement>
            <div className="mb-8">
                <CategoryUnderline
                    name="Latest"
                    label={title}
                    viewAll={false}
                />
                <p className="text-gray-600 mt-2">
                    {description}
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
                    <p className="text-gray-500">सध्या कोणतीही नवीनतम बातमी उपलब्ध नाही.</p>
                </div>
            )}
        </MainLayout>
    )
}

export default memo(LatestNews)
