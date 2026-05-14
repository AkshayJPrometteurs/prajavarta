"use client"

import { useEffect, useState } from 'react'
import { Edit2, Trash2, Search, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import DistrictFormModal from '@/components/admin/DistrictFormModal'
import Pagination from '@/components/ui/Pagination'
import useDebounce from '@/hooks/useDebounce'

export default function DistrictListingScreen() {
    const [state, setState] = useState({
        districts: [], loading: true, searchTerm: '', filterStatus: 'all',
        page: 1, pageSize: 10, totalPages: 1, isFormOpen: false, editingDistrict: null,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))

    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchDistricts = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(), limit: state.pageSize.toString(),
                ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                ...(state.filterStatus !== 'all' && { isActive: state.filterStatus === 'active' })
            })
            const response = await axios.get(`/api/admin/districts?${params}`)
            if (response.data.success) updateState({ districts: response.data.data || [], totalPages: response.data.pagination?.pages || 1 })
        } catch { toast.error('Failed to load districts') }
        finally { updateState({ loading: false }) }
    }

    useEffect(() => {
        updateState({ page: 1 })
    }, [debouncedSearchTerm])

    useEffect(() => { fetchDistricts() }, [state.page, debouncedSearchTerm, state.filterStatus])

    const handleToggleStatus = async (district) => {
        try {
            const response = await axios.put('/api/admin/districts', { id: district.id, name: district.name, nameEnglish: district.nameEnglish, isActive: !district.isActive })
            if (response.data.success) { toast.success(`District ${response.data.data.isActive ? 'enabled' : 'disabled'}`); fetchDistricts() }
        } catch { toast.error('Failed to update district status') }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this district?')) return
        try {
            const response = await axios.delete(`/api/admin/districts?id=${id}`)
            if (response.data.success) { toast.success('District deleted successfully'); fetchDistricts() }
        } catch (error) { toast.error(error.response?.data?.error || 'Failed to delete district') }
    }

    const handleEdit = (district) => updateState({ editingDistrict: district, isFormOpen: true })
    const handleAdd = () => updateState({ editingDistrict: null, isFormOpen: true })
    const handleFormSubmit = () => { updateState({ isFormOpen: false, editingDistrict: null, page: 1 }); fetchDistricts() }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Districts</h1>
                    <button onClick={handleAdd} className="btn btn-primary btn-sm gap-2">
                        <Plus size={18} /> Add District
                    </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                        <Search size={16} className="text-base-content/40" />
                        <input type="text" placeholder="Search districts..." value={state.searchTerm}
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
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={5} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.districts.length === 0 ? (
                                <tr><td colSpan={5} className="py-20 text-center text-base-content/50">No districts found</td></tr>
                            ) : (
                                state.districts.map((district, idx) => (
                                    <tr key={district.id} className="hover">
                                        <td className="text-base-content/60">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td className="font-medium">{district.name}</td>
                                        <td className="text-base-content/70">{district.nameEnglish || '-'}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <input type="checkbox" className="toggle toggle-primary toggle-sm"
                                                    checked={district.isActive} onChange={() => handleToggleStatus(district)} />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(district)}
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

                <DistrictFormModal isOpen={state.isFormOpen} district={state.editingDistrict}
                    onClose={() => updateState({ isFormOpen: false, editingDistrict: null })}
                    onSubmit={handleFormSubmit} />
            </div>
        </AdminLayout>
    )
}
