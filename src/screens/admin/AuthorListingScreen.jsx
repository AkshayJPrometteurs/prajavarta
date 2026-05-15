"use client"

import { useEffect, useState } from 'react'
import { Edit2, Trash2, Search, Plus, User as UserIcon } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import AuthorFormModal from '@/components/admin/AuthorFormModal'
import useDebounce from '@/hooks/useDebounce'

export default function AuthorListingScreen() {
    const [state, setState] = useState({
        authors: [],
        loading: true,
        searchTerm: '',
        isFormOpen: false,
        editingAuthor: null,
    })

    const updateState = (data) => setState((prev) => ({ ...prev, ...data }))
    const debouncedSearchTerm = useDebounce(state.searchTerm, 500)

    const fetchAuthors = async () => {
        try {
            updateState({ loading: true })
            const response = await axiosInstance.get('/admin/authors')
            if (response.data.success) {
                let filtered = response.data.data
                if (debouncedSearchTerm) {
                    const search = debouncedSearchTerm.toLowerCase()
                    filtered = filtered.filter(a => 
                        a.name.toLowerCase().includes(search) || 
                        (a.nameEnglish && a.nameEnglish.toLowerCase().includes(search)) ||
                        (a.role && a.role.toLowerCase().includes(search))
                    )
                }
                updateState({ authors: filtered })
            }
        } catch { 
            toast.error('Failed to load authors') 
        } finally { 
            updateState({ loading: false }) 
        }
    }

    useEffect(() => { 
        fetchAuthors() 
    }, [debouncedSearchTerm])

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this author?')) return
        try {
            const response = await axiosInstance.delete(`/admin/authors/${id}`)
            if (response.data.success) { 
                toast.success(response.data.message || 'Author deleted successfully')
                fetchAuthors() 
            }
        } catch (error) { 
            toast.error(error.response?.data?.error || 'Failed to delete author') 
        }
    }

    const handleEdit = (author) => updateState({ editingAuthor: author, isFormOpen: true })
    const handleAdd = () => updateState({ editingAuthor: null, isFormOpen: true })
    const handleFormSubmit = () => { 
        updateState({ isFormOpen: false, editingAuthor: null })
        fetchAuthors() 
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Manage Authors</h1>
                    <button onClick={handleAdd} className="btn btn-primary btn-sm gap-2">
                        <Plus size={18} /> Add Author
                    </button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-md">
                        <Search size={16} className="text-base-content/40" />
                        <input type="text" placeholder="Search authors by name or role..." value={state.searchTerm}
                            onChange={(e) => updateState({ searchTerm: e.target.value })} className="grow" />
                    </label>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-200 bg-base-100 shadow-sm">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Profile</th>
                                <th>Name (Marathi)</th>
                                <th>Role</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.loading ? (
                                <tr><td colSpan={7} className="py-20 text-center"><span className="loading loading-spinner loading-md" /></td></tr>
                            ) : state.authors.length === 0 ? (
                                <tr><td colSpan={7} className="py-20 text-center text-base-content/50">No authors found</td></tr>
                            ) : (
                                state.authors.map((author, idx) => (
                                    <tr key={author.id} className="hover">
                                        <td className="text-base-content/60">{idx + 1}</td>
                                        <td>
                                            <div className="avatar">
                                                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                                                    {author.image ? (
                                                        <img src={author.image} alt={author.name} />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full w-full">
                                                            <UserIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{author.name}</span>
                                                <span className="text-xs text-base-content/50">{author.nameEnglish || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="text-sm">{author.role || '-'}</td>
                                        <td className="text-sm">
                                            <div className="flex flex-col">
                                                <span>{author.email || '-'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm ${author.isActive ? 'badge-success' : 'badge-ghost'}`}>
                                                {author.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(author)} className="btn btn-sm btn-ghost gap-1">
                                                    <Edit2 size={12} />
                                                </button>
                                                <button onClick={() => handleDelete(author.id)} className="btn btn-sm btn-ghost text-error gap-1">
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <AuthorFormModal isOpen={state.isFormOpen} author={state.editingAuthor}
                    onClose={() => updateState({ isFormOpen: false, editingAuthor: null })}
                    onSubmit={handleFormSubmit} />
            </div>
        </AdminLayout>
    )
}
