"use client"

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
    name: Yup.string().trim().required('Marathi district name is required'),
    nameEnglish: Yup.string().trim().required('English district name is required'),
    isActive: Yup.boolean()
})

export default function DistrictFormModal({ isOpen, onClose, district, onSubmit }) {
    const dialogRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (isOpen) dialog.showModal()
        else dialog.close()
    }, [isOpen])

    return (
        <dialog ref={dialogRef} className="modal" onClose={onClose}>
            <div className="modal-box w-full max-w-lg">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{district ? 'Edit District' : 'Add District'}</h3>
                    <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>

                <Formik
                    enableReinitialize
                    initialValues={{
                        name: district?.name || '',
                        nameEnglish: district?.nameEnglish || '',
                        isActive: district?.isActive ?? true
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true)
                        const payload = {
                            name: values.name.trim(),
                            nameEnglish: values.nameEnglish.trim(),
                            isActive: values.isActive
                        }
                        try {
                            if (district) {
                                payload.id = district.id
                                const res = await axios.put('/api/admin/districts', payload)
                                if (res.data.success) { toast.success('District updated successfully'); onSubmit() }
                                else toast.error(res.data.error || 'Failed to update district')
                            } else {
                                const res = await axios.post('/api/admin/districts', payload)
                                if (res.data.success) { toast.success('District created successfully'); onSubmit() }
                                else toast.error(res.data.error || 'Failed to create district')
                            }
                        } catch (err) {
                            toast.error(err.response?.data?.error || 'An error occurred')
                        } finally {
                            setSubmitting(false)
                        }
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">District Name (Marathi) <span className="text-error">*</span></span></label>
                                <Field name="name" type="text" placeholder="Enter Marathi district name" className="input input-bordered w-full" />
                                <ErrorMessage name="name" component="div" className="text-error text-sm mt-1" />
                            </div>

                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">District Name (English) <span className="text-error">*</span></span></label>
                                <Field name="nameEnglish" type="text" placeholder="Enter English district name" className="input input-bordered w-full" />
                                <ErrorMessage name="nameEnglish" component="div" className="text-error text-sm mt-1" />
                            </div>

                            <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="districtIsActive"
                                        checked={values.isActive}
                                        onChange={(e) => setFieldValue('isActive', e.target.checked)}
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text font-medium">Active</span>
                                </label>
                            </div>

                            <div className="modal-action">
                                <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                    {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : null}
                                    {isSubmitting ? 'Saving...' : 'Save'}
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
