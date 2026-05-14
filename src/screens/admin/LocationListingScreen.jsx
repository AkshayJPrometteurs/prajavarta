"use client"

import { useEffect, useState } from 'react'
import { Edit2, Trash2, Search, Plus, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import LocationFormModal from '@/components/admin/LocationFormModal'
import Pagination from '@/components/ui/Pagination'
import useDebounce from '@/hooks/useDebounce'

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

    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchLocations = async () => {
        try {
            updateState({ loading: true })
            const params = {
                page: state.page.toString(),
                limit: state.pageSize.toString(),
                ...(debouncedSearchTerm && { search: debouncedSearchTerm })
            }
            const response = await axios.get(`/api/admin/location-list`, { params: params })
            if (response.data.success) {
                updateState({
                    locations: response.data.data || [],
                    totalPages: response.data.pagination?.pages || 1
                })
            }
        } catch {
            toast.error('Failed to load locations')
        }
        finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => {
        updateState({ page: 1 })
    }, [debouncedSearchTerm])

    useEffect(() => { fetchLocations() }, [state.page, debouncedSearchTerm])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this location?')) return
        try {
            const response = await axios.delete(`/api/admin/location-list?id=${id}`)
            if (response.data.success) {
                toast.success('Location deleted successfully')
                fetchLocations()
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete location')
        }
    }

    const handleEdit = (location) => updateState({
        editingLocation: location,
        isFormOpen: true
    })

    const handleAdd = () => updateState({
        editingLocation: null,
        isFormOpen: true
    })

    const handleFormSubmit = () => {
        updateState({
            isFormOpen: false,
            editingLocation: null,
            page: 1
        })
        fetchLocations()
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Locations</h1>
                    <button onClick={handleAdd} className="btn btn-primary btn-sm gap-2">
                        <Plus size={18} /> Add Location
                    </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                        <Search size={16} className="text-base-content/40" />
                        <input type="text" placeholder="Search locations..." value={state.searchTerm}
                            onChange={(e) => updateState({ searchTerm: e.target.value })} className="grow" />
                    </label>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name (Marathi)</th>
                                <th>Name (English)</th>
                                <th>District</th>
                                <th>Subdivision</th>
                                <th>Group Link</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={7} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.locations.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-base-content/50">No locations found</td></tr>
                            ) : (
                                state.locations.map((item, idx) => (
                                    <tr key={item.id} className="hover">
                                        <td className="text-base-content/60">{(state.page - 1) * state.pageSize + idx + 1}</td>
                                        <td className="font-medium">{item.name}</td>
                                        <td className="text-base-content/70">{item.nameEnglish || '-'}</td>
                                        <td className="text-base-content/70">{item.district ? `${item.district.name}${item.district.nameEnglish ? ` (${item.district.nameEnglish})` : ''}` : '-'}</td>
                                        <td className="text-base-content/70">{item.subdivision ? `${item.subdivision.name}${item.subdivision.nameEnglish ? ` (${item.subdivision.nameEnglish})` : ''}` : '-'}</td>
                                        <td>
                                            {item.groupLink ? (
                                                <a href={item.groupLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs gap-1 text-primary">
                                                    <ExternalLink size={12} /> View
                                                </a>
                                            ) : <span className="text-base-content/40">-</span>}
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
                                                    onClick={() => handleDelete(item.id)}
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

                <LocationFormModal isOpen={state.isFormOpen} location={state.editingLocation}
                    onClose={() => updateState({ isFormOpen: false, editingLocation: null })}
                    onSubmit={handleFormSubmit} />
            </div>
        </AdminLayout>
    )
}
