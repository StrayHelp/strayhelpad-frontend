import * as XLSX from 'xlsx';

/**
 * Export data to an Excel (.xlsx) file and trigger a browser download.
 * @param {Array<Object>} rows - Array of data objects
 * @param {string} filename - Output filename (e.g. 'users_export.xlsx')
 * @param {Array<{label: string, key: string|Function}>} columns - Column definitions
 */
export function exportToXlsx(rows, filename, columns) {
  const headers = columns.map(c => c.label);
  const data = rows.map(row =>
    columns.map(c =>
      typeof c.key === 'function' ? c.key(row) : (row[c.key] ?? '')
    )
  );
  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, filename);
}
