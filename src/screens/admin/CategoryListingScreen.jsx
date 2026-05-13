"use client"

import { useEffect, useState } from 'react'
import { Field, Input, Select, Button } from '@headlessui/react'
import { Edit2, Trash2, Search, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import CategoryFormModal from '@/components/admin/CategoryFormModal'
import Pagination from '@/components/ui/Pagination'

export default function CategoryListingScreen() {

    const [state, setState] = useState({
        categories: [],
        loading: true,

        searchTerm: '',
        filterStatus: 'all',

        page: 1,
        pageSize: 10,
        totalPages: 1,

        isFormOpen: false,
        editingCategory: null,
    })

    // Centralized state updater
    const updateState = (data) => {
        setState((prev) => ({ ...prev, ...data }))
    }

    // Fetch categories
    const fetchCategories = async () => {
        try {
            updateState({ loading: true })

            const params = new URLSearchParams({
                page: state.page.toString(),
                limit: state.pageSize.toString(),
                ...(state.searchTerm && { search: state.searchTerm }),
                ...(state.filterStatus !== 'all' && {
                    isActive: state.filterStatus === 'active'
                })
            })

            const response = await axios.get(`/api/admin/categories?${params}`)

            if (response.data.success) {
                updateState({
                    categories: response.data.data || [],
                    totalPages: response.data.pagination?.pages || 1
                })
            }

        } catch (error) {
            toast.error('Failed to load categories')
        } finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [state.page, state.searchTerm, state.filterStatus])

    // Toggle status
    const handleToggleStatus = async (category) => {
        try {
            const response = await axios.put(
                '/api/admin/categories',
                {
                    id: category.id,
                    name: category.name,
                    nameEnglish: category.nameEnglish,
                    description: category.description,
                    image: category.image,
                    isActive: !category.isActive,
                    sortOrder: category.sortOrder
                }
            )

            if (response.data.success) {
                toast.success(`Category ${response.data.data.isActive ? 'enabled' : 'disabled'} successfully`)
                fetchCategories()
            }

        } catch (error) {
            toast.error('Failed to update category status')
        }
    }

    // Delete category
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?')
        if (!confirmDelete) return
        try {
            const response = await axios.delete(`/api/admin/categories?id=${id}`)

            if (response.data.success) {
                toast.success('Category deleted successfully')
                fetchCategories()
            }
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                'Failed to delete category'
            )
        }
    }

    // Edit category
    const handleEdit = (category) => {
        updateState({
            editingCategory: category,
            isFormOpen: true
        })
    }

    // Add category
    const handleAdd = () => {
        updateState({
            editingCategory: null,
            isFormOpen: true
        })
    }

    // Form submit
    const handleFormSubmit = () => {
        updateState({
            isFormOpen: false,
            editingCategory: null,
            page: 1
        })
        fetchCategories()
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Manage Categories
                    </h1>

                    <Button
                        onClick={handleAdd}
                        className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700"
                    >
                        <Plus size={18} />
                        Add Category
                    </Button>

                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <Field className="relative w-full sm:max-w-md">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <Input
                            type="text"
                            placeholder="Search categories..."
                            value={state.searchTerm}
                            onChange={(e) => {
                                updateState({
                                    searchTerm: e.target.value,
                                    page: 1
                                })
                            }}
                            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-pink-500"
                        />
                    </Field>

                    {/* Filter */}
                    <Field>
                        <Select
                            value={state.filterStatus}
                            onChange={(e) => {
                                updateState({
                                    filterStatus: e.target.value,
                                    page: 1
                                })
                            }}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-pink-500"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </Field>
                </div>

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {state.loading ? (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-500">
                                Loading categories...
                            </p>
                        </div>
                    ) : state.categories.length === 0 ? (
                        <div className="col-span-full flex h-96 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
                            <div className="text-center">
                                <p className="text-lg font-semibold text-slate-700">
                                    No categories found
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Create your first category
                                </p>
                            </div>
                        </div>
                    ) : (
                        state.categories.map((category) => (
                            <div
                                key={category.id}
                                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                            >
                                {/* Image */}
                                <div className="relative h-32 overflow-hidden bg-slate-100">
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <p className="text-sm text-slate-400">
                                                No Image
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* Content */}
                                <div className="space-y-4 p-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">
                                            {category.name}
                                        </h3>
                                        {category.nameEnglish && (
                                            <p className="mt-0.5 text-sm font-medium text-slate-500">
                                                {category.nameEnglish}
                                            </p>
                                        )}
                                        {category.description && (
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${category.isActive
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {category.isActive
                                                ? 'Active'
                                                : 'Inactive'}
                                        </span>

                                        <Button
                                            onClick={() =>
                                                handleToggleStatus(category)
                                            }
                                            className={`relative h-6 w-11 rounded-full transition ${category.isActive
                                                ? 'bg-pink-600'
                                                : 'bg-slate-300'
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${category.isActive
                                                    ? 'left-6'
                                                    : 'left-1'
                                                    }`}
                                            />
                                        </Button>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() =>
                                                handleEdit(category)
                                            }
                                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </Button>

                                        <Button
                                            onClick={() =>
                                                handleDelete(category.id)
                                            }
                                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {state.totalPages > 1 && (
                    <Pagination
                        currentPage={state.page}
                        totalPages={state.totalPages}
                        onPageChange={(page) =>
                            updateState({ page })
                        }
                    />
                )}

                {/* Modal */}
                <CategoryFormModal
                    isOpen={state.isFormOpen}
                    category={state.editingCategory}
                    onClose={() =>
                        updateState({
                            isFormOpen: false,
                            editingCategory: null
                        })
                    }
                    onSubmit={handleFormSubmit}
                />
            </div>

        </AdminLayout>
    )
}
