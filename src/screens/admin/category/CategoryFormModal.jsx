"use client"

import { useState, useEffect, useRef } from 'react'
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
    const dialogRef = useRef(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (isOpen) dialog.showModal()
        else dialog.close()
    }, [isOpen])

    useEffect(() => {
        if (isOpen) setImagePreview(category?.image || null)
        else setImagePreview(null)
    }, [isOpen, category])

    const handleImageChange = async (e, setFieldValue) => {
        const file = e.target.files[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file'); return }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image size should be less than 5MB'); return }
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result)
        reader.readAsDataURL(file)
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        try {
            const uploadResponse = await axios.post('/api/admin/upload', formDataUpload, { headers: { 'Content-Type': 'multipart/form-data' } })
            if (uploadResponse.data.success) { setFieldValue('image', uploadResponse.data.data.path); toast.success('Image uploaded successfully') }
            else toast.error(uploadResponse.data.error || 'Image upload failed')
        } catch (uploadError) {
            toast.error(uploadError.response?.data?.error || 'Failed to upload image')
        }
    }

    return (
        <dialog ref={dialogRef} className="modal" onClose={onClose}>
            <div className="modal-box w-full max-w-lg">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{category ? 'Edit Category' : 'Add Category'}</h3>
                    <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
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
                                const res = await axios.put('/api/admin/categories', payload)
                                if (res.data.success) { toast.success('Category updated successfully'); onSubmit() }
                                else toast.error(res.data.error || 'Failed to update category')
                            } else {
                                const res = await axios.post('/api/admin/categories', payload)
                                if (res.data.success) { toast.success('Category created successfully'); onSubmit() }
                                else toast.error(res.data.error || 'Failed to create category')
                            }
                        } catch (err) {
                            toast.error(err.response?.data?.error || 'An error occurred')
                        } finally { setLoading(false); setSubmitting(false) }
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Category Name Marathi <span className="text-error">*</span></span></label>
                                <Field name="name" type="text" placeholder="Enter Marathi category name" className="input input-bordered w-full" />
                                <ErrorMessage name="name" component="div" className="text-error text-sm mt-1" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Category Name English <span className="text-error">*</span></span></label>
                                <Field name="nameEnglish" type="text" placeholder="Enter English category name" className="input input-bordered w-full" />
                                <ErrorMessage name="nameEnglish" component="div" className="text-error text-sm mt-1" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Description</span></label>
                                <Field as="textarea" name="description" placeholder="Enter category description" rows="3" className="textarea textarea-bordered w-full" />
                                <ErrorMessage name="description" component="div" className="text-error text-sm mt-1" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Select Image <span className="text-xs text-base-content/50">(Recommended: 250x150)</span></span></label>
                                <div className="rounded-lg border-2 border-dashed border-base-300 p-6">
                                    {imagePreview ? (
                                        <div className="space-y-3">
                                            <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                                            <label className="btn btn-ghost btn-sm w-full">
                                                <Upload size={16} /> Change Image
                                                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setFieldValue)} className="hidden" />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="flex cursor-pointer flex-col items-center justify-center gap-2">
                                            <Upload size={32} className="text-base-content/40" />
                                            <span className="text-sm font-medium">Click to upload image</span>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setFieldValue)} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Sequence No.</span></label>
                                <Field name="sortOrder" type="number" placeholder="1" className="input input-bordered w-full" />
                                <ErrorMessage name="sortOrder" component="div" className="text-error text-sm mt-1" />
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input type="checkbox" id="isActive" checked={values.isActive} onChange={(e) => setFieldValue('isActive', e.target.checked)} className="checkbox checkbox-primary" />
                                    <span className="label-text font-medium">Active</span>
                                </label>
                            </div>

                            <div className="modal-action">
                                <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                                <button type="submit" disabled={loading || isSubmitting} className="btn btn-primary">
                                    {loading || isSubmitting ? <span className="loading loading-spinner loading-sm" /> : null}
                                    {loading || isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    )
}
