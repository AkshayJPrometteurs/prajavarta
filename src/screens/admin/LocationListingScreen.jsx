"use client"

import { useEffect, useState } from 'react'
import { Field, Input, Button } from '@headlessui/react'
import { Edit2, Trash2, Search, Plus, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import LocationFormModal from '@/components/admin/LocationFormModal'
import Pagination from '@/components/ui/Pagination'

export default function LocationListingScreen() {
    const [state, setState] = useState({
        locations: [],
        loading: true,
        searchTerm: '',
        page: 1,
        pageSize: 10,
        totalPages: 1,
        isFormOpen: false,
        editingLocation: null,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))

    const fetchLocations = async () => {
        try {
            updateState({ loading: true })
            const params = new URLSearchParams({
                page: state.page.toString(),
                limit: state.pageSize.toString(),
                ...(state.searchTerm && { search: state.searchTerm })
            })
            const response = await axios.get(`/api/admin/location-list?${params}`)
            if (response.data.success) {
                updateState({
                    locations: response.data.data || [],
                    totalPages: response.data.pagination?.pages || 1
                })
            }
        } catch {
            toast.error('Failed to load locations')
        } finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => { fetchLocations() }, [state.page, state.searchTerm])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return
        try {
            const response = await axios.delete(`/api/admin/location-list?id=${id}`)
            if (response.data.success) { toast.success('Location deleted successfully'); fetchLocations() }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete location')
        }
    }

    const handleEdit = (location) => updateState({ editingLocation: location, isFormOpen: true })
    const handleAdd = () => updateState({ editingLocation: null, isFormOpen: true })
    const handleFormSubmit = () => { updateState({ isFormOpen: false, editingLocation: null, page: 1 }); fetchLocations() }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Manage Locations</h1>
                    <Button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700">
                        <Plus size={18} /> Add Location
                    </Button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Field className="relative w-full sm:max-w-md">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search locations..."
                            value={state.searchTerm}
                            onChange={(e) => updateState({ searchTerm: e.target.value, page: 1 })}
                            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-pink-500"
                        />
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
                                <th className="px-6 py-3">Group Link</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {state.loading ? (
                                <tr><td colSpan={7} className="py-20 text-center text-slate-500">Loading locations...</td></tr>
                            ) : state.locations.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-slate-500">No locations found</td></tr>
                            ) : (
                                state.locations.map((item, idx) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.nameEnglish || '-'}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.district ? `${item.district.name}${item.district.nameEnglish ? ` (${item.district.nameEnglish})` : ''}` : '-'}</td>
                                        <td className="px-6 py-4 text-slate-600">{item.subdivision ? `${item.subdivision.name}${item.subdivision.nameEnglish ? ` (${item.subdivision.nameEnglish})` : ''}` : '-'}</td>
                                        <td className="px-6 py-4">
                                            {item.groupLink ? (
                                                <a href={item.groupLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium">
                                                    <ExternalLink size={12} /> View Link
                                                </a>
                                            ) : <span className="text-slate-400">-</span>}
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

                <LocationFormModal
                    isOpen={state.isFormOpen}
                    location={state.editingLocation}
                    onClose={() => updateState({ isFormOpen: false, editingLocation: null })}
                    onSubmit={handleFormSubmit}
                />
            </div>
        </AdminLayout>
    )
}
