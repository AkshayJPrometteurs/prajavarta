"use client"

import { useEffect, useState } from 'react'
import { Save, X, Upload } from 'lucide-react'
import AdminLayout from '@/layout/AdminLayout'
import axiosInstance from '@/lib/axios'
import { toast } from 'react-toastify'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import TiptapEditor from '@/components/TiptapEditor'
import ImageSelector from '@/components/ImageSelector'

export default function SettingsScreen() {
    const [tab, setTab] = useState('app')
    const [loading, setLoading] = useState(true)
    const [selectedFile, setSelectedFile] = useState(null)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        appName: '',
        appLogo: '',
        appDescription: '',
        appVersion: '',
        author: '',
        contact: '',
        email: '',
        website: '',
        developedBy: '',
        privacyPolicy: ''
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings')
            const data = await res.json()
            if (data.success && data.data) {
                setSettings(prev => ({ ...prev, ...data.data }))
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to load settings')
        } finally {
            setLoading(false)
        }
    }

    const uploadFile = async () => {
        if (!selectedFile) return settings.appLogo
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('folder', 'settings')
        const uploadRes = await axiosInstance.post('/admin/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (uploadRes.data.success) return uploadRes.data.data.path
        throw new Error('Upload failed')
    }

    return (
        <AdminLayout>
            <div className="rounded-xl border border-base-200 bg-base-100 shadow-sm">
                <div className="border-b border-base-200 p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Settings</h1>
                </div>

                {loading ? (
                    <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>
                ) : (
                    <div className="px-4 pb-4 pt-1">
                        <div role="tablist" className="tabs tabs-border mb-6">
                            <button
                                role="tab"
                                onClick={() => setTab('app')}
                                className={`tab ${tab === 'app' ? 'tab-active' : ''}`}
                            >
                                App Settings
                            </button>
                            <button
                                role="tab"
                                onClick={() => setTab('privacy')}
                                className={`tab ${tab === 'privacy' ? 'tab-active' : ''}`}
                            >
                                Privacy Policy
                            </button>
                        </div>
                        {tab === 'app' ? (
                            <Formik
                                enableReinitialize
                                initialValues={settings}
                                validationSchema={Yup.object({
                                    appName: Yup.string().required('App Name is required'),
                                    email: Yup.string().email('Invalid email address').nullable(),
                                    website: Yup.string().url('Invalid website URL').nullable()
                                })}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        setSaving(true)
                                        let logoPath = values.appLogo
                                        if (selectedFile) {
                                            toast.info('Uploading logo...')
                                            logoPath = await uploadFile()
                                        }
                                        const payload = { ...values, appLogo: logoPath }
                                        const res = await fetch('/api/admin/settings', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(payload)
                                        })
                                        const data = await res.json()
                                        if (data.success) {
                                            toast.success('Settings saved')
                                            setSelectedFile(null)
                                            fetchSettings()
                                        } else {
                                            toast.error(data.error || 'Failed to save settings')
                                        }
                                    } catch (error) {
                                        toast.error(error.message || 'Save failed')
                                    } finally {
                                        setSaving(false)
                                        setSubmitting(false)
                                    }
                                }}
                            >
                                {({ values, errors, touched, setFieldValue }) => (
                                    <Form className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                label="App Name"
                                                error={errors.appName && touched.appName ? errors.appName : null}
                                            >
                                                <Field
                                                    name="appName"
                                                    className={`input input-bordered w-full ${errors.appName && touched.appName ? 'input-error' : ''}`}
                                                />
                                            </FormField>

                                            <FormField
                                                label="App Version"
                                                error={errors.appVersion && touched.appVersion ? errors.appVersion : null}
                                            >
                                                <Field
                                                    name="appVersion"
                                                    className={`input input-bordered w-full ${errors.appVersion && touched.appVersion ? 'input-error' : ''}`}
                                                />
                                            </FormField>
                                        </div>

                                        <FormField label="App Logo">
                                            <ImageSelector
                                                images={
                                                    selectedFile
                                                        ? [URL.createObjectURL(selectedFile)]
                                                        : (values.appLogo ? [values.appLogo] : [])
                                                }
                                                uploading={false}
                                                type="featured"
                                                onUpload={(files) => {
                                                    const file = files[0]
                                                    if (!file) return
                                                    setSelectedFile(file)
                                                    setFieldValue('appLogo', file.name)
                                                }}
                                                onRemove={() => {
                                                    setSelectedFile(null)
                                                    setFieldValue('appLogo', '')
                                                }}
                                            />
                                        </FormField>

                                        <FormField label="App Description" error={errors.appDescription && touched.appDescription ? errors.appDescription : null}>
                                            <div>
                                                <TiptapEditor
                                                    value={values.appDescription}
                                                    onChange={(html) => setFieldValue('appDescription', html)}
                                                    error={errors.appDescription && touched.appDescription ? errors.appDescription : null}
                                                    minHeight="180px"
                                                />
                                            </div>
                                        </FormField>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField label="Author">
                                                <Field name="author" className="input input-bordered w-full" />
                                            </FormField>

                                            <FormField label="Contact">
                                                <Field name="contact" className="input input-bordered w-full" />
                                            </FormField>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                label="Email"
                                                error={errors.email && touched.email ? errors.email : null}
                                            >
                                                <Field
                                                    name="email"
                                                    className={`input input-bordered w-full ${errors.email && touched.email ? 'input-error' : ''}`}
                                                />
                                            </FormField>

                                            <FormField
                                                label="Website"
                                                error={errors.website && touched.website ? errors.website : null}
                                            >
                                                <Field
                                                    name="website"
                                                    className={`input input-bordered w-full ${errors.website && touched.website ? 'input-error' : ''}`}
                                                />
                                            </FormField>
                                        </div>

                                        <FormField label="Developed By">
                                            <Field name="developedBy" className="input input-bordered w-full" />
                                        </FormField>

                                        <div className="flex justify-end gap-4 border-t border-base-200 pt-5">
                                            <button type="button" className="btn" onClick={() => {
                                                fetchSettings()
                                            }}>
                                                <X size={14} /> Reset
                                            </button>
                                            <button type="submit" className="btn btn-primary gap-2" disabled={saving}>
                                                <Save size={14} /> {saving ? 'Saving...' : 'Save Settings'}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        ) : (
                            <Formik
                                enableReinitialize
                                initialValues={settings}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        setSaving(true)
                                        const payload = { ...values }
                                        const res = await fetch('/api/admin/settings', {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(payload)
                                        })
                                        const data = await res.json()
                                        if (data.success) {
                                            toast.success('Privacy policy saved')
                                            fetchSettings()
                                        } else {
                                            toast.error(data.error || 'Failed to save privacy policy')
                                        }
                                    } catch (error) {
                                        toast.error(error.message || 'Save failed')
                                    } finally {
                                        setSaving(false)
                                        setSubmitting(false)
                                    }
                                }}
                            >
                                {({ values, errors, touched, setFieldValue }) => (
                                    <Form className="space-y-4">
                                        <FormField label="Privacy Policy" error={errors.privacyPolicy && touched.privacyPolicy ? errors.privacyPolicy : null}>
                                            <div>
                                                <TiptapEditor
                                                    value={values.privacyPolicy}
                                                    onChange={(html) => setFieldValue('privacyPolicy', html)}
                                                    error={errors.privacyPolicy && touched.privacyPolicy ? errors.privacyPolicy : null}
                                                    minHeight="180px"
                                                />
                                            </div>
                                        </FormField>

                                        <div className="flex justify-end gap-4 border-t border-base-200 pt-5">
                                            <button type="submit" className="btn btn-primary">Save Privacy Policy</button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

function FormField({ label, error, children }) {
    return (
        <div className="form-control grid grid-cols-1 gap-1 w-full">
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
