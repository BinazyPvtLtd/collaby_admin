import { EmptyState } from './Feedback'

export default function DataTable({ columns, rows, rowKey = 'id', actions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3 font-medium whitespace-nowrap">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-5 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)}>
                <EmptyState />
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={row[rowKey] ?? i} className="border-b border-gray-100 hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-3 whitespace-nowrap ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
                {actions && (
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}