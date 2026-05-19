"use client"

import { memo, useEffect, useState } from 'react'
import AdminLayout from '@/layout/AdminLayout'
import { Formik, Form, Field } from 'formik'
import { toast } from 'react-toastify'
import { smtpSchemas } from '@/validations/smtpSchemas'

const SMTPSettingsScreen = () => {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [values, setValues] = useState({ smtpType: 'server', host: '', email: '', password: '', secure: 'TLS', port: 587 })

    useEffect(() => { fetchSettings() }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/smtp')
            const data = await res.json()
            if (data.success && data.data) setValues(prev => ({ ...prev, ...data.data }))
        } catch (err) {
            console.error(err)
            toast.error('Failed to load SMTP settings')
        } finally { setLoading(false) }
    }

    return (
        <AdminLayout>
            <div className="rounded-xl border border-base-200 bg-base-100 shadow-sm">
                <div className="border-b border-base-200 p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">SMTP Settings</h1>
                </div>

                {loading ? (
                    <div className="p-10 text-center"><span className="loading loading-spinner loading-lg"></span></div>
                ) : (
                    <div className="p-4">
                        <Formik
                            enableReinitialize
                            initialValues={values}
                            validationSchema={smtpSchemas}
                            onSubmit={async (vals, { setSubmitting }) => {
                                try {
                                    setSaving(true)
                                    const res = await fetch('/api/admin/smtp', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vals) })
                                    const data = await res.json()
                                    if (data.success) { toast.success('SMTP settings saved'); fetchSettings() } else { toast.error(data.error || 'Save failed') }
                                } catch (err) { toast.error(err.message || 'Save failed') }
                                finally { setSaving(false); setSubmitting(false) }
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label"><span className="label-text">SMTP Type</span></label>
                                            <Field as="select" name="smtpType" className="select select-bordered w-full">
                                                <option value="gmail">Gmail SMTP</option>
                                                <option value="server">Server SMTP</option>
                                            </Field>
                                            {errors.smtpType && touched.smtpType && <div className="text-error text-sm mt-1">{errors.smtpType}</div>}
                                        </div>

                                        <div>
                                            <label className="label"><span className="label-text">SMTP Host</span></label>
                                            <Field name="host" className={`input input-bordered w-full ${errors.host && touched.host ? 'input-error' : ''}`} />
                                            {errors.host && touched.host && <div className="text-error text-sm mt-1">{errors.host}</div>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label"><span className="label-text">Email</span></label>
                                            <Field name="email" className={`input input-bordered w-full ${errors.email && touched.email ? 'input-error' : ''}`} />
                                            {errors.email && touched.email && <div className="text-error text-sm mt-1">{errors.email}</div>}
                                        </div>

                                        <div>
                                            <label className="label"><span className="label-text">Password</span></label>
                                            <Field name="password" type="password" className={`input input-bordered w-full ${errors.password && touched.password ? 'input-error' : ''}`} />
                                            {errors.password && touched.password && <div className="text-error text-sm mt-1">{errors.password}</div>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="label"><span className="label-text">SMTP Secure</span></label>
                                            <Field as="select" name="secure" className={`select select-bordered w-full ${errors.secure && touched.secure ? 'input-error' : ''}`}>
                                                <option>TLS</option>
                                                <option>SSL</option>
                                                <option>None</option>
                                            </Field>
                                            {errors.secure && touched.secure && <div className="text-error text-sm mt-1">{errors.secure}</div>}
                                        </div>

                                        <div>
                                            <label className="label"><span className="label-text">Port No.</span></label>
                                            <Field name="port" type="number" className={`input input-bordered w-full ${errors.port && touched.port ? 'input-error' : ''}`} />
                                            {errors.port && touched.port && <div className="text-error text-sm mt-1">{errors.port}</div>}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-red-100 rounded">
                                        <strong>Note:</strong> This email is required otherwise forgot password or email features will not work.
                                    </div>

                                    <div className="flex justify-end gap-4 border-t border-base-200 pt-5">
                                        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default memo(SMTPSettingsScreen)