"use client"

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
    name: Yup.string().trim().required('Marathi location name is required'),
    nameEnglish: Yup.string().trim().required('English location name is required'),
    groupLink: Yup.string().trim().url('Must be a valid URL').nullable(),
    isActive: Yup.boolean()
})

export default function LocationFormModal({ isOpen, onClose, location, onSubmit }) {
    const [districts, setDistricts] = useState([])
    const [subdivisions, setSubdivisions] = useState([])

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
        } else {
            setSubdivisions([])
        }
    }

    useEffect(() => {
        if (isOpen && location?.districtId) {
            axios.get(`/api/admin/subdivisions?limit=200&districtId=${location.districtId}`).then((res) => {
                if (res.data.success) setSubdivisions(res.data.data || [])
            }).catch(() => {})
        } else {
            setSubdivisions([])
        }
    }, [isOpen, location])

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" onClose={onClose} className="relative z-50">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all">
                                <div className="mb-6 flex items-center justify-between">
                                    <Dialog.Title className="text-2xl font-bold text-slate-900">
                                        {location ? 'Edit Location' : 'Add Location'}
                                    </Dialog.Title>
                                    <button type="button" onClick={onClose} className="rounded-md text-slate-400 hover:text-slate-600">
                                        <X size={24} />
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
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">Name (Marathi) <span className="text-red-500">*</span></label>
                                                <Field name="name" type="text" placeholder="Enter Marathi name" className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">Name (English) <span className="text-red-500">*</span></label>
                                                <Field name="nameEnglish" type="text" placeholder="Enter English name" className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                                <ErrorMessage name="nameEnglish" component="div" className="mt-1 text-sm text-red-600" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">District</label>
                                                <select value={values.districtId} onChange={(e) => handleDistrictChange(e.target.value, setFieldValue)} className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                    <option value="">-- Select District --</option>
                                                    {districts.map((d) => (
                                                        <option key={d.id} value={d.id.toString()}>{d.name}{d.nameEnglish ? ` (${d.nameEnglish})` : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">Subdivision</label>
                                                <select value={values.subdivisionId} onChange={(e) => setFieldValue('subdivisionId', e.target.value)} disabled={!values.districtId} className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400">
                                                    <option value="">-- Select Subdivision --</option>
                                                    {subdivisions.map((s) => (
                                                        <option key={s.id} value={s.id.toString()}>{s.name}{s.nameEnglish ? ` (${s.nameEnglish})` : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">Group Link</label>
                                                <Field name="groupLink" type="url" placeholder="https://..." className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                                <ErrorMessage name="groupLink" component="div" className="mt-1 text-sm text-red-600" />
                                            </div>
                                            <div className="flex gap-3 pt-6">
                                                <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
                                                <button type="submit" disabled={isSubmitting} className="flex-1 rounded-lg bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                                    {isSubmitting ? 'Saving...' : 'Save'}
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
