"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Save, X } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import ImageSelector from '@/components/admin/ImageSelector'
import Link from 'next/link'
import { Button, Select } from '@headlessui/react'

const today = new Date().toISOString().slice(0, 10)

const initialValues = {
    newsType: 'Image',
    ownerType: 'ADMIN',
    categoryId: '',
    districtId: '',
    subdivisionId: '',
    tehsilId: '',
    language: 'Marathi',
    title: '',
    summary: '',
    description: '',
    featuredImage: '',
    galleryImage: '',
    newsUrl: '',
    publishedDate: today,
    tags: [],
    sendNotification: false,
    isActive: true
}

const validationSchema = Yup.object({
    title: Yup.string().required('News title is required'),
    categoryId: Yup.string().required('Category is required'),
    districtId: Yup.string().required('District is required'),
    description: Yup.string().required('Description is required'),
    newsUrl: Yup.string().url('Invalid URL format'),
})

function normalizeDate(value) {
    if (!value) return today
    return new Date(value).toISOString().slice(0, 10)
}

export default function NewsFormScreen({ mode = 'add', newsId }) {
    const router = useRouter()
    const [categories, setCategories] = useState([])
    const [locations, setLocations] = useState({
        districts: [],
        subdivisions: [],
        tehsils: []
    })

    const [loading, setLoading] = useState(mode === 'edit')
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [pendingFiles, setPendingFiles] = useState({
        featuredImage: null,
        galleryImage: null
    })

    const [formValues, setFormValues] = useState(initialValues)

    const fetchOptions = async () => {
        try {
            const [categoryResponse, locationResponse] = await Promise.all([
                axios.get('/api/admin/categories?limit=1000'),
                axios.get('/api/admin/locations')
            ])

            if (categoryResponse.data.success) {
                setCategories(categoryResponse.data.data || [])
            }

            if (locationResponse.data.success) {
                setLocations(locationResponse.data.data || {
                    districts: [],
                    subdivisions: [],
                    tehsils: []
                })
            }
        } catch {
            toast.error('Failed to load form options')
        }
    }

    const fetchNews = async () => {
        if (mode !== 'edit' || !newsId) return
        try {
            setLoading(true)
            const response = await axios.get(`/api/admin/news?id=${newsId}`)
            if (response.data.success) {
                const item = response.data.data
                setFormValues({
                    newsType: item.newsType || 'Image',
                    ownerType: item.ownerType || 'ADMIN',
                    categoryId: item.categoryId ? String(item.categoryId) : '',
                    districtId: item.districtId ? String(item.districtId) : '',
                    subdivisionId: item.subdivisionId ? String(item.subdivisionId) : '',
                    tehsilId: item.tehsilId ? String(item.tehsilId) : '',
                    language: item.language || 'Marathi',
                    title: item.title || '',
                    summary: item.summary || '',
                    description: item.description || '',
                    featuredImage: item.featuredImage || '',
                    galleryImage: item.galleryImage || '',
                    newsUrl: item.newsUrl || '',
                    publishedDate: normalizeDate(item.publishedDate),
                    tags: item.tags ? item.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                    sendNotification: item.sendNotification === true,
                    isActive: item.isActive !== false
                })
            }
        } catch {
            toast.error('Failed to load news')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOptions() }, [])
    useEffect(() => { fetchNews() }, [mode, newsId])

    const uploadFiles = async (files) => {
        if (!files?.length) return []
        try {
            setUploading(true)
            const paths = []
            for (const file of files) {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('folder', 'news')
                const response = await axios.post(
                    '/api/admin/upload',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )
                if (response.data.success) {
                    paths.push(response.data.data.path)
                }
            }
            return paths
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                'Failed to upload image'
            )
            return []
        } finally {
            setUploading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {mode === 'edit' ? 'Edit News' : 'Add News'}
                    </h1>
                </div>

                {loading ? (
                    <div className="p-10 text-center">Loading...</div>
                ) : (
                    <Formik
                        enableReinitialize
                        initialValues={formValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            try {
                                setSaving(true)

                                let featuredImage = values.featuredImage
                                let galleryImage = values.galleryImage

                                if (pendingFiles.featuredImage) {
                                    const uploaded = await uploadFiles([pendingFiles.featuredImage])
                                    if (uploaded.length) { featuredImage = uploaded[0] }
                                }

                                if (pendingFiles.galleryImage) {
                                    const uploaded = await uploadFiles([pendingFiles.galleryImage])
                                    if (uploaded.length) { galleryImage = uploaded[0] }
                                }

                                const payload = {
                                    ...values,
                                    featuredImage,
                                    galleryImage,
                                    tags: Array.isArray(values.tags) ? values.tags.join(',') : values.tags,
                                    categoryId: values.categoryId || null,
                                    districtId: values.districtId || null,
                                    subdivisionId: values.subdivisionId || null,
                                    tehsilId: values.tehsilId || null
                                }

                                const response = mode === 'edit'
                                    ? await axios.put('/api/admin/news', { ...payload, id: newsId })
                                    : await axios.post('/api/admin/news', payload)

                                if (response.data.success) {
                                    toast.success(
                                        mode === 'edit'
                                            ? 'News updated successfully'
                                            : 'News created successfully'
                                    )

                                    router.push('/admin/news')
                                }
                            } catch (error) {
                                toast.error(error.response?.data?.error || 'Failed to save news')
                            } finally {
                                setSaving(false)
                            }
                        }}
                    >
                        {({ values, errors, touched, setFieldValue }) => {
                            const filteredSubdivisions = useMemo(() => {
                                if (!values.districtId) {
                                    return locations.subdivisions
                                }

                                return locations.subdivisions.filter(
                                    (item) =>
                                        String(item.districtId || '') ===
                                        String(values.districtId)
                                )
                            }, [values.districtId])

                            const filteredTehsils = useMemo(() => {
                                return locations.tehsils.filter((item) => {
                                    const districtMatches =
                                        !values.districtId ||
                                        String(item.districtId || '') ===
                                        String(values.districtId)

                                    const subdivisionMatches =
                                        !values.subdivisionId ||
                                        String(item.subdivisionId || '') ===
                                        String(values.subdivisionId)

                                    return districtMatches && subdivisionMatches
                                })
                            }, [values.districtId, values.subdivisionId])

                            return (
                                <Form className="space-y-6 p-6">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        <FormField label="News Type">
                                            <Field as="select" name="newsType" className="admin-input">
                                                <option value="Image">Image</option>
                                                <option value="Video">Video</option>
                                            </Field>
                                        </FormField>
                                        <FormField label="Language">
                                            <Field name="language" className="admin-input" />
                                        </FormField>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                        <FormField label="Category">
                                            <Field as="select" name="categoryId" className="admin-input">
                                                <option value="">Select</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            {errors.categoryId && touched.categoryId && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.categoryId}
                                                </p>
                                            )}
                                        </FormField>

                                        <FormField label="District">
                                            <Field
                                                as="select"
                                                name="districtId"
                                                className="admin-input"
                                                onChange={(e) => {
                                                    setFieldValue('districtId', e.target.value)
                                                    setFieldValue('subdivisionId', '')
                                                    setFieldValue('tehsilId', '')
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {locations.districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            {errors.districtId && touched.districtId && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.districtId}
                                                </p>
                                            )}
                                        </FormField>

                                        <FormField label="Subdivision">
                                            <Field
                                                as="select"
                                                name="subdivisionId"
                                                className="admin-input"
                                                onChange={(e) => {
                                                    setFieldValue('subdivisionId', e.target.value)
                                                    setFieldValue('tehsilId', '')
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {filteredSubdivisions.map((subdivision) => (
                                                    <option key={subdivision.id} value={subdivision.id}>
                                                        {subdivision.name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormField>

                                        <FormField label="Tehsil">
                                            <Field as="select" name="tehsilId" className="admin-input">
                                                <option value="">Select</option>
                                                {filteredTehsils.map((tehsil) => (
                                                    <option key={tehsil.id} value={tehsil.id}>
                                                        {tehsil.name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormField>
                                    </div>

                                    <FormField label="News Title">
                                        <Field name="title" className="admin-input" />
                                        {errors.title && touched.title && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.title}
                                            </p>
                                        )}
                                    </FormField>

                                    <FormField label="Summary">
                                        <Field
                                            as="textarea"
                                            rows={5}
                                            name="summary"
                                            className="admin-input"
                                        />
                                    </FormField>

                                    <FormField label="Description">
                                        <Field
                                            as="textarea"
                                            rows={8}
                                            name="description"
                                            className="admin-input"
                                        />
                                        {errors.description && touched.description && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.description}
                                            </p>
                                        )}
                                    </FormField>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField label="Featured Image">
                                            <ImageSelector
                                                images={
                                                    pendingFiles.featuredImage
                                                        ? [URL.createObjectURL(pendingFiles.featuredImage)]
                                                        : (values.featuredImage ? [values.featuredImage] : [])
                                                }
                                                uploading={uploading}
                                                type="featured"
                                                onUpload={(files) => {
                                                    setPendingFiles((prev) => ({
                                                        ...prev,
                                                        featuredImage: files[0]
                                                    }))
                                                }}
                                                onRemove={() => {
                                                    setPendingFiles((prev) => ({
                                                        ...prev,
                                                        featuredImage: null
                                                    }))
                                                    setFieldValue('featuredImage', '')
                                                }}
                                            />
                                        </FormField>

                                        <FormField label="Gallery Image">
                                            <ImageSelector
                                                images={
                                                    pendingFiles.galleryImage
                                                        ? [URL.createObjectURL(pendingFiles.galleryImage)]
                                                        : (values.galleryImage ? [values.galleryImage] : [])
                                                }
                                                uploading={uploading}
                                                type="featured"
                                                onUpload={(files) => {
                                                    setPendingFiles((prev) => ({
                                                        ...prev,
                                                        galleryImage: files[0]
                                                    }))
                                                }}
                                                onRemove={() => {
                                                    setPendingFiles((prev) => ({
                                                        ...prev,
                                                        galleryImage: null
                                                    }))
                                                    setFieldValue('galleryImage', '')
                                                }}
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField label="News URL">
                                            <Field name="newsUrl" className="admin-input" />
                                            {errors.newsUrl && touched.newsUrl && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.newsUrl}
                                                </p>
                                            )}
                                        </FormField>

                                        <FormField label="Published Date">
                                            <Field
                                                type="date"
                                                name="publishedDate"
                                                className="admin-input"
                                            />
                                        </FormField>
                                    </div>

                                    <FormField label="Tags">
                                        <TagInput 
                                            value={values.tags} 
                                            onChange={(tags) => setFieldValue('tags', tags)}
                                        />
                                    </FormField>

                                    <div className="flex flex-wrap gap-6">
                                        <label className="flex items-center gap-2">
                                            <Field type="checkbox" name="sendNotification" />
                                            Send Notification
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <Field type="checkbox" name="isActive" />
                                            Active
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4 border-t border-slate-200 pt-5">
                                        <Link href="/admin/news">
                                            <Button
                                                type="button"
                                                className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium hover:bg-slate-50"
                                            >
                                                Cancel
                                            </Button>
                                        </Link>

                                        <Button
                                            type="submit"
                                            disabled={saving || uploading}
                                            className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
                                        >
                                            <Save size={16} />
                                            {saving ? 'Saving...' : 'Save News'}
                                        </Button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                )}
            </div>
            <style jsx global>{` .admin-input { width: 100%; border-radius: 0.5rem; border: 1px solid rgb(203 213 225); padding: 0.75rem 1rem; font-size: 0.875rem; outline: none; transition: all 0.2s ease; } .admin-input:focus { border-color: rgb(219 39 119); box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.1); } `}</style>
        </AdminLayout>
    )
}

function FormField({ label, children }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            {children}
        </div>
    )
}

function TagInput({ value = [], onChange }) {
    const [input, setInput] = useState('')

    const handleAddTag = () => {
        const tag = input.trim()
        if (tag && !value.includes(tag)) {
            onChange([...value, tag])
            setInput('')
        }
    }

    const handleRemoveTag = (index) => {
        onChange(value.filter((_, i) => i !== index))
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            handleAddTag()
        }
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type tag and press Enter or comma"
                    className="admin-input flex-1"
                />
                <button
                    type="button"
                    onClick={handleAddTag}
                    className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700"
                >
                    Add
                </button>
            </div>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((tag, index) => (
                        <div
                            key={index}
                            className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-700"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(index)}
                                className="hover:text-pink-900"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}