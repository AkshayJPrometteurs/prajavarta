"use client"

import { useEffect, useState } from 'react'
import { Field, Input, Select, Button } from '@headlessui/react'
import { Edit2, Trash2, Search, Plus } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import TehsilFormModal from '@/components/admin/TehsilFormModal'
import Pagination from '@/components/ui/Pagination'

export default function TehsilListingScreen() {
    const [state, setState] = useState({
        tehsils: [],
        loading: true,
        searchTerm: '',
        filterStatus: 'all',
        page: 1,
        pageSize: 10,
        totalPages: 1,
        isFormOpen: false,
        editingTehsil: null,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))

    const fetchTehsils = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(),
                limit: state.pageSize.toString(),
                ...(state.searchTerm && { search: state.searchTerm }),
                ...(state.filterStatus !== 'all' && { isActive: state.filterStatus === 'active' })
            })
            const response = await axios.get(`/api/admin/tehsils?${params}`)
            if (response.data.success) {
                updateState({
                    tehsils: response.data.data || [],
                    totalPages: response.data.pagination?.pages || 1
                })
            }
        } catch {
            toast.error('Failed to load tehsils')
        } finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => { fetchTehsils() }, [state.page, state.searchTerm, state.filterStatus])

    const handleToggleStatus = async (tehsil) => {
        try {
            const response = await axios.put('/api/admin/tehsils', {
                id: tehsil.id,
                name: tehsil.name,
                nameEnglish: tehsil.nameEnglish,
                districtId: tehsil.districtId,
                subdivisionId: tehsil.subdivisionId,
                isActive: !tehsil.isActive
            })
            if (response.data.success) {
                toast.success(`Tehsil ${response.data.data.isActive ? 'enabled' : 'disabled'} successfully`)
                fetchTehsils()
            }
        } catch { toast.error('Failed to update status') }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tehsil?')) return
        try {
            const response = await axios.delete(`/api/admin/tehsils?id=${id}`)
            if (response.data.success) { toast.success('Tehsil deleted successfully'); fetchTehsils() }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete tehsil')
        }
    }

    const handleEdit = (tehsil) => updateState({ editingTehsil: tehsil, isFormOpen: true })
    const handleAdd = () => updateState({ editingTehsil: null, isFormOpen: true })
    const handleFormSubmit = () => { updateState({ isFormOpen: false, editingTehsil: null, page: 1 }); fetchTehsils() }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Manage Tehsils</h1>
                    <Button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700">
                        <Plus size={18} /> Add Tehsil
                    </Button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Field className="relative w-full sm:max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search tehsils..."
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

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-3">#</th>
                                <th className="px-6 py-3">Name (Marathi)</th>
                                <th className="px-6 py-3">Name (English)</th>
                                <th className="px-6 py-3">District</th>
                                <th className="px-6 py-3">Subdivision</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {state.loading ? (
                                <tr><td colSpan={7} className="py-20 text-center text-slate-500">Loading tehsils...</td></tr>
                            ) : state.tehsils.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-slate-500">No tehsils found</td></tr>
                            ) : (
                                state.tehsils.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.nameEnglish || '-'}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.district ? `${item.district.name}${item.district.nameEnglish ? ` (${item.district.nameEnglish})` : ''}` : '-'}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.subdivision ? `${item.subdivision.name}${item.subdivision.nameEnglish ? ` (${item.subdivision.nameEnglish})` : ''}` : '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                <Button onClick={() => handleToggleStatus(item)} className={`relative h-6 w-11 rounded-full transition ${item.isActive ? 'bg-pink-600' : 'bg-slate-300'}`}>
                                                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${item.isActive ? 'left-6' : 'left-1'}`} />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <Button onClick={() => handleEdit(item)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                                                    <Edit2 size={14} /> Edit
                                                </Button>
                                                <Button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-600">
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

                <TehsilFormModal
                    isOpen={state.isFormOpen}
                    tehsil={state.editingTehsil}
                    onClose={() => updateState({ isFormOpen: false, editingTehsil: null })}
                    onSubmit={handleFormSubmit}
                />
            </div>
        </AdminLayout>
    )
}
