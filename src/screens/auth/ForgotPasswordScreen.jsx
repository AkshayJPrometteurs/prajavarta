"use client"

import { memo, useState } from 'react'
import axiosInstance from '@/lib/axios'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ForgotPasswordScreen = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const sendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axiosInstance.post('/auth/forgot-password', { email })
            if (res.data?.success) {
                toast.success(res.data.message || 'OTP sent')
                setStep(2) // go to Verify OTP step
            } else {
                toast.error(res.data?.error || 'Failed to send OTP')
            }
        } catch (err) {
            toast.error('Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const resendOtp = async () => {
        if (!email) return toast.error('Enter email first')
        setLoading(true)
        try {
            const res = await axiosInstance.post('/auth/forgot-password', { email })
            if (res.data?.success) {
                toast.success(res.data.message || 'OTP resent')
            } else {
                toast.error(res.data?.error || 'Failed to resend OTP')
            }
        } catch (err) {
            toast.error('Failed to resend OTP')
        } finally {
            setLoading(false)
        }
    }

    const verifyOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axiosInstance.post('/auth/verify-otp', { email, otp })
            if (res.data?.success) {
                toast.success(res.data.message || 'OTP verified')
                setStep(3)
            } else {
                toast.error(res.data?.error || 'Invalid OTP')
            }
        } catch (err) {
            toast.error('Failed to verify OTP')
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword })
            if (res.data?.success) {
                toast.success('Password reset successfully')
                router.push('/login')
            } else {
                toast.error(res.data?.error || 'Failed to reset password')
            }
        } catch (err) {
            toast.error('Failed to reset password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Enter your email to receive an OTP to reset your password.</p>
                </div>

                {step === 1 && (
                    <form className="mt-8 space-y-6" onSubmit={sendOtp}>
                        <div>
                            <label className="sr-only">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Email address" />
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link href="/auth/login" className="text-sm text-orange-600 hover:underline">Back to login</Link>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form className="mt-8 space-y-6" onSubmit={verifyOtp}>
                        <div>
                            <p className="text-sm text-gray-600 text-center">An OTP was sent to <strong className="text-gray-900">{email}</strong>. Enter it below to verify.</p>
                        </div>

                        <div>
                            <label className="sr-only">OTP</label>
                            <input value={otp} onChange={(e) => setOtp(e.target.value)} required type="text" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Enter OTP" />
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>

                        <div className="text-center">
                            <button type="button" onClick={resendOtp} disabled={loading} className="text-sm text-orange-600 hover:underline">Resend OTP</button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form className="mt-8 space-y-6" onSubmit={resetPassword}>
                        <div>
                            <label className="sr-only">New Password</label>
                            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required type="password" className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="New password" />
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50">
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>

                        <div className="text-center">
                            <button type="button" onClick={() => { setStep(2); }} className="text-sm text-orange-600 hover:underline">Back to verify</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default memo(ForgotPasswordScreen)