export function ErrorAlert({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 flex items-center justify-between">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-medium text-red-700 hover:text-red-900"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ message = 'No records found' }) {
  return (
    <div className="px-5 py-16 text-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}