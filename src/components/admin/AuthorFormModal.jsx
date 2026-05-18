"use client"

import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axios'
import { toast } from 'react-toastify'
import { X, Upload } from 'lucide-react'

export default function AuthorFormModal({ isOpen, author, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        nameEnglish: '',
        role: '',
        experience: '',
        bio: '',
        image: '',
        twitter: '',
        linkedin: '',
        email: '',
        password: '',
        isActive: true
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (author) {
            setFormData({
                name: author.name || '',
                nameEnglish: author.nameEnglish || '',
                role: author.role || '',
                experience: author.experience || '',
                bio: author.bio || '',
                image: author.image || '',
                twitter: author.twitter || '',
                linkedin: author.linkedin || '',
                email: author.email || '',
                password: '', // Don't prefill password
                isActive: author.isActive ?? true
            })
        } else {
            setFormData({
                name: '',
                nameEnglish: '',
                role: '',
                experience: '',
                bio: '',
                image: '',
                twitter: '',
                linkedin: '',
                email: '',
                password: '',
                isActive: true
            })
        }
    }, [author, isOpen])

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setSelectedFile(file)
        setFormData(prev => ({ ...prev, image: file.name })) // Show filename in the input
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name) return toast.error('Name is required')

        try {
            setLoading(true)

            let imageUrl = formData.image
            if (selectedFile) {
                const formDataUpload = new FormData()
                formDataUpload.append('file', selectedFile)
                formDataUpload.append('folder', 'authors') // Organized uploads

                toast.info('Uploading image...')
                const uploadRes = await axiosInstance.post('/admin/upload', formDataUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                if (uploadRes.data.success) {
                    imageUrl = uploadRes.data.data.path // The API returns path in data.path
                } else {
                    throw new Error('Image upload failed')
                }
            }

            const submissionData = { ...formData, image: imageUrl }
            const response = author 
                ? await axiosInstance.put(`/admin/authors/${author.id}`, submissionData)
                : await axiosInstance.post('/admin/authors', submissionData)

            if (response.data.success) {
                toast.success(`Author ${author ? 'updated' : 'created'} successfully`)
                setSelectedFile(null)
                onSubmit()
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || 'Failed to save author')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">{author ? 'Edit Author' : 'Add New Author'}</h3>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name (Marathi) *</span></label>
                            <input type="text" className="input input-bordered" value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. सुनील देशमुख" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Name (English Slug)</span></label>
                            <input type="text" className="input input-bordered" value={formData.nameEnglish}
                                onChange={e => setFormData({ ...formData, nameEnglish: e.target.value })} placeholder="e.g. sunil-deshmukh" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Role / Designation</span></label>
                            <input type="text" className="input input-bordered" value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. राजकीय संपादक" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Experience</span></label>
                            <input type="text" className="input input-bordered" value={formData.experience}
                                onChange={e => setFormData({ ...formData, experience: e.target.value })} placeholder="e.g. १८ वर्षांचा अनुभव" />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label"><span className="label-text">Bio / Description</span></label>
                        <textarea className="textarea textarea-bordered w-full" value={formData.bio}
                            onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Brief biography..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Email</span></label>
                            <input type="email" className="input input-bordered" value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@example.com" />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">Image</span></label>
                            <div className="flex gap-2">
                                <input type="text" className="input input-bordered grow" value={formData.image} readOnly />
                                <label className="btn btn-square btn-outline">
                                    <Upload size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="form-control flex flex-col">
                            <label className="label"><span className="label-text">Password</span></label>
                            <input type="password" className="input input-bordered w-full" value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password..." />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Twitter (URL)</span></label>
                            <input type="text" className="input input-bordered" value={formData.twitter}
                                onChange={e => setFormData({ ...formData, twitter: e.target.value })} placeholder="https://twitter.com/..." />
                        </div>
                        <div className="form-control">
                            <label className="label"><span className="label-text">LinkedIn (URL)</span></label>
                            <input type="text" className="input input-bordered" value={formData.linkedin}
                                onChange={e => setFormData({ ...formData, linkedin: e.target.value })} placeholder="https://linkedin.com/..." />
                        </div>
                    </div>

                    <div className="form-control w-fit">
                        <label className="label cursor-pointer gap-4">
                            <span className="label-text">Active Status</span>
                            <input type="checkbox" className="toggle toggle-primary" checked={formData.isActive}
                                onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                        </label>
                    </div>

                    <div className="modal-action">
                        <button type="button" onClick={onClose} className="btn">Cancel</button>
                        <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                            {author ? 'Update Author' : 'Create Author'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
