"use client"

import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Save, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import AdminLayout from '@/layout/AdminLayout'
import axiosInstance from '@/lib/axios'

const REQUIRED_WIDTH = 970
const REQUIRED_HEIGHT = 250

function readImageSize(file) {
    return new Promise((resolve, reject) => {
        const image = new window.Image()
        const objectUrl = URL.createObjectURL(file)

        image.onload = () => {
            const size = {
                width: image.naturalWidth,
                height: image.naturalHeight
            }
            URL.revokeObjectURL(objectUrl)
            resolve(size)
        }

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('Unable to read image dimensions'))
        }

        image.src = objectUrl
    })
}

export default function MainAdvertisementBannerScreen() {
    const previewUrlRef = useRef(null)
    const [state, setState] = useState({
        banner: null,
        image: null,
        imagePreview: null,
        loading: true,
        uploading: false,
        saving: false
    })

    const updateState = (data) => {
        setState((prev) => ({ ...prev, ...data }))
    }

    const fetchBanner = async () => {
        try {
            updateState({ loading: true })
            const response = await axiosInstance.get('/admin/main-advertisement-banner')

            if (response.data.success) {
                updateState({
                    banner: response.data.data,
                    image: response.data.data?.image || null,
                    imagePreview: response.data.data?.image || null
                })
            }
        } catch (error) {
            toast.error('Failed to load main advertisement banner')
        } finally {
            updateState({ loading: false })
        }
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBanner()

        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        e.target.value = ''

        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB')
            return
        }

        const previousPreview = state.imagePreview

        try {
            const dimensions = await readImageSize(file)

            if (
                dimensions.width < REQUIRED_WIDTH ||
                dimensions.height < REQUIRED_HEIGHT
            ) {
                toast.error(
                    `Minimum image size must be ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT}px. Selected image is ${dimensions.width}x${dimensions.height}px`
                )

                return
            }

            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current)
            }

            const preview = URL.createObjectURL(file)
            previewUrlRef.current = preview
            updateState({ uploading: true, imagePreview: preview })

            const formDataUpload = new FormData()
            formDataUpload.append('file', file)
            formDataUpload.append('folder', 'main-advertisement-banner')
            formDataUpload.append('expectedWidth', REQUIRED_WIDTH.toString())
            formDataUpload.append('expectedHeight', REQUIRED_HEIGHT.toString())

            const uploadResponse = await axiosInstance.post('/admin/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (uploadResponse.data.success) {
                updateState({ image: uploadResponse.data.data.path })
                toast.success('Banner image uploaded successfully')
            } else {
                updateState({ imagePreview: previousPreview })
                toast.error(uploadResponse.data.error || 'Image upload failed')
            }
        } catch (error) {
            updateState({ imagePreview: previousPreview })
            toast.error(error.response?.data?.error || error.message || 'Failed to upload image')
        } finally {
            updateState({ uploading: false })
        }
    }

    const handleSave = async () => {
        if (!state.image) {
            toast.error('Please upload a banner image')
            return
        }

        try {
            updateState({ saving: true })
            const response = await axiosInstance.put('/admin/main-advertisement-banner', {
                image: state.image
            })

            if (response.data.success) {
                toast.success('Main advertisement banner saved successfully')
                updateState({ banner: response.data.data })
            } else {
                toast.error(response.data.error || 'Failed to save banner')
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save banner')
        } finally {
            updateState({ saving: false })
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            MainAdvertisementBanner
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Upload one banner image. Required size: {REQUIRED_WIDTH}x{REQUIRED_HEIGHT}px.
                        </p>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={state.saving || state.uploading || state.loading}
                        className="btn btn-primary gap-2"
                    >
                        <Save size={18} />
                        {state.saving ? 'Saving...' : 'Save Banner'}
                    </button>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                            <ImageIcon size={20} />
                            Banner Image
                        </h2>
                    </div>

                    <div className="space-y-5 p-5">
                        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4">
                            {state.loading ? (
                                <div className="flex aspect-970/250 w-full items-center justify-center rounded-lg bg-white">
                                    <p className="text-sm text-slate-500">Loading banner...</p>
                                </div>
                            ) : state.imagePreview ? (
                                <div className="space-y-4">
                                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                                        <img
                                            src={state.imagePreview}
                                            alt="Main advertisement banner preview"
                                            className="aspect-970/250 w-full object-cover"
                                        />
                                    </div>

                                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
                                        <Upload size={16} />
                                        {state.uploading ? 'Uploading...' : 'Edit Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            disabled={state.uploading}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            ) : (
                                <label className="flex aspect-970/250 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg bg-white">
                                    <Upload size={34} className="text-slate-400" />
                                    <span className="text-sm font-medium text-slate-700">
                                        Upload 970x250 banner image
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={state.uploading}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {state.banner?.updatedAt && (
                            <p className="text-xs text-slate-500">
                                Last updated: {new Date(state.banner.updatedAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
