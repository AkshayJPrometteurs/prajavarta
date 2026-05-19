"use client"

import { useEffect, useState, memo } from "react"
import MainLayout from "@/layout/MainLayout"
import CategoryUnderline from "@/components/ui/CategoryUnderline"
import axiosInstance from "@/lib/axios"
import { useSearchParams, useRouter } from "next/navigation"
import { getShortName } from "@/lib/helper"
import Link from "next/link"
import { useReduxAuth } from "@/hooks/useReduxAuth"

const RelatedAuthors = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { isAuthenticated } = useReduxAuth()
    const authorName = searchParams.get('authorName')

    const [authors, setAuthors] = useState([])
    const [currentAuthor, setCurrentAuthor] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({})
    const [followLoading, setFollowLoading] = useState({})

    const fetchAuthors = async (page = 1) => {
        try {
            setLoading(true)
            const response = await axiosInstance.get('/related-authors', {
                params: {
                    authorName: authorName || undefined,
                    page,
                    limit: 24
                }
            })

            if (response.data.success) {
                const { currentAuthor, authors, pagination } = response.data.data
                setCurrentAuthor(currentAuthor)
                setAuthors(authors || [])
                setPagination(pagination || {})
            }
        } catch (error) {
            console.error('Error fetching authors:', error)
        } finally {
            setLoading(false)
            if (page > 1) window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [authorName])

    useEffect(() => {
        fetchAuthors(currentPage)
    }, [authorName, currentPage])

    const handleFollow = async (authorId) => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }

        try {
            setFollowLoading((prev) => ({ ...prev, [authorId]: true }))
            const response = await axiosInstance.post('/news/author/follow', { authorId })
            if (response.data.success) {
                setAuthors((prev) => prev.map((author) => (
                    author.id === authorId ? { ...author, isFollowing: response.data.following } : author
                )))
            }
        } catch (error) {
            console.error('Error following/unfollowing author:', error)
        } finally {
            setFollowLoading((prev) => ({ ...prev, [authorId]: false }))
        }
    }

    const label = currentAuthor
        ? `Related authors for ${currentAuthor.name}`
        : authorName
            ? `All authors` 
            : 'All authors'

    const description = currentAuthor
        ? `येथे ${currentAuthor.name} शी संबंधित लेखकांची यादी आहे.`
        : authorName
            ? `Search term '${authorName}' did not match an author. Showing all active authors.`
            : 'सर्व सक्रिय लेखक येथे उपलब्ध आहेत.'

    return (
        <MainLayout isBannerAdvertisement>
            <div className="mb-8">
                <CategoryUnderline
                    name="Authors"
                    label={label}
                    viewAll={false}
                />
                <p className="text-gray-600 mt-2">{description}</p>
            </div>

            {loading && !authors.length ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            ) : authors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {authors.map((author) => (
                        <div
                            key={author.id}
                            className="group block rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <Link href={`/author/${author.nameEnglish || author.name}`} className="block">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-(--brand-primary-light) text-3xl font-bold text-(--brand-primary)">
                                        {author.image ? (
                                            <img src={author.image} alt={author.name} className="h-full w-full rounded-3xl object-cover" />
                                        ) : (
                                            <span>{getShortName(author.name)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-(--text-primary) group-hover:text-(--brand-primary)">{author.name}</h2>
                                        <p className="text-sm text-(--text-tertiary)">{author.role || 'Author'}</p>
                                    </div>
                                </div>
                            </Link>

                            {author.bio && (
                                <p className="mb-4 text-sm leading-6 text-(--text-secondary)">{author.bio.length > 120 ? `${author.bio.slice(0, 120)}...` : author.bio}</p>
                            )}

                            <div className="flex flex-wrap gap-2 items-center justify-between">
                                <div className="flex flex-wrap gap-2 text-xs text-(--text-tertiary)">
                                    {author.designation && <span className="rounded-full bg-gray-100 px-3 py-1">{author.designation}</span>}
                                    {author.experience && <span className="rounded-full bg-gray-100 px-3 py-1">{author.experience} अनुभव</span>}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleFollow(author.id)}
                                    disabled={followLoading[author.id]}
                                    className={`text-[12px] font-semibold rounded-full px-4 py-2 transition ${author.isFollowing ? 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200' : 'bg-(--brand-primary) text-white hover:opacity-90'}`}
                                >
                                    {followLoading[author.id]
                                        ? 'Loading...'
                                        : author.isFollowing
                                            ? '✓ Following'
                                            : '+ Follow'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">कोणतीही लेखक माहिती सध्या उपलब्ध नाही.</p>
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                        <button
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="rounded-full px-3 py-1 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <span>{pagination.currentPage} / {pagination.totalPages}</span>
                        <button
                            disabled={currentPage >= pagination.totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                            className="rounded-full px-3 py-1 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}

export default memo(RelatedAuthors)
