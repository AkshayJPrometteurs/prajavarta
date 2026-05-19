"use client"

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
    name: Yup.string().trim(),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').nullable(),
    isActive: Yup.boolean()
})

export default function UserFormModal({ isOpen, onClose, user, onSubmit }) {
    const dialogRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (isOpen) dialog.showModal()
        else dialog.close()
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            setImagePreview(user?.image || null)
            setSelectedFile(null)
        } else {
            setImagePreview(null)
            setSelectedFile(null)
        }
    }, [isOpen, user])

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith && imagePreview.startsWith('blob:')) {
                try { URL.revokeObjectURL(imagePreview) } catch (e) { }
            }
        }
    }, [imagePreview])

    const handleImageChange = (e, setFieldValue) => {
        const file = e.target.files[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file'); return }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image size should be less than 5MB'); return }

        // preview locally and store file to upload on submit
        const url = URL.createObjectURL(file)
        setImagePreview(url)
        setSelectedFile(file)
        // set a temporary value so UI reflects selection
        setFieldValue('image', file.name)
    }

    return (
        <dialog ref={dialogRef} className="modal" onClose={onClose}>
            <div className="modal-box w-full max-w-lg">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{user ? 'Edit User' : 'Add User'}</h3>
                    <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>

                <Formik
                    enableReinitialize
                    initialValues={{
                        name: user?.name || '',
                        email: user?.email || '',
                        password: '',
                        image: user?.image || null,
                        isActive: user?.isActive ?? true
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setLoading(true)
                        setSubmitting(true)
                        try {
                            let imagePath = values.image || null
                            if (selectedFile) {
                                toast.info('Uploading image...')
                                const formData = new FormData()
                                formData.append('file', selectedFile)
                                formData.append('folder', 'users')
                                const uploadRes = await axios.post('/api/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                                if (uploadRes.data.success) imagePath = uploadRes.data.data.path
                                else throw new Error(uploadRes.data.error || 'Image upload failed')
                            }

                            const payload = {
                                name: values.name || null,
                                email: values.email,
                                image: imagePath || null,
                                role: user?.role || 'USER',
                                isActive: values.isActive
                            }

                            if (user) {
                                payload.id = user.id
                                if (values.password) payload.password = values.password
                                const res = await axios.put('/api/admin/users', payload)
                                if (res.data.success) { toast.success('User updated'); setSelectedFile(null); onSubmit() }
                                else toast.error(res.data.error || 'Failed to update user')
                            } else {
                                payload.password = values.password
                                const res = await axios.post('/api/admin/users', payload)
                                if (res.data.success) { toast.success('User created'); setSelectedFile(null); onSubmit() }
                                else toast.error(res.data.error || 'Failed to create user')
                            }
                        } catch (err) { toast.error(err.response?.data?.error || err.message || 'An error occurred') }
                        finally { setLoading(false); setSubmitting(false) }
                    }}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Name</span></label>
                                <Field name="name" type="text" className="input input-bordered w-full" />
                                <ErrorMessage name="name" component="div" className="text-error text-sm mt-1" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Email <span className="text-error">*</span></span></label>
                                <Field name="email" type="email" className="input input-bordered w-full" />
                                <ErrorMessage name="email" component="div" className="text-error text-sm mt-1" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Password {user ? '(leave blank to keep current)' : '*'}</span></label>
                                <Field name="password" type="password" className="input input-bordered w-full" />
                                <ErrorMessage name="password" component="div" className="text-error text-sm mt-1" />
                            </div>

                              <div className="form-control">
                                <label className="label"><span className="label-text font-medium">User Image</span></label>
                                <div className="rounded-lg border-2 border-dashed border-base-300 p-4">
                                    {imagePreview ? (
                                        <div className="space-y-3">
                                            <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                                            <label className="btn btn-ghost btn-sm w-full">
                                                Change Image
                                                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setFieldValue)} className="hidden" />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="flex cursor-pointer flex-col items-center justify-center gap-2">
                                            <span className="text-sm font-medium">Click to upload image</span>
                                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setFieldValue)} className="hidden" />
                                        </label>
                                    )}
                                </div>
                              </div>
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input type="checkbox" checked={values.isActive} onChange={(e) => setFieldValue('isActive', e.target.checked)} className="checkbox checkbox-primary" />
                                    <span className="label-text font-medium">Active</span>
                                </label>
                            </div>

                            <div className="modal-action">
                                <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                                <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save'}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <form method="dialog" className="modal-backdrop"><button onClick={onClose}>close</button></form>
        </dialog>
    )
}
