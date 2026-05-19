"use client"

import { useEffect, useState } from 'react'
import { Edit2, Trash2, Search, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import SubdivisionFormModal from './SubdivisionFormModal'
import Pagination from '@/components/ui/Pagination'
import useDebounce from '@/hooks/useDebounce'

export default function SubdivisionListingScreen() {
    const [state, setState] = useState({
        subdivisions: [], loading: true, searchTerm: '', filterStatus: 'all',
        page: 1, pageSize: 10, totalPages: 1, isFormOpen: false, editingSubdivision: null,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))

    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchSubdivisions = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(), limit: state.pageSize.toString(),
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                ...(state.filterStatus !== 'all' && { isActive: state.filterStatus === 'active' })
            })
            const response = await axios.get(`/api/admin/subdivisions?${params}`)
            if (response.data.success) updateState({ subdivisions: response.data.data || [], totalPages: response.data.pagination?.pages || 1 })
        } catch { toast.error('Failed to load subdivisions') }
        finally { updateState({ loading: false }) }
    }

    useEffect(() => {
        updateState({ page: 1 })
    }, [debouncedSearchTerm])

    useEffect(() => { fetchSubdivisions() }, [state.page, debouncedSearchTerm, state.filterStatus])

    const handleToggleStatus = async (subdivision) => {
        try {
            const response = await axios.put('/api/admin/subdivisions', { id: subdivision.id, name: subdivision.name, nameEnglish: subdivision.nameEnglish, districtId: subdivision.districtId, isActive: !subdivision.isActive })
            if (response.data.success) { toast.success(`Subdivision ${response.data.data.isActive ? 'enabled' : 'disabled'}`); fetchSubdivisions() }
        } catch { toast.error('Failed to update status') }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subdivision?')) return
        try {
            const response = await axios.delete(`/api/admin/subdivisions?id=${id}`)
            if (response.data.success) { toast.success('Subdivision deleted successfully'); fetchSubdivisions() }
        } catch (error) { toast.error(error.response?.data?.error || 'Failed to delete subdivision') }
    }

    const handleEdit = (subdivision) => updateState({ editingSubdivision: subdivision, isFormOpen: true })
    const handleAdd = () => updateState({ editingSubdivision: null, isFormOpen: true })
    const handleFormSubmit = () => { updateState({ isFormOpen: false, editingSubdivision: null, page: 1 }); fetchSubdivisions() }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Subdivisions</h1>
                    <div className="flex items-center gap-2">
                        {state.subdivisions.length > 0 && (
                            <ExportToExcel
                                filename={`subdivisions_export_${Date.now()}.csv`}
                                fetchUrl={`/api/admin/subdivisions?${new URLSearchParams({ ...(debouncedSearchTerm && { search: debouncedSearchTerm }), ...(state.filterStatus !== 'all' && { isActive: state.filterStatus === 'active' }), limit: '100000' })}`}
                                headers={[{ label: 'Name', key: 'name' }, { label: 'NameEnglish', key: 'nameEnglish' }, { label: 'District', key: 'district' }, { label: 'IsActive', key: 'isActive' }]}
                                className="btn btn-outline btn-sm"
                            />
                        )}
                        <button onClick={handleAdd} className="btn btn-primary btn-sm gap-2">
                            <Plus size={18} /> Add Subdivision
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                        <Search size={16} className="text-base-content/40" />
                        <input type="text" placeholder="Search subdivisions..." value={state.searchTerm}
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
                                <th>Name (Marathi)</th>
                                <th>Name (English)</th>
                                <th>District</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={6} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.subdivisions.length === 0 ? (
                                <tr><td colSpan={6} className="py-20 text-center text-base-content/50">No subdivisions found</td></tr>
                            ) : (
                                state.subdivisions.map((item, idx) => (
                                    <tr key={item.id} className="hover">
                                        <td className="text-base-content/60">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td className="font-medium">{item.name}</td>
                                        <td className="text-base-content/70">{item.nameEnglish || '-'}</td>
                                        <td className="text-base-content/70">{item.district ? `${item.district.name}${item.district.nameEnglish ? ` (${item.district.nameEnglish})` : ''}` : '-'}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" className="toggle toggle-primary toggle-sm"
                                                    checked={item.isActive} onChange={() => handleToggleStatus(item)} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="btn btn-sm gap-1"
                                                >
                                                    <Edit2 size={12} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(district.id)}
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

                <SubdivisionFormModal isOpen={state.isFormOpen} subdivision={state.editingSubdivision}
                    onClose={() => updateState({ isFormOpen: false, editingSubdivision: null })}
                    onSubmit={handleFormSubmit} />
            </div>
        </AdminLayout>
    )
}
