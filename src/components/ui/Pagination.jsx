"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
    if (totalPages <= 1) return null

    const getPages = () => {
        const pages = []
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
            return pages
        }
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages)
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
        }
        return pages
    }

    return (
        <div className="join flex flex-wrap items-center justify-center gap-1">
            <button
                className="join-item btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft size={16} />
                Prev
            </button>

            {getPages().map((page, index) =>
                page === '...' ? (
                    <span key={`ellipsis-${index}`} className="join-item btn btn-sm btn-disabled">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`join-item btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                className="join-item btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
                <ChevronRight size={16} />
            </button>
        </div>
    )
}