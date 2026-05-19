"use client"

import useExportToExcel from '@/hooks/useExportToExcel'

export default function ExportToExcel({ filename = 'export.csv', data = [], headers = [], fetchUrl = null, className = 'btn btn-outline btn-sm', children = 'Export CSV' }) {
  const { exportToCsv } = useExportToExcel()

  const handleExport = async () => {
    if (fetchUrl) {
      try {
        const res = await fetch(fetchUrl)
        const json = await res.json()
        const rows = json.data || json
        exportToCsv(filename, rows || [], headers)
      } catch (err) {
        console.error('Export fetch failed', err)
        // fallback: export provided data
        exportToCsv(filename, data || [], headers)
      }
    } else {
      exportToCsv(filename, data || [], headers)
    }
  }

  return (
    <button type="button" onClick={handleExport} className={className}>
      {children}
    </button>
  )
}
