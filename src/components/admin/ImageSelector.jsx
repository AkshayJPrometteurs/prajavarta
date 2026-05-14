"use client"

import { Upload, X } from "lucide-react"

const PRIMARY = "#1f4e78"

export default function ImageSelector({
    images = [],
    onUpload,
    onRemove,
    uploading = false,
    maxImages = null,
    type = "gallery"
}) {
    const canAddMore =
        !maxImages || images.length < maxImages

    // Featured Image
    if (type === "featured") {
        return (
            <div className="space-y-4">
                {images.length > 0 ? (
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg">
                        <div className="relative h-60 overflow-hidden bg-slate-100">
                            <img
                                src={images[0]}
                                alt="Featured"
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">

                                {/* Change */}
                                <label
                                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg transition"
                                    style={{
                                        backgroundColor: PRIMARY
                                    }}
                                >
                                    <Upload size={16} />
                                    Change

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploading}
                                        onChange={(e) => {
                                            const files =
                                                Array.from(
                                                    e.target
                                                        .files ||
                                                    []
                                                )

                                            if (
                                                files.length > 0
                                            ) {
                                                onUpload(files)
                                            }

                                            e.target.value = ""
                                        }}
                                    />
                                </label>

                                {/* Remove */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemove(0)
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-red-700"
                                >
                                    <X size={16} />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <label
                        className="group flex h-60 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50 transition-all"
                        style={{
                            borderColor: "#cbd5e1"
                        }}
                    >
                        <div className="text-center">
                            <div
                                className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all group-hover:scale-110"
                                style={{
                                    backgroundColor:
                                        "#1f4e7815"
                                }}
                            >
                                <Upload
                                    size={28}
                                    style={{
                                        color: PRIMARY
                                    }}
                                />
                            </div>

                            <p
                                className="text-sm font-semibold"
                                style={{
                                    color: PRIMARY
                                }}
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Upload Featured Image"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                PNG, JPG, WEBP
                            </p>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading}
                            onChange={(e) => {
                                const files = Array.from(
                                    e.target.files || []
                                )

                                if (files.length > 0) {
                                    onUpload(files)
                                }

                                e.target.value = ""
                            }}
                        />
                    </label>
                )}
            </div>
        )
    }

    // Gallery Mode
    return (
        <div className="space-y-5">

            {/* Images Grid */}
            {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                    {/* Upload Card */}
                    {canAddMore && (
                        <label className="group flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:shadow-md">
                            <div className="text-center">
                                <div
                                    className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all group-hover:scale-110"
                                    style={{
                                        backgroundColor:
                                            "#1f4e7815"
                                    }}
                                >
                                    <Upload
                                        size={28}
                                        style={{
                                            color: PRIMARY
                                        }}
                                    />
                                </div>

                                <p
                                    className="text-sm font-semibold"
                                    style={{
                                        color: PRIMARY
                                    }}
                                >
                                    {uploading
                                        ? "Uploading..."
                                        : "Add Images"}
                                </p>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                disabled={uploading}
                                onChange={(e) => {
                                    const files =
                                        Array.from(
                                            e.target.files ||
                                            []
                                        )

                                    if (
                                        files.length > 0
                                    ) {
                                        onUpload(files)
                                    }

                                    e.target.value = ""
                                }}
                            />
                        </label>
                    )}

                    {/* Existing Images */}
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="relative h-44 overflow-hidden bg-slate-100">
                                <img
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onRemove(index)
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-red-700"
                                    >
                                        <X size={16} />
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 p-2 text-center">
                                <p className="text-xs font-medium text-slate-500">
                                    Image {index + 1}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <label className="group flex h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:shadow-md">

                    <div className="text-center">
                        <div
                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all group-hover:scale-110"
                            style={{
                                backgroundColor:
                                    "#1f4e7815"
                            }}
                        >
                            <Upload
                                size={32}
                                style={{
                                    color: PRIMARY
                                }}
                            />
                        </div>

                        <p
                            className="text-base font-semibold"
                            style={{
                                color: PRIMARY
                            }}
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload Gallery Images"}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Drag & drop or click to browse
                        </p>
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                            const files = Array.from(
                                e.target.files || []
                            )

                            if (files.length > 0) {
                                onUpload(files)
                            }

                            e.target.value = ""
                        }}
                    />
                </label>
            )}

            {/* Footer */}
            {images.length > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                    <p className="text-sm text-slate-600">
                        <span
                            className="font-semibold"
                            style={{ color: PRIMARY }}
                        >
                            {images.length}
                        </span>{" "}
                        image
                        {images.length !== 1
                            ? "s"
                            : ""}{" "}
                        uploaded
                    </p>

                    {maxImages && (
                        <span
                            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                            style={{
                                backgroundColor: PRIMARY
                            }}
                        >
                            Max {maxImages}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}