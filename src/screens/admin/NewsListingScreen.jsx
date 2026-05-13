"use client"

import Link from 'next/link'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { BarChart3, Edit2, Eye, Plus, Search, Trash2, X } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import Pagination from '@/components/ui/Pagination'

const tabs = [
    { label: 'Admin News', value: 'ADMIN' },
    { label: 'Reporter News', value: 'REPORTER' },
    { label: 'Pending Reporter News', value: 'PENDING_REPORTER' }
]

export default function NewsListingScreen() {
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
        previewNews: null
    })

    const updateState = (data) => {
        setState((prev) => ({ ...prev, ...data }))
    }

    const selectedSet = useMemo(() => new Set(state.selectedIds), [state.selectedIds])
    const allCurrentSelected = state.news.length > 0 && state.news.every((item) => selectedSet.has(item.id))

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/admin/categories?limit=1000')
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
                ...(state.searchTerm && { search: state.searchTerm }),
                ...(state.categoryId !== 'all' && { categoryId: state.categoryId })
            })

            const response = await axios.get(`/api/admin/news?${params}`)

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCategories()
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchNews()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.page, state.searchTerm, state.categoryId, state.activeTab])

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

        if (state.bulkAction === 'delete' && !window.confirm('Delete selected news?')) {
            return
        }

        try {
            const response = await axios.patch('/api/admin/news', {
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
            const response = await axios.patch('/api/admin/news', {
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this news?')) return

        try {
            const response = await axios.delete(`/api/admin/news?id=${id}`)
            if (response.data.success) {
                toast.success('News deleted successfully')
                fetchNews()
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete news')
        }
    }

    return (
        <AdminLayout>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="space-y-6 border-b border-slate-200 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <h1 className="text-lg font-semibold text-slate-800">Manage News</h1>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative">
                                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={state.searchTerm}
                                    onChange={(e) => updateState({ searchTerm: e.target.value, page: 1 })}
                                    className="h-11 w-full rounded-full border border-slate-300 px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-pink-500 sm:w-64"
                                />
                            </div>
                            <Link
                                href="/admin/news/add"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-pink-600 px-5 text-sm font-semibold text-white transition hover:bg-pink-700"
                            >
                                <Plus size={17} />
                                Add News
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <select
                            value={state.categoryId}
                            onChange={(e) => updateState({ categoryId: e.target.value, page: 1 })}
                            className="h-12 w-full rounded-md border border-slate-300 px-4 text-sm text-slate-700 outline-none transition focus:border-pink-500 lg:max-w-sm"
                        >
                            <option value="all">All Category</option>
                            {state.categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.nameEnglish || category.name}
                                </option>
                            ))}
                        </select>

                        <div className="flex flex-wrap items-center gap-3">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={allCurrentSelected}
                                    onChange={toggleSelectAll}
                                    className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                                />
                                Select All
                            </label>
                            <select
                                value={state.bulkAction}
                                onChange={(e) => updateState({ bulkAction: e.target.value })}
                                className="h-10 rounded-md border border-pink-600 bg-pink-600 px-3 text-sm font-medium text-white outline-none"
                            >
                                <option value="">Action</option>
                                <option value="enable">Enable</option>
                                <option value="disable">Disable</option>
                                <option value="delete">Delete</option>
                            </select>
                            <button
                                type="button"
                                onClick={handleBulkAction}
                                className="h-10 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex overflow-x-auto border-b border-slate-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => updateState({ activeTab: tab.value, page: 1 })}
                            className={`min-w-max px-5 py-4 text-sm font-medium transition ${state.activeTab === tab.value
                                ? 'border-b-4 border-pink-600 bg-slate-50 text-pink-600'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-5">
                    {state.loading ? (
                        <div className="py-20 text-center text-slate-500">Loading news...</div>
                    ) : state.news.length === 0 ? (
                        <div className="flex h-80 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center">
                            <div>
                                <p className="text-lg font-semibold text-slate-700">No news found</p>
                                <p className="mt-1 text-sm text-slate-500">Create your first news item</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {state.news.map((item) => (
                                <article
                                    key={item.id}
                                    className="group relative overflow-hidden rounded-sm border border-slate-200 bg-slate-100 shadow-sm"
                                >
                                    <div className="absolute right-4 top-4 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedSet.has(item.id)}
                                            onChange={() => toggleSelect(item.id)}
                                            className="h-5 w-5 rounded border-white/80 bg-white/20 text-pink-600 focus:ring-pink-500"
                                        />
                                    </div>

                                    <div className="absolute left-0 right-0 top-0 z-10 bg-black/35 px-4 py-3">
                                        <p className="max-w-[75%] truncate text-lg font-bold text-white">
                                            {item.category?.name || item.category?.nameEnglish || 'News'}
                                        </p>
                                    </div>

                                    <div className="relative h-64 bg-slate-200">
                                        {item.featuredImage ? (
                                            <img
                                                src={item.featuredImage}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/45 to-transparent p-4 pt-16">
                                            <p className="text-xs font-medium text-white">
                                                {item.publishedDate ? new Date(item.publishedDate).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
                                            </p>
                                            <h2 className="mt-1 line-clamp-2 text-base font-semibold text-white">
                                                {item.title}
                                            </h2>
                                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateState({ previewNews: item })}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-pink-600 transition hover:bg-pink-50"
                                                    title="Preview"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-pink-600 transition hover:bg-pink-50"
                                                    title={`${item.viewCount || 0} views`}
                                                >
                                                    <BarChart3 size={16} />
                                                </button>
                                                <Link
                                                    href={`/admin/news/${item.id}/edit`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-pink-600 transition hover:bg-pink-50"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-pink-600 transition hover:bg-pink-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(item)}
                                                    className={`relative ml-2 h-6 w-12 rounded-full transition ${item.isActive ? 'bg-pink-600' : 'bg-slate-400'}`}
                                                    title={item.isActive ? 'Active' : 'Inactive'}
                                                >
                                                    <span
                                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${item.isActive ? 'left-7' : 'left-1'}`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {state.totalPages > 1 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={state.page}
                                totalPages={state.totalPages}
                                onPageChange={(page) => updateState({ page })}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Transition appear show={Boolean(state.previewNews)} as={Fragment}>
                <Dialog as="div" onClose={() => updateState({ previewNews: null })} className="relative z-50">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl">
                                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                    <Dialog.Title className="text-lg font-semibold text-slate-900">
                                        News Preview
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        onClick={() => updateState({ previewNews: null })}
                                        className="rounded-md text-slate-400 hover:text-slate-700"
                                    >
                                        <X size={22} />
                                    </button>
                                </div>

                                {state.previewNews && (
                                    <div className="space-y-4 p-5">
                                        {state.previewNews.featuredImage && (
                                            <img
                                                src={state.previewNews.featuredImage}
                                                alt={state.previewNews.title}
                                                className="max-h-80 w-full rounded-md object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-pink-600">
                                                {state.previewNews.category?.name || state.previewNews.category?.nameEnglish || 'Uncategorized'}
                                            </p>
                                            <h2 className="mt-1 text-2xl font-bold text-slate-900">
                                                {state.previewNews.title}
                                            </h2>
                                        </div>
                                        {state.previewNews.summary && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-700">Summary</h3>
                                                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{state.previewNews.summary}</p>
                                            </div>
                                        )}
                                        {state.previewNews.description && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-700">Description</h3>
                                                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{state.previewNews.description}</p>
                                            </div>
                                        )}
                                        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                                            <p><span className="font-semibold">District:</span> {state.previewNews.district?.name || 'All'}</p>
                                            <p><span className="font-semibold">Subdivision:</span> {state.previewNews.subdivision?.name || 'All'}</p>
                                            <p><span className="font-semibold">Tehsil:</span> {state.previewNews.tehsil?.name || 'All'}</p>
                                            <p><span className="font-semibold">Views:</span> {state.previewNews.viewCount || 0}</p>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AdminLayout>
    )
}
