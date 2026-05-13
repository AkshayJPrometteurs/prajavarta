"use client"

import { Upload, X } from 'lucide-react'

export default function ImageSelector({ 
    images = [], 
    onUpload, 
    onRemove, 
    uploading = false, 
    maxImages = null,
    type = 'gallery' // 'featured' or 'gallery'
}) {
    const canAddMore = !maxImages || images.length < maxImages
    
    // Featured image mode - single image only
    if (type === 'featured') {
        return (
            <div className="space-y-4">
                {images.length > 0 ? (
                    <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-shadow w-full">
                        <div className="relative h-52 overflow-hidden bg-slate-100">
                            <img
                                src={images[0]}
                                alt="Featured"
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />

                            {/* Delete/Change Button Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 items-center justify-center">
                                <label className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-pink-700 transition-colors cursor-pointer">
                                    <Upload size={16} />
                                    Change
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || [])
                                            if (files.length > 0) {
                                                onUpload(files)
                                            }
                                            e.target.value = ''
                                        }}
                                        disabled={uploading}
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => onRemove(0)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                                >
                                    <X size={16} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <label className="flex h-52 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-pink-400 hover:bg-pink-50 transition-colors">
                        <div className="text-center">
                            <Upload size={32} className="mx-auto mb-2 text-slate-400 hover:text-pink-600 transition-colors" />
                            <p className="text-sm text-slate-600 hover:text-pink-600">{uploading ? 'Uploading...' : 'Click to upload'}</p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files || [])
                                if (files.length > 0) {
                                    onUpload(files)
                                }
                                e.target.value = ''
                            }}
                            disabled={uploading}
                        />
                    </label>
                )}
            </div>
        )
    }
    
    // Gallery mode - multiple images grid
    return (
        <div className="space-y-4">
            {/* Images Grid or Upload Area */}
            {images.length > 0 ? (
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {/* Upload Placeholder Card */}
                    {canAddMore && (
                        <label className="group flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-pink-400 hover:bg-pink-50 transition-colors">
                            <div className="text-center">
                                <Upload size={32} className="mx-auto mb-2 text-slate-400 group-hover:text-pink-600 transition-colors" />
                                <p className="text-xs text-slate-600 group-hover:text-pink-600">{uploading ? 'Uploading...' : 'Click to upload'}</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || [])
                                    if (files.length > 0) {
                                        onUpload(files)
                                    }
                                    e.target.value = ''
                                }}
                                disabled={uploading}
                            />
                        </label>
                    )}

                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden bg-slate-100">
                                <img
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                                />

                                {/* Delete Button Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => onRemove(index)}
                                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                                    >
                                        <X size={16} />
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {/* Image Number */}
                            <div className="p-2 text-center text-xs text-slate-600">
                                Image {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <label className="flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-pink-400 hover:bg-pink-50 transition-colors">
                    <div className="text-center">
                        <Upload size={32} className="mx-auto mb-2 text-slate-400 hover:text-pink-600 transition-colors" />
                        <p className="text-sm text-slate-600 hover:text-pink-600">{uploading ? 'Uploading...' : 'Click to upload images'}</p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            const files = Array.from(e.target.files || [])
                            if (files.length > 0) {
                                onUpload(files)
                            }
                            e.target.value = ''
                        }}
                        disabled={uploading}
                    />
                </label>
            )}

            {/* Image Count */}
            {images.length > 0 && (
                <p className="text-sm text-slate-600">
                    {images.length} image{images.length !== 1 ? 's' : ''} uploaded
                    {maxImages && ` (Max: ${maxImages})`}
                </p>
            )}
        </div>
    )
}
