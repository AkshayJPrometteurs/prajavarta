export default function useExportToExcel() {
  const escapeCsv = (value) => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    const escaped = str.replace(/"/g, '""')
    if (escaped.search(/,|"|\n|\r/) !== -1) return `"${escaped}"`
    return escaped
  }

  const exportToCsv = (filename, rows = [], headers = []) => {
    // headers: [{ label: 'Name', key: 'name' }, ...] or ['name','email']
    let keys = []
    let labels = []
    if (headers && headers.length > 0) {
      if (typeof headers[0] === 'string') {
        keys = headers
        labels = headers
      } else {
        keys = headers.map(h => h.key)
        labels = headers.map(h => h.label)
      }
    } else if (rows.length > 0) {
      keys = Object.keys(rows[0])
      labels = keys
    }

    const csvLines = []
    csvLines.push(labels.map(escapeCsv).join(','))

    for (const row of rows) {
      const line = keys.map((k) => escapeCsv(row[k])).join(',')
      csvLines.push(line)
    }

    const csvContent = csvLines.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return { exportToCsv }
}
