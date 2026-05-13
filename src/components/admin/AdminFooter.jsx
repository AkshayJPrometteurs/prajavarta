"use client"

export default function AdminFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center">
        <p className="text-center text-sm text-slate-600">
          Copyright © 2026{' '}
          <a
            href="https://prajavarta.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            prajavarta.com
          </a>
          / All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
