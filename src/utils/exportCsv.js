/**
 * Exports an array of row objects to a CSV file download.
 * @param {object[]} rows - Data rows to export
 * @param {string} filename - Base filename (without .csv extension)
 * @param {Array<{key: string, label: string}>} columns - Column definitions
 */
export function exportToCsv(rows, filename, columns) {
  if (!rows || rows.length === 0) return;

  const header = columns.map(c => JSON.stringify(c.label)).join(',');
  const body = rows.map(row =>
    columns.map(c => {
      const v = row[c.key] ?? '';
      return JSON.stringify(String(v));
    }).join(',')
  ).join('\n');

  const csv = header + '\n' + body;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
