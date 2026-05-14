"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Save, X } from 'lucide-react'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import ImageSelector from '@/components/admin/ImageSelector'
import TiptapEditor from '@/components/admin/TiptapEditor'
import Link from 'next/link'
import axiosInstance from '@/lib/axios'
import Select from 'react-select'

const today = new Date().toISOString().slice(0, 10)

function normalizeDateTime(value) {
    if (!value) {
        const d = new Date()
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
        return d.toISOString().slice(0, 16)
    }
    const d = new Date(value)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
}

const initialValues = {
    newsType: 'Image',
    ownerType: 'ADMIN',
    categoryIds: [],
    districtId: '',
    subdivisionId: '',
    tehsilId: '',
    language: 'Marathi',
    title: '',
    summary: '',
    description: '',
    featuredImage: '',
    galleryImages: [],
    newsUrl: '',
    videoId: '',
    videoUrl: '',
    publishedDate: today,
    createdAt: normalizeDateTime(new Date()),
    priority: 'Normal',
    tags: [],
    sendNotification: false,
    isActive: true
}

const validationSchema = Yup.object({
    title: Yup.string().required('News title is required'),
    categoryIds: Yup.array()
        .min(1, 'Please select at least one category')
        .required('Required'),
    districtId: Yup.string().required('District is required'),
    description: Yup.string().required('Description is required'),
    newsUrl: Yup.string().required('Invalid URL format'),
})

function normalizeDate(value) {
    if (!value) return today
    return new Date(value).toISOString().slice(0, 10)
}

export default function NewsFormScreen({ mode = 'add', newsId }) {
    const router = useRouter()
    const [categories, setCategories] = useState([])
    const [districts, setDistricts] = useState([])
    const [subdivisions, setSubdivisions] = useState([])
    const [tehsils, setTehsils] = useState([])

    const [loading, setLoading] = useState(mode === 'edit')
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [pendingFiles, setPendingFiles] = useState({
        featuredImage: null,
        galleryImages: []
    })

    const [formValues, setFormValues] = useState(initialValues)

    const fetchOptions = async () => {
        try {
            const [categoryResponse, districtResponse, subdivisionResponse, tehsilResponse] = await Promise.all([
                axiosInstance.get('/admin/categories', { params: { isActive: true, limit: 1000 } }),
                axiosInstance.get('/admin/districts', { params: { isActive: true, limit: 1000 } }),
                axiosInstance.get('/admin/subdivisions', { params: { isActive: true, limit: 1000 } }),
                axiosInstance.get('/admin/tehsils', { params: { isActive: true, limit: 1000 } })
            ])

            if (categoryResponse.data.success) {
                setCategories(categoryResponse.data.data || [])
            }

            if (districtResponse.data.success) {
                setDistricts(districtResponse.data.data || [])
            }

            if (subdivisionResponse.data.success) {
                setSubdivisions(subdivisionResponse.data.data || [])
            }

            if (tehsilResponse.data.success) {
                setTehsils(tehsilResponse.data.data || [])
            }
        } catch {
            toast.error('Failed to load form options')
        }
    }

    const fetchNews = async () => {
        if (mode !== 'edit' || !newsId) return
        try {
            setLoading(true)
            const response = await axiosInstance.get(`/admin/news?id=${newsId}`)
            if (response.data.success) {
                const item = response.data.data
                
                // Parse categoryIds - handle both array and comma-separated string
                let parsedCategoryIds = []
                if (item.categoryIds) {
                    if (Array.isArray(item.categoryIds)) {
                        parsedCategoryIds = item.categoryIds.map(id => Number(id))
                    } else if (typeof item.categoryIds === 'string') {
                        parsedCategoryIds = item.categoryIds
                            .split(',')
                            .map(id => Number(id.trim()))
                            .filter(id => !isNaN(id))
                    }
                }
                
                setFormValues({
                    newsType: item.newsType || 'Image',
                    ownerType: item.ownerType || 'ADMIN',
                    categoryIds: parsedCategoryIds,
                    districtId: item.districtId ? String(item.districtId) : '',
                    subdivisionId: item.subdivisionId ? String(item.subdivisionId) : '',
                    tehsilId: item.tehsilId ? String(item.tehsilId) : '',
                    language: item.language || 'Marathi',
                    title: item.title || '',
                    summary: item.summary || '',
                    description: item.description || '',
                    featuredImage: item.featuredImage || '',
                    galleryImages: item.galleryImages ? item.galleryImages.map(img => img.imageUrl) : [],
                    newsUrl: item.newsUrl || '',
                    videoId: item.videoId || '',
                    videoUrl: item.videoUrl || '',
                    publishedDate: normalizeDate(item.publishedDate),
                    createdAt: normalizeDateTime(item.createdAt),
                    priority: item.isBreakingNews ? 'Breaking' :
                        item.isTrendingNews ? 'Trending' :
                            item.isMiniTrendingNews ? 'Mini_Trending' : 'Normal',
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
                const response = await axiosInstance.post(
                    '/admin/upload',
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
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
            <div className="rounded-xl border border-base-200 bg-base-100 shadow-sm">
                <div className="border-b border-base-200 p-4">
                    <h1 className="text-xl font-bold text-base-content">
                        {mode === 'edit' ? 'Edit News' : 'Add News'}
                    </h1>
                </div>

                {loading ? (
                    <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>
                ) : (
                    <Formik
                        enableReinitialize
                        initialValues={formValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            try {
                                setSaving(true)

                                let featuredImage = values.featuredImage
                                let galleryImages = [...(values.galleryImages || [])]

                                if (pendingFiles.featuredImage) {
                                    const uploaded = await uploadFiles([pendingFiles.featuredImage])
                                    if (uploaded.length) { featuredImage = uploaded[0] }
                                }

                                if (pendingFiles.galleryImages && pendingFiles.galleryImages.length > 0) {
                                    const uploaded = await uploadFiles(pendingFiles.galleryImages)
                                    if (uploaded.length) {
                                        galleryImages = [...galleryImages, ...uploaded]
                                    }
                                }

                                const payload = {
                                    ...values,
                                    featuredImage,
                                    galleryImages,
                                    createdAt: values.createdAt ? new Date(values.createdAt).toISOString() : null,
                                    tags: Array.isArray(values.tags) ? values.tags.join(',') : values.tags,
                                    categoryIds: Array.isArray(values.categoryIds) 
                                        ? values.categoryIds.map(id => Number(id))
                                        : [],
                                    districtId: values.districtId ? Number(values.districtId) : null,
                                    subdivisionId: values.subdivisionId ? Number(values.subdivisionId) : null,
                                    tehsilId: values.tehsilId ? Number(values.tehsilId) : null
                                }

                                const response = mode === 'edit'
                                    ? await axiosInstance.put('/admin/news', { ...payload, id: newsId })
                                    : await axiosInstance.post('/admin/news', payload)

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
                            // Fetch subdivisions when district changes
                            useEffect(() => {
                                if (values.districtId) {
                                    axiosInstance.get(
                                        `/admin/subdivisions`,
                                        {
                                            params: {
                                                limit: 1000,
                                                isActive: true,
                                                districtId: values.districtId
                                            }
                                        }
                                    ).then(res => {
                                        if (res.data.success) setSubdivisions(res.data.data || [])
                                    }).catch(() => toast.error('Failed to load subdivisions'))
                                } else {
                                    setSubdivisions([])
                                }
                            }, [values.districtId])

                            // Fetch tehsils when subdivision changes
                            useEffect(() => {
                                if (values.subdivisionId) {
                                    axiosInstance.get(
                                        `/admin/tehsils`,
                                        {
                                            params: {
                                                limit: 1000,
                                                isActive: true,
                                                subdivisionId: values.subdivisionId
                                            }
                                        }
                                    ).then(res => {
                                        if (res.data.success) setTehsils(res.data.data || [])
                                    }).catch(() => toast.error('Failed to load tehsils'))
                                } else {
                                    setTehsils([])
                                }
                            }, [values.subdivisionId])

                            return (
                                <Form className="space-y-4 px-6 pb-6 pt-3">
                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        <FormField label="News Type">
                                            <Field as="select" name="newsType" className="select select-bordered w-full">
                                                <option value="Image">Image</option>
                                                <option value="Video">Video</option>
                                            </Field>
                                        </FormField>

                                        <FormField label="Language">
                                            <Field name="language" className="input input-bordered w-full" />
                                        </FormField>

                                        <FormField
                                            label="Categories"
                                            error={errors.categoryIds && touched.categoryIds ? errors.categoryIds : null}
                                        >
                                            <Select
                                                isMulti
                                                name="categoryIds"
                                                options={categories.map((category) => ({
                                                    value: Number(category.id),
                                                    label: category.name,
                                                }))}
                                                value={values.categoryIds?.map((categoryId) => {
                                                    const category = categories.find((c) => Number(c.id) === categoryId)
                                                    if (!category) return null
                                                    return {
                                                        value: categoryId,
                                                        label: category?.name || ""
                                                    }
                                                }) || []}
                                                onChange={(selectedOptions) => {
                                                    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : []
                                                    setFieldValue('categoryIds', selectedValues)
                                                }}
                                                classNamePrefix="react-select"
                                                placeholder="Select Categories"
                                                isClearable
                                            />
                                        </FormField>

                                        <FormField
                                            label="District"
                                            error={errors.districtId && touched.districtId ? errors.districtId : null}
                                        >
                                            <Field
                                                as="select"
                                                name="districtId"
                                                className={`select select-bordered w-full ${errors.districtId && touched.districtId ? 'select-error' : ''}`}
                                                onChange={(e) => {
                                                    setFieldValue('districtId', e.target.value)
                                                    setFieldValue('subdivisionId', '')
                                                    setFieldValue('tehsilId', '')
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormField>

                                        <FormField label="Subdivision">
                                            <Field
                                                as="select"
                                                name="subdivisionId"
                                                disabled={!values.districtId}
                                                className="select select-bordered w-full"
                                                onChange={(e) => {
                                                    setFieldValue('subdivisionId', e.target.value)
                                                    setFieldValue('tehsilId', '')
                                                }}
                                            >
                                                <option value="">Select</option>
                                                {subdivisions.map((subdivision) => (
                                                    <option key={subdivision.id} value={subdivision.id}>
                                                        {subdivision.name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormField>

                                        <FormField label="Tehsil">
                                            <Field
                                                as="select"
                                                name="tehsilId"
                                                disabled={!values.subdivisionId}
                                                className="select select-bordered w-full"
                                            >
                                                <option value="">Select</option>
                                                {tehsils.map((tehsil) => (
                                                    <option key={tehsil.id} value={tehsil.id}>
                                                        {tehsil.name}
                                                    </option>
                                                ))}
                                            </Field>
                                        </FormField>
                                    </div>

                                    <FormField label="Priority">
                                        <div className="flex flex-wrap items-center h-12 gap-4">
                                            {['Normal', 'Breaking', 'Trending', 'Mini_Trending'].map(p => (
                                                <label
                                                    key={p}
                                                    className="label cursor-pointer gap-2 p-0"
                                                >
                                                    <Field
                                                        type="radio"
                                                        name="priority"
                                                        value={p}
                                                        className="radio radio-primary radio-sm"
                                                    />
                                                    <span className="label-text">{p.replace('_', ' ')}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </FormField>

                                    <FormField
                                        label="News Title"
                                        error={errors.title && touched.title ? errors.title : null}
                                    >
                                        <Field
                                            name="title"
                                            className={`input input-bordered w-full ${errors.title && touched.title ? 'input-error' : ''}`}
                                        />
                                    </FormField>

                                    <FormField label="Summary">
                                        <TiptapEditor
                                            value={values.summary}
                                            onChange={(html) => setFieldValue('summary', html)}
                                            placeholder="Write a brief summary of the news..."
                                            minHeight="200px"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Description"
                                        error={errors.description && touched.description ? errors.description : null}
                                    >
                                        <TiptapEditor
                                            value={values.description}
                                            onChange={(html) => setFieldValue('description', html)}
                                            error={errors.description && touched.description ? errors.description : null}
                                            placeholder="Write a detailed description of the news..."
                                            minHeight="300px"
                                        />
                                    </FormField>

                                    <div className='space-y-4'>
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

                                        <FormField label="Gallery Images">
                                            <ImageSelector
                                                images={[
                                                    ...(values.galleryImages || []),
                                                    ...(pendingFiles.galleryImages || []).map(f => URL.createObjectURL(f))
                                                ]}
                                                uploading={uploading}
                                                type="gallery"
                                                maxImages={10}
                                                onUpload={(files) => {
                                                    setPendingFiles((prev) => ({
                                                        ...prev,
                                                        galleryImages: [...prev.galleryImages, ...files]
                                                    }))
                                                }}
                                                onRemove={(index) => {
                                                    const existingCount = values.galleryImages?.length || 0
                                                    if (index < existingCount) {
                                                        // Removing an already uploaded image
                                                        const newValues = [...values.galleryImages]
                                                        newValues.splice(index, 1)
                                                        setFieldValue('galleryImages', newValues)
                                                    } else {
                                                        // Removing a pending image
                                                        const pendingIndex = index - existingCount
                                                        setPendingFiles((prev) => {
                                                            const newPending = [...prev.galleryImages]
                                                            newPending.splice(pendingIndex, 1)
                                                            return { ...prev, galleryImages: newPending }
                                                        })
                                                    }
                                                }}
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                        <FormField label="News URL" error={errors.newsUrl && touched.newsUrl ? errors.newsUrl : null}>
                                            <Field name="newsUrl" className={`input input-bordered w-full ${errors.newsUrl && touched.newsUrl ? 'input-error' : ''}`} />
                                        </FormField>

                                        {values.newsType === 'Video' && (
                                            <>
                                                <FormField label="Video ID">
                                                    <Field name="videoId" className="input input-bordered w-full" />
                                                </FormField>
                                                <FormField label="Video URL">
                                                    <Field name="videoUrl" className="input input-bordered w-full" />
                                                </FormField>
                                            </>
                                        )}

                                        <FormField label="Published Date">
                                            <Field
                                                type="date"
                                                name="publishedDate"
                                                className="input input-bordered w-full"
                                            />
                                        </FormField>

                                        <FormField label="Created At">
                                            <Field
                                                type="datetime-local"
                                                name="createdAt"
                                                className="input input-bordered w-full"
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
                                        <label className="label cursor-pointer gap-2">
                                            <Field type="checkbox" name="sendNotification" className="checkbox checkbox-primary" />
                                            <span className="label-text">Send Notification</span>
                                        </label>

                                        <label className="label cursor-pointer gap-2">
                                            <Field type="checkbox" name="isActive" className="checkbox checkbox-primary" />
                                            <span className="label-text">Active</span>
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-4 border-t border-base-200 pt-5">
                                        <Link href="/admin/news">
                                            <button
                                                type="button"
                                                className="btn btn-ghost"
                                            >
                                                Cancel
                                            </button>
                                        </Link>

                                        <button
                                            type="submit"
                                            disabled={saving || uploading}
                                            className="btn btn-primary gap-2"
                                        >
                                            <Save size={16} />
                                            {saving ? 'Saving...' : 'Save News'}
                                        </button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                )}
            </div>
        </AdminLayout>
    )
}

function FormField({ label, error, children }) {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-medium text-base-content/80">{label}</span>
            </label>
            {children}
            {error && (
                <label className="label pt-1 pb-0">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
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
                    className="input input-bordered flex-1"
                />
                <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn btn-primary"
                >
                    Add
                </button>
            </div>

            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((tag, index) => (
                        <div
                            key={index}
                            className="badge badge-primary gap-1 p-3"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(index)}
                                className="btn btn-ghost btn-xs btn-circle text-primary-content hover:bg-primary-content/20"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}