"use client"

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
    name: Yup.string().trim().required('Marathi category name is required'),
    nameEnglish: Yup.string().trim().required('English category name is required'),
    description: Yup.string().trim(),
    sortOrder: Yup.number()
        .typeError('Sequence must be a number')
        .integer('Sequence must be a whole number')
        .min(1, 'Sequence must be at least 1')
        .required('Sequence number is required'),
    isActive: Yup.boolean()
})

export default function CategoryFormModal({ isOpen, onClose, category, onSubmit }) {
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setImagePreview(category?.image || null)
        } else {
            setImagePreview(null)
        }
    }, [isOpen, category])

    const handleImageChange = async (e, setFieldValue) => {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)

        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        try {
            const uploadResponse = await axios.post('/api/admin/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (uploadResponse.data.success) {
                setFieldValue('image', uploadResponse.data.data.path)
                toast.success('Image uploaded successfully')
            } else {
                toast.error(uploadResponse.data.error || 'Image upload failed')
            }
        } catch (uploadError) {
            console.error('Image upload error:', uploadError)
            toast.error(uploadError.response?.data?.error || 'Failed to upload image')
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all">
                                <div className="mb-6 flex items-center justify-between">
                                    <Dialog.Title className="text-2xl font-bold text-slate-900">
                                        {category ? 'Edit Category' : 'Add Category'}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-md text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        name: category?.name || '',
                                        nameEnglish: category?.nameEnglish || '',
                                        description: category?.description || '',
                                        image: category?.image || null,
                                        sortOrder: category?.sortOrder?.toString() || '0',
                                        isActive: category?.isActive ?? true
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        setSubmitting(true)
                                        setLoading(true)

                                        const payload = {
                                            name: values.name.trim(),
                                            nameEnglish: values.nameEnglish.trim(),
                                            description: values.description.trim() || null,
                                            image: values.image || null,
                                            isActive: values.isActive,
                                            sortOrder: parseInt(values.sortOrder, 10) || 0
                                        }

                                        try {
                                            if (category) {
                                                payload.id = category.id
                                                const response = await axios.put('/api/admin/categories', payload)
                                                if (response.data.success) {
                                                    toast.success('Category updated successfully')
                                                    onSubmit()
                                                } else {
                                                    toast.error(response.data.error || 'Failed to update category')
                                                }
                                            } else {
                                                const response = await axios.post('/api/admin/categories', payload)
                                                if (response.data.success) {
                                                    toast.success('Category created successfully')
                                                    onSubmit()
                                                } else {
                                                    toast.error(response.data.error || 'Failed to create category')
                                                }
                                            }
                                        } catch (err) {
                                            toast.error(err.response?.data?.error || 'An error occurred')
                                        } finally {
                                            setLoading(false)
                                            setSubmitting(false)
                                        }
                                    }}
                                >
                                    {({ values, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                                        <Form className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Category Name Marathi <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    name="name"
                                                    type="text"
                                                    placeholder="Enter Marathi category name"
                                                    className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <ErrorMessage
                                                    name="name"
                                                    component="div"
                                                    className="mt-1 text-sm text-red-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Category Name English <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    name="nameEnglish"
                                                    type="text"
                                                    placeholder="Enter English category name"
                                                    className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <ErrorMessage
                                                    name="nameEnglish"
                                                    component="div"
                                                    className="mt-1 text-sm text-red-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Description
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    placeholder="Enter category description"
                                                    rows="3"
                                                    className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <ErrorMessage
                                                    name="description"
                                                    component="div"
                                                    className="mt-1 text-sm text-red-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Select Image <span className="text-xs text-slate-500">(Recommended: 250x150, 350x210)</span>
                                                </label>
                                                <div className="rounded-lg border-2 border-dashed border-slate-300 p-6">
                                                    {imagePreview ? (
                                                        <div className="space-y-3">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="h-32 w-full object-cover rounded-lg"
                                                            />
                                                            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                                                                <Upload size={16} />
                                                                Change Image
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => handleImageChange(e, setFieldValue)}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <label className="flex cursor-pointer flex-col items-center justify-center gap-2">
                                                            <Upload size={32} className="text-slate-400" />
                                                            <span className="text-sm font-medium text-slate-700">
                                                                Click to upload image
                                                            </span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(e, setFieldValue)}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    Sequence No.
                                                </label>
                                                <Field
                                                    name="sortOrder"
                                                    type="number"
                                                    placeholder="1"
                                                    className="mt-1 w-full rounded-lg text-black border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <ErrorMessage
                                                    name="sortOrder"
                                                    component="div"
                                                    className="mt-1 text-sm text-red-600"
                                                />
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <input
                                                    type="checkbox"
                                                    id="isActive"
                                                    name="isActive"
                                                    checked={values.isActive}
                                                    onChange={(e) => setFieldValue('isActive', e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                                />
                                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                                                    Active
                                                </label>
                                            </div>

                                            <div className="flex gap-3 pt-6">
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={loading || isSubmitting}
                                                    className="flex-1 rounded-lg bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {loading || isSubmitting ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
