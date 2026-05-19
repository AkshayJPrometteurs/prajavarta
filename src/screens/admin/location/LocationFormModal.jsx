"use client"

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
    name: Yup.string().trim().required('Marathi location name is required'),
    nameEnglish: Yup.string().trim().required('English location name is required'),
    groupLink: Yup.string().trim().url('Must be a valid URL').nullable()
})

export default function LocationFormModal({ isOpen, onClose, location, onSubmit }) {
    const dialogRef = useRef(null)
    const [districts, setDistricts] = useState([])
    const [subdivisions, setSubdivisions] = useState([])

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (isOpen) dialog.showModal()
        else dialog.close()
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            axios.get('/api/admin/districts?limit=200').then((res) => {
                if (res.data.success) setDistricts(res.data.data || [])
            }).catch(() => {})
        }
    }, [isOpen])

    const handleDistrictChange = async (districtId, setFieldValue) => {
        setFieldValue('districtId', districtId)
        setFieldValue('subdivisionId', '')
        if (districtId) {
            try {
                const res = await axios.get(`/api/admin/subdivisions?limit=200&districtId=${districtId}`)
                if (res.data.success) setSubdivisions(res.data.data || [])
            } catch { setSubdivisions([]) }
        } else setSubdivisions([])
    }

    useEffect(() => {
        if (isOpen && location?.districtId) {
            axios.get(`/api/admin/subdivisions?limit=200&districtId=${location.districtId}`).then((res) => {
                if (res.data.success) setSubdivisions(res.data.data || [])
            }).catch(() => {})
        } else setSubdivisions([])
    }, [isOpen, location])

    return (
        <dialog ref={dialogRef} className="modal" onClose={onClose}>
            <div className="modal-box w-full max-w-lg">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{location ? 'Edit Location' : 'Add Location'}</h3>
                    <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>

                <Formik
                    enableReinitialize
                    initialValues={{
                        name: location?.name || '',
                        nameEnglish: location?.nameEnglish || '',
                        districtId: location?.districtId?.toString() || '',
                        subdivisionId: location?.subdivisionId?.toString() || '',
                        groupLink: location?.groupLink || ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        setSubmitting(true)
                        const payload = {
                            name: values.name.trim(),
                            nameEnglish: values.nameEnglish.trim(),
                            districtId: values.districtId || null,
                            subdivisionId: values.subdivisionId || null,
                            groupLink: values.groupLink?.trim() || null
                        }
                        try {
                            if (location) {
                                payload.id = location.id
                                const res = await axios.put('/api/admin/location-list', payload)
                                if (res.data.success) { toast.success('Location updated successfully'); onSubmit() }
                                else toast.error(res.data.error || 'Failed to update')
                            } else {
                                const res = await axios.post('/api/admin/location-list', payload)
                                if (res.data.success) { toast.success('Location created successfully'); onSubmit() }
                                else toast.error(res.data.error || 'Failed to create')
                            }
                        } catch (err) {
                            toast.error(err.response?.data?.error || 'An error occurred')
                        } finally { setSubmitting(false) }
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Name (Marathi) <span className="text-error">*</span></span></label>
                                <Field name="name" type="text" placeholder="Enter Marathi name" className="input input-bordered w-full" />
                                <ErrorMessage name="name" component="div" className="text-error text-sm mt-1" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Name (English) <span className="text-error">*</span></span></label>
                                <Field name="nameEnglish" type="text" placeholder="Enter English name" className="input input-bordered w-full" />
                                <ErrorMessage name="nameEnglish" component="div" className="text-error text-sm mt-1" />
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">District</span></label>
                                <select value={values.districtId} onChange={(e) => handleDistrictChange(e.target.value, setFieldValue)} className="select select-bordered w-full">
                                    <option value="">-- Select District --</option>
                                    {districts.map((d) => <option key={d.id} value={d.id.toString()}>{d.name}{d.nameEnglish ? ` (${d.nameEnglish})` : ''}</option>)}
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Subdivision</span></label>
                                <select value={values.subdivisionId} onChange={(e) => setFieldValue('subdivisionId', e.target.value)} disabled={!values.districtId} className="select select-bordered w-full">
                                    <option value="">-- Select Subdivision --</option>
                                    {subdivisions.map((s) => <option key={s.id} value={s.id.toString()}>{s.name}{s.nameEnglish ? ` (${s.nameEnglish})` : ''}</option>)}
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label"><span className="label-text font-medium">Group Link</span></label>
                                <Field name="groupLink" type="url" placeholder="https://..." className="input input-bordered w-full" />
                                <ErrorMessage name="groupLink" component="div" className="text-error text-sm mt-1" />
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
