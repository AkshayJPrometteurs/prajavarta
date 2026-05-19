"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/lib/axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import ImageSelector from '@/components/ImageSelector'

export default function AuthorProfileScreen() {
    const router = useRouter()
    const [form, setForm] = useState({
        name: '',
        nameEnglish: '',
        email: '',
        designation: '',
        experience: '',
        bio: '',
        twitter: '',
        linkedin: '',
        currentPassword: '',
        newPassword: ''
    })
    const [imagePreview, setImagePreview] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/author/auth/profile')
                const user = response?.data?.user || null
                if (user) {
                    setForm((prev) => ({
                        ...prev,
                        name: user?.name || '',
                        nameEnglish: user?.nameEnglish || '',
                        email: user?.email || '',
                        designation: user?.designation || '',
                        experience: user?.experience || '',
                        bio: user?.bio || '',
                        twitter: user?.twitter || '',
                        linkedin: user?.linkedin || ''
                    }))
                    setImagePreview(user?.image || '')
                } else {
                    toast.error(response?.data?.error || 'Unable to load profile')
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    router.push('/author/login')
                } else {
                    toast.error('Unable to load profile')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [router])

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')

        if (!form.name.trim() || !form.email.trim()) {
            setError('Please provide both name and email.')
            return
        }

        if (form.newPassword && form.newPassword.length < 6) {
            setError('New password must be at least 6 characters long.')
            return
        }

        if (form.newPassword && !form.currentPassword) {
            setError('Current password is required to update your password.')
            return
        }

        setSaving(true)
        try {
            const response = await axiosInstance.patch('/author/auth/profile', {
                name: form.name,
                nameEnglish: form.nameEnglish,
                email: form.email,
                designation: form.designation,
                experience: form.experience,
                bio: form.bio,
                twitter: form.twitter,
                linkedin: form.linkedin,
                image: imagePreview,
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            })

            if (response.data.success) {
                toast.success('Profile updated successfully.')
                setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }))
                setImagePreview(response.data.user?.image || imagePreview)
            } else {
                setError(response.data.error || 'Unable to update profile')
            }
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error)
            } else {
                setError('Unable to update profile')
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900">Author Profile</h1>
                            <p className="text-sm text-slate-500">Update your author information and password.</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-slate-700">Profile Image</label>
                        <ImageSelector
                            images={imagePreview ? [imagePreview] : []}
                            type="featured"
                            onUpload={async (files) => {
                                const file = Array.isArray(files) ? files[0] : files
                                if (!file) return
                                try {
                                    setUploadingImage(true)
                                    const fd = new FormData()
                                    fd.append('file', file)
                                    const uploadRes = await axiosInstance.post('/author/upload', fd, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                    })
                                    if (uploadRes.data?.success) {
                                        setImagePreview(uploadRes.data.imageUrl)
                                    } else {
                                        toast.error(uploadRes.data?.error || 'Image upload failed')
                                    }
                                } catch (err) {
                                    toast.error('Image upload failed')
                                } finally {
                                    setUploadingImage(false)
                                }
                            }}
                            uploading={uploadingImage}
                        />
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="grid gap-6 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                        required
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Name (English)</span>
                                    <input
                                        type="text"
                                        value={form.nameEnglish}
                                        onChange={(e) => handleChange('nameEnglish', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                        required
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Designation</span>
                                    <input
                                        type="text"
                                        value={form.designation}
                                        onChange={(e) => handleChange('designation', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Experience</span>
                                    <input
                                        type="text"
                                        value={form.experience}
                                        onChange={(e) => handleChange('experience', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Twitter</span>
                                    <input
                                        type="text"
                                        value={form.twitter}
                                        onChange={(e) => handleChange('twitter', e.target.value)}
                                        placeholder="https://twitter.com/username"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">LinkedIn</span>
                                    <input
                                        type="text"
                                        value={form.linkedin}
                                        onChange={(e) => handleChange('linkedin', e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Bio</span>
                                    <textarea
                                        value={form.bio}
                                        onChange={(e) => handleChange('bio', e.target.value)}
                                        rows={4}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                    />
                                </label>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">Current password</span>
                                    <input
                                        type="password"
                                        value={form.currentPassword}
                                        onChange={(e) => handleChange('currentPassword', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                        placeholder="Enter current password when changing password"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">New password</span>
                                    <input
                                        type="password"
                                        value={form.newPassword}
                                        onChange={(e) => handleChange('newPassword', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                        placeholder="Leave blank to keep current password"
                                    />
                                </label>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">Leave the password fields blank if you do not want to change your password.</p>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? 'Saving...' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
