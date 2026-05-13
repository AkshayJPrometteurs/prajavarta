"use client"

import { Button } from '@headlessui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange
}) {

    // Don't show pagination if only 1 page
    if (totalPages <= 1) return null

    // Generate page numbers
    const getPages = () => {
        const pages = []

        // Show all pages if small count
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }

            return pages
        }

        // Dynamic pagination
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages)
        } else if (currentPage >= totalPages - 2) {
            pages.push(
                1,
                '...',
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            )
        } else {
            pages.push(
                1,
                '...',
                currentPage - 1,
                currentPage,
                currentPage + 1,
                '...',
                totalPages
            )
        }

        return pages
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-2">

            {/* Previous */}
            <Button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <ChevronLeft size={16} />
                Previous
            </Button>

            {/* Page Numbers */}
            {getPages().map((page, index) => {

                if (page === '...') {
                    return (
                        <span
                            key={index}
                            className="px-2 text-slate-400"
                        >
                            ...
                        </span>
                    )
                }

                return (
                    <Button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`h-10 min-w-10 rounded-lg px-3 text-sm font-medium transition ${currentPage === page
                            ? 'bg-pink-600 text-white'
                            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        {page}
                    </Button>
                )
            })}

            {/* Next */}
            <Button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Next
                <ChevronRight size={16} />
            </Button>

        </div>
    )
}