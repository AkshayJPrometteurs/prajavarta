"use client"

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Edit2, Eye, Plus, Search, Trash2, X } from 'lucide-react'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import Pagination from '@/components/ui/Pagination'
import axiosInstance from '@/lib/axios'
import useDebounce from '@/hooks/useDebounce'
import { useReduxAuth } from '@/hooks/useReduxAuth'

export default function NewsListingScreen() {
    const { user } = useReduxAuth()

    let tabs = [];

    if (user?.role === 'ADMIN') {
        tabs = [
            { label: 'Admin News', value: 'ADMIN' },
            { label: 'Reporter News', value: 'REPORTER' },
            { label: 'Pending Reporter News', value: 'PENDING_REPORTER' }
        ];
    } else {
        tabs = [{ label: 'My News', value: 'REPORTER' }]
    }

    const [state, setState] = useState({
        news: [],
        categories: [],
        loading: true,
        searchTerm: '',
        categoryId: 'all',
        activeTab: 'ADMIN',
        selectedIds: [],
        bulkAction: '',
        page: 1,
        pageSize: 12,
        totalPages: 1,
        previewNews: null,
        deleteModal: { isOpen: false, type: null, id: null }
    })

    const updateState = (data) => {
        setState((prev) => ({ ...prev, ...data }))
    }

    const selectedSet = useMemo(() => new Set(state.selectedIds), [state.selectedIds])
    const allCurrentSelected = state.news.length > 0 && state.news.every((item) => selectedSet.has(item.id))

    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(
                '/admin/categories',
                { params: { limit: 1000, page: 1 } }
            )
            if (response.data.success) {
                updateState({ categories: response.data.data || [] })
            }
        } catch (error) {
            toast.error('Failed to load categories')
        }
    }

    const fetchNews = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(),
                limit: state.pageSize.toString(),
                ownerType: state.activeTab,
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                ...(state.categoryId !== 'all' && { categoryId: state.categoryId })
            })

            const endpoint = user?.role === 'ADMIN' ? '/admin/news' : '/author/news'

            const response = await axiosInstance.get(`${endpoint}?${params}`)

            if (response.data.success) {
                updateState({
                    news: response.data.data || [],
                    totalPages: response.data.pagination?.pages || 1,
                    selectedIds: []
                })
            }
        } catch (error) {
            toast.error('Failed to load news')
        } finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        updateState({ page: 1 })
    }, [debouncedSearchTerm])

    useEffect(() => {
        fetchNews()
    }, [state.page, debouncedSearchTerm, state.categoryId, state.activeTab])

    const toggleSelectAll = () => {
        updateState({
            selectedIds: allCurrentSelected ? [] : state.news.map((item) => item.id)
        })
    }

    const toggleSelect = (id) => {
        updateState({
            selectedIds: selectedSet.has(id)
                ? state.selectedIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedIds, id]
        })
    }

    const handleBulkAction = async () => {
        if (!state.bulkAction) {
            toast.error('Please select an action')
            return
        }

        if (state.selectedIds.length === 0) {
            toast.error('Please select news first')
            return
        }

        if (state.bulkAction === 'delete') {
            updateState({ deleteModal: { isOpen: true, type: 'bulk', id: null } })
            return
        }

        try {
            const endpoint = user?.role === 'ADMIN' ? '/admin/news' : '/author/news'
            const response = await axiosInstance.patch(endpoint, {
                ids: state.selectedIds,
                action: state.bulkAction
            })

            if (response.data.success) {
                toast.success('Selected news updated successfully')
                updateState({ bulkAction: '', selectedIds: [] })
                fetchNews()
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Bulk action failed')
        }
    }

    const handleToggleStatus = async (item) => {
        try {
            const endpoint = user?.role === 'ADMIN' ? '/admin/news' : '/author/news'
            const response = await axiosInstance.patch(endpoint, {
                ids: [item.id],
                isActive: !item.isActive
            })

            if (response.data.success) {
                toast.success(`News ${item.isActive ? 'disabled' : 'enabled'} successfully`)
                fetchNews()
            }
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const handleDelete = (id) => {
        updateState({ deleteModal: { isOpen: true, type: 'single', id } })
    }

    const confirmDelete = async () => {
        const { type, id } = state.deleteModal

        try {
            if (type === 'single') {
                const endpoint = user?.role === 'ADMIN' ? '/admin/news' : '/author/news'
                const response = await axiosInstance.delete(`${endpoint}?id=${id}`)
                if (response.data.success) {
                    toast.success('News deleted successfully')
                    fetchNews()
                }
            } else if (type === 'bulk') {
                const endpoint = user?.role === 'ADMIN' ? '/admin/news' : '/author/news'
                const response = await axiosInstance.patch(endpoint, {
                    ids: state.selectedIds,
                    action: 'delete'
                })
                if (response.data.success) {
                    toast.success('Selected news deleted successfully')
                    updateState({ bulkAction: '', selectedIds: [] })
                    fetchNews()
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete news')
        } finally {
            updateState({ deleteModal: { isOpen: false, type: null, id: null } })
        }
    }

    return (
        <AdminLayout>
            <div className="overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
                <div className="space-y-6 border-b border-base-200 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <h1 className="text-2xl font-bold text-base-content">Manage News</h1>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label className="input input-bordered flex items-center gap-2 rounded-full w-full sm:w-64">
                                <Search size={16} className="text-base-content/40" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={state.searchTerm}
                                    onChange={(e) => updateState({ searchTerm: e.target.value })}
                                    className="grow"
                                />
                            </label>
                            <Link
                                href={user?.role === 'ADMIN' ? '/admin/news/create' : '/author/news/create'}
                                className="btn btn-primary rounded-full gap-2"
                            >
                                <Plus size={18} />
                                Add News
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <select
                            value={state.categoryId}
                            onChange={(e) => updateState({ categoryId: e.target.value, page: 1 })}
                            className="select select-bordered w-full lg:max-w-xs"
                        >
                            <option value="all">सर्व श्रेणी</option>
                            {state.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex flex-wrap items-center gap-3">
                            {state.news.length > 0 && (
                                <label className="flex cursor-pointer items-center gap-2 mr-2">
                                    <input
                                        type="checkbox"
                                        checked={allCurrentSelected}
                                        onChange={toggleSelectAll}
                                        className="checkbox checkbox-primary checkbox-sm"
                                    />
                                    <span className="text-sm font-medium">Select All</span>
                                </label>
                            )}
                            <select
                                value={state.bulkAction}
                                onChange={(e) => updateState({ bulkAction: e.target.value })}
                                className="select select-bordered select-sm w-max"
                            >
                                <option value="">Bulk Action</option>
                                <option value="enable">Enable</option>
                                <option value="disable">Disable</option>
                                <option value="delete">Delete</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleBulkAction}
                                className="btn btn-sm btn-outline"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                <div role="tablist" className="tabs tabs-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            role="tab"
                            type="button"
                            onClick={() => updateState({ activeTab: tab.value, page: 1 })}
                            className={`tab ${state.activeTab === tab.value ? 'tab-active font-semibold' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-0">
                    {state.loading ? (
                        <div className="py-20 text-center text-base-content/50"><span className="loading loading-spinner loading-lg"></span></div>
                    ) : state.news.length === 0 ? (
                        <div className="m-5 flex h-80 items-center justify-center rounded-lg border border-dashed border-base-300 bg-base-50 text-center">
                            <div>
                                <p className="text-lg font-semibold text-base-content/70">No news found</p>
                                <p className="mt-1 text-sm text-base-content/50">Create your first news item</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                                {state.news.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group relative flex aspect-video flex-col overflow-hidden rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-lg bg-base-200"
                                    >
                                        {/* Background Image */}
                                        {item.featuredImage ? (
                                            <img
                                                src={item.featuredImage}
                                                alt={item.title}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400">
                                                No Image
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/40"></div>

                                        {/* Top Left: Category */}
                                        <div className="absolute left-3 top-3 flex flex-wrap gap-2 max-w-[80%]">
                                            {item.categoryIds ? (
                                                item.categoryIds
                                                    .split(',')
                                                    .map((id) => {
                                                        const category = state.categories.find(
                                                            (cat) => cat.id === Number(id.trim())
                                                        )

                                                        if (!category) return null

                                                        return (
                                                            <span
                                                                key={id}
                                                                className="badge badge-primary badge-sm text-white"
                                                            >
                                                                {category.name}
                                                            </span>
                                                        )
                                                    })
                                            ) : (
                                                <span className="badge badge-neutral badge-sm">
                                                    Uncategorized
                                                </span>
                                            )}
                                        </div>

                                        {/* Top Right: Checkbox */}
                                        <div className="absolute right-3 top-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedSet.has(item.id)}
                                                onChange={() => toggleSelect(item.id)}
                                                className="checkbox checkbox-sm border-white/70 bg-black/20 checked:border-white checked:bg-white checked:text-[#1f4e78] hover:bg-white/40"
                                                style={{ '--chkbg': 'white', '--chkfg': '#1f4e78' }}
                                            />
                                        </div>

                                        {/* Bottom Content Area */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 pt-10">
                                            {/* Date and Title */}
                                            <div className="mb-2">
                                                <div className="text-xs font-medium text-white/80">
                                                    {new Date(item.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="truncate font-bold text-white drop-shadow-md">
                                                    {item.title}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="tooltip tooltip-top"
                                                        data-tip="Preview"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => updateState({ previewNews: item })}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110"
                                                        >
                                                            <Eye size={16} className="text-[#1f4e78]" />
                                                        </button>
                                                    </div>
                                                    <div
                                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm cursor-help transition-transform hover:scale-110 tooltip tooltip-top"
                                                        data-tip={`Views: ${item.viewCount || 0}`}
                                                    >
                                                        <BarChart3 size={16} className="text-[#1f4e78]" />
                                                    </div>
                                                    <div
                                                        className="tooltip tooltip-top"
                                                        data-tip="Edit"
                                                    >
                                                        <Link
                                                            href={user?.role === 'ADMIN' ? `/admin/news/${item.id}/edit` : `/author/news/${item.id}/edit`}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110"
                                                        >
                                                            <Edit2 size={16} className="text-[#1f4e78]" />
                                                        </Link>
                                                    </div>
                                                    <div
                                                        className="tooltip tooltip-top"
                                                        data-tip="Delete"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item.id)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110"
                                                        >
                                                            <Trash2 size={16} className="text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Toggle Switch */}
                                                <div>
                                                    <input
                                                        type="checkbox"
                                                        className="toggle"
                                                        checked={item.isActive}
                                                        onChange={() => handleToggleStatus(item)}
                                                        style={{
                                                            backgroundColor: item.isActive ? '#e11d48' : 'rgba(255,255,255,0.4)', // Rose color from image or translucent white
                                                            borderColor: 'transparent',
                                                            '--tglbg': 'white'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {state.totalPages > 1 && (
                        <div className="p-5 border-t border-base-200">
                            <Pagination
                                currentPage={state.page}
                                totalPages={state.totalPages}
                                onPageChange={(page) => updateState({ page })}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Modal (DaisyUI) */}
            <dialog
                ref={(el) => {
                    if (!el) return
                    if (state.previewNews) el.showModal()
                    else el.close()
                }}
                className="modal"
                onClose={() => updateState({ previewNews: null })}
            >
                <div className="modal-box w-11/12 max-w-3xl">
                    <div className="flex items-center justify-between border-b border-base-200 pb-4 mb-4">
                        <h3 className="text-lg font-semibold">News Preview</h3>
                        <button type="button" onClick={() => updateState({ previewNews: null })} className="btn btn-ghost btn-sm btn-circle">
                            <X size={22} />
                        </button>
                    </div>

                    {state.previewNews && (
                        <div className="space-y-4">
                            {state.previewNews.featuredImage && (
                                <img src={state.previewNews.featuredImage} alt={state.previewNews.title} className="max-h-80 w-full rounded-md object-cover" />
                            )}
                            <div>
                                <p className="text-sm font-medium text-primary">{state.previewNews.category?.name || state.previewNews.category?.nameEnglish || 'Uncategorized'}</p>
                                <h2 className="mt-1 text-2xl font-bold">{state.previewNews.title}</h2>
                            </div>
                            {state.previewNews.summary && (
                                <div>
                                    <h3 className="text-sm font-semibold">Summary</h3>
                                    <div
                                        className="mt-1 whitespace-pre-line text-sm text-base-content/70"
                                        dangerouslySetInnerHTML={{ __html: state.previewNews.summary }}
                                    />
                                </div>
                            )}
                            {state.previewNews.description && (
                                <div>
                                    <h3 className="text-sm font-semibold">Description</h3>
                                    <div
                                        className="mt-1 whitespace-pre-line text-sm text-base-content/70"
                                        dangerouslySetInnerHTML={{ __html: state.previewNews.description }}
                                    />
                                </div>
                            )}
                            <div className="grid gap-3 text-sm text-base-content/70 sm:grid-cols-2">
                                <p><span className="font-semibold">District:</span> {state.previewNews.district?.name || 'All'}</p>
                                <p><span className="font-semibold">Subdivision:</span> {state.previewNews.subdivision?.name || 'All'}</p>
                                <p><span className="font-semibold">Tehsil:</span> {state.previewNews.tehsil?.name || 'All'}</p>
                                <p><span className="font-semibold">Views:</span> {state.previewNews.viewCount || 0}</p>
                                <p><span className="font-semibold">Priority:</span> {state.previewNews.isBreakingNews ? 'Breaking' : state.previewNews.isTrendingNews ? 'Trending' : state.previewNews.isMiniTrendingNews ? 'Mini Trending' : 'Normal'}</p>
                                {state.previewNews.videoId && <p><span className="font-semibold">Video ID:</span> {state.previewNews.videoId}</p>}
                                {state.previewNews.videoUrl && <p className="truncate"><span className="font-semibold">Video URL:</span> {state.previewNews.videoUrl}</p>}
                            </div>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={() => updateState({ previewNews: null })}>close</button></form>
            </dialog>

            {/* Delete Confirmation Modal */}
            <dialog
                className={`modal ${state.deleteModal?.isOpen ? 'modal-open' : ''}`}
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
                    <p className="py-4 text-base-content/70">
                        Are you sure you want to delete {state.deleteModal?.type === 'bulk' ? 'the selected news' : 'this news item'}? This action cannot be undone.
                    </p>
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => updateState({ deleteModal: { isOpen: false, type: null, id: null } })}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-error text-white"
                            onClick={confirmDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => updateState({ deleteModal: { isOpen: false, type: null, id: null } })}>close</button>
                </form>
            </dialog>
        </AdminLayout>
    )
}
