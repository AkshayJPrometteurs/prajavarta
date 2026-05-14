"use client"

import { useEffect, useState } from 'react'
import { Field, Input, Select, Button } from '@headlessui/react'
import { Edit2, Trash2, Search, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import DistrictFormModal from '@/components/admin/DistrictFormModal'
import Pagination from '@/components/ui/Pagination'

export default function DistrictListingScreen() {
    const [state, setState] = useState({
        districts: [],
        loading: true,
        searchTerm: '',
        filterStatus: 'all',
        page: 1,
        pageSize: 10,
        totalPages: 1,
        isFormOpen: false,
        editingDistrict: null,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))

    const fetchDistricts = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(),
                limit: state.pageSize.toString(),
                ...(state.searchTerm && { search: state.searchTerm }),
                ...(state.filterStatus !== 'all' && { isActive: state.filterStatus === 'active' })
            })
            const response = await axios.get(`/api/admin/districts?${params}`)
            if (response.data.success) {
                updateState({
                    districts: response.data.data || [],
                    totalPages: response.data.pagination?.pages || 1
                })
            }
        } catch {
            toast.error('Failed to load districts')
        } finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => { fetchDistricts() }, [state.page, state.searchTerm, state.filterStatus])

    const handleToggleStatus = async (district) => {
        try {
            const response = await axios.put('/api/admin/districts', {
                id: district.id,
                name: district.name,
                nameEnglish: district.nameEnglish,
                isActive: !district.isActive
            })
            if (response.data.success) {
                toast.success(`District ${response.data.data.isActive ? 'enabled' : 'disabled'} successfully`)
                fetchDistricts()
            }
        } catch { toast.error('Failed to update district status') }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this district?')) return
        try {
            const response = await axios.delete(`/api/admin/districts?id=${id}`)
            if (response.data.success) { toast.success('District deleted successfully'); fetchDistricts() }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete district')
        }
    }

    const handleEdit = (district) => updateState({ editingDistrict: district, isFormOpen: true })
    const handleAdd = () => updateState({ editingDistrict: null, isFormOpen: true })
    const handleFormSubmit = () => { updateState({ isFormOpen: false, editingDistrict: null, page: 1 }); fetchDistricts() }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Manage Districts</h1>
                    <Button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700">
                        <Plus size={18} /> Add District
                    </Button>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Field className="relative w-full sm:max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search districts..."
                            value={state.searchTerm}
                            onChange={(e) => updateState({ searchTerm: e.target.value, page: 1 })}
                            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-pink-500"
                        />
                    </Field>
                    <Field>
                        <Select
                            value={state.filterStatus}
                            onChange={(e) => updateState({ filterStatus: e.target.value, page: 1 })}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-pink-500"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </Select>
                    </Field>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Name (Marathi)</th>
                                <th className="px-6 py-3">Name (English)</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {state.loading ? (
                                <tr><td colSpan={5} className="py-20 text-center text-slate-500">Loading districts...</td></tr>
                            ) : state.districts.length === 0 ? (
                                <tr><td colSpan={5} className="py-20 text-center text-slate-500">No districts found</td></tr>
                            ) : (
                                state.districts.map((district, idx) => (
                                    <tr key={district.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{district.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{district.nameEnglish || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${district.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {district.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                <Button
                                                    onClick={() => handleToggleStatus(district)}
                                                    className={`relative h-6 w-11 rounded-full transition ${district.isActive ? 'bg-pink-600' : 'bg-slate-300'}`}
                                                >
                                                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${district.isActive ? 'left-6' : 'left-1'}`} />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Button onClick={() => handleEdit(district)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                                                    <Edit2 size={14} /> Edit
                                                </Button>
                                                <Button onClick={() => handleDelete(district.id)} className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-600">
                                                    <Trash2 size={14} /> Delete
                                                </Button>
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

                <DistrictFormModal
                    isOpen={state.isFormOpen}
                    district={state.editingDistrict}
                    onClose={() => updateState({ isFormOpen: false, editingDistrict: null })}
                    onSubmit={handleFormSubmit}
                />
            </div>
        </AdminLayout>
    )
}
