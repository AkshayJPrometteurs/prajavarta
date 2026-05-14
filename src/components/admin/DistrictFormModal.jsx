"use client"

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
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
                                        {district ? 'Edit District' : 'Add District'}
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
                                                const response = await axios.put('/api/admin/districts', payload)
                                                if (response.data.success) {
                                                    toast.success('District updated successfully')
                                                    onSubmit()
                                                } else {
                                                    toast.error(response.data.error || 'Failed to update district')
                                                }
                                            } else {
                                                const response = await axios.post('/api/admin/districts', payload)
                                                if (response.data.success) {
                                                    toast.success('District created successfully')
                                                    onSubmit()
                                                } else {
                                                    toast.error(response.data.error || 'Failed to create district')
                                                }
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
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    District Name (Marathi) <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    name="name"
                                                    type="text"
                                                    placeholder="Enter Marathi district name"
                                                    className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700">
                                                    District Name (English) <span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    name="nameEnglish"
                                                    type="text"
                                                    placeholder="Enter English district name"
                                                    className="mt-1 w-full rounded-lg border text-black border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <ErrorMessage name="nameEnglish" component="div" className="mt-1 text-sm text-red-600" />
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <input
                                                    type="checkbox"
                                                    id="districtIsActive"
                                                    checked={values.isActive}
                                                    onChange={(e) => setFieldValue('isActive', e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500 cursor-pointer"
                                                />
                                                <label htmlFor="districtIsActive" className="text-sm font-medium text-slate-700 cursor-pointer">
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
                                                    disabled={isSubmitting}
                                                    className="flex-1 rounded-lg bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
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
