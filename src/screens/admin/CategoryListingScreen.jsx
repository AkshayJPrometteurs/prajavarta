"use client"

import { useEffect, useState } from 'react'
import { Edit2, Trash2, Search, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import CategoryFormModal from '@/components/admin/CategoryFormModal'
import Pagination from '@/components/ui/Pagination'
import useDebounce from '@/hooks/useDebounce'

export default function CategoryListingScreen() {
    const [state, setState] = useState({
        categories: [], loading: true, searchTerm: '', filterStatus: 'all',
        page: 1, pageSize: 10, totalPages: 1, isFormOpen: false, editingCategory: null,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))

    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchCategories = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(), limit: state.pageSize.toString(),
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                ...(state.filterStatus !== 'all' && { isActive: state.filterStatus === 'active' })
            })
            const response = await axios.get(`/api/admin/categories?${params}`)
            if (response.data.success) updateState({ categories: response.data.data || [], totalPages: response.data.pagination?.pages || 1 })
        } catch { toast.error('Failed to load categories') }
        finally { updateState({ loading: false }) }
    }

    useEffect(() => {
        updateState({ page: 1 })
    }, [debouncedSearchTerm])

    useEffect(() => { fetchCategories() }, [state.page, debouncedSearchTerm, state.filterStatus])

    const handleToggleStatus = async (category) => {
        try {
            const response = await axios.put('/api/admin/categories', { id: category.id, name: category.name, nameEnglish: category.nameEnglish, sortOrder: category.sortOrder, isActive: !category.isActive })
            if (response.data.success) { toast.success(`Category ${response.data.data.isActive ? 'enabled' : 'disabled'}`); fetchCategories() }
        } catch { toast.error('Failed to update category status') }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return
        try {
            const response = await axios.delete(`/api/admin/categories?id=${id}`)
            if (response.data.success) { toast.success('Category deleted successfully'); fetchCategories() }
        } catch (error) { toast.error(error.response?.data?.error || 'Failed to delete category') }
    }

    const handleEdit = (category) => updateState({ editingCategory: category, isFormOpen: true })
    const handleAdd = () => updateState({ editingCategory: null, isFormOpen: true })
    const handleFormSubmit = () => { updateState({ isFormOpen: false, editingCategory: null, page: 1 }); fetchCategories() }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Categories</h1>
                    <button onClick={handleAdd} className="btn btn-primary btn-sm gap-2">
                        <Plus size={18} /> Add Category
                    </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                        <Search size={16} className="text-base-content/40" />
                        <input type="text" placeholder="Search categories..." value={state.searchTerm}
                            onChange={(e) => updateState({ searchTerm: e.target.value })} className="grow" />
                    </label>
                    <select value={state.filterStatus} onChange={(e) => updateState({ filterStatus: e.target.value, page: 1 })} className="select select-bordered w-full sm:w-40">
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                {/* <th>Image</th> */}
                                <th>Name (Marathi)</th>
                                <th>Name (English)</th>
                                <th>Seq.</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={7} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.categories.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-base-content/50">No categories found</td></tr>
                            ) : (
                                state.categories.map((category, idx) => (
                                    <tr key={category.id} className="hover">
                                        <td className="text-base-content/60">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        {/* <td>
                                            {category.image ? (
                                                <div className="avatar"><div className="w-10 rounded"><img src={category.image} alt={category.name} /></div></div>
                                            ) : <div className="avatar placeholder"><div className="w-10 rounded bg-neutral text-neutral-content"><span className="text-xs">No img</span></div></div>}
                                        </td> */}
                                        <td className="font-medium">{category.name}</td>
                                        <td className="text-base-content/70">{category.nameEnglish || '-'}</td>
                                        <td className="text-base-content/60">{category.sortOrder ?? '-'}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" className="toggle toggle-primary toggle-sm"
                                                    checked={category.isActive} onChange={() => handleToggleStatus(category)} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="btn btn-sm gap-1"
                                                >
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="btn btn-sm btn-error text-white gap-1"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {state.totalPages > 1 && (
                    <Pagination currentPage={state.page} totalPages={state.totalPages} onPageChange={(page) => updateState({ page })} />
                )}

                <CategoryFormModal isOpen={state.isFormOpen} category={state.editingCategory}
                    onClose={() => updateState({ isFormOpen: false, editingCategory: null })}
                    onSubmit={handleFormSubmit} />
            </div>
        </AdminLayout>
    )
}
