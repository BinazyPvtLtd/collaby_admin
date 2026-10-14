import { useState } from 'react'
import adminApi from '../api/adminApi'
import useListData from '../hooks/useListData'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import { ErrorAlert } from '../components/Feedback'
import PageHeader, { SelectInput, ActionButton } from '../components/PageHeader'

const statusOptions = ['pending', 'accepted', 'rejected', 'withdrawn']

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Applications() {
  const [status, setStatus] = useState('')
  const [detail, setDetail] = useState(null)
  const [statusTarget, setStatusTarget] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)

  const { rows, pagination, filters, setFilters, setPage, refetch, loading, error } = useListData(
    (params) => adminApi.listApplications(params),
    { initialLimit: 10 },
  )

  const applyFilter = () => {
    setFilters(status ? { status } : {})
  }

  const handleStatusChange = async (application, newStatus) => {
    setStatusTarget(application.id)
    setStatusLoading(true)
    try {
      await adminApi.updateApplicationStatus(application.id, newStatus)
      refetch()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status')
    } finally {
      setStatusTarget(null)
      setStatusLoading(false)
    }
  }
  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-medium text-gray-900">#{r.id}</span> },
    { key: 'campaign_id', label: 'Campaign ID' },
    { key: 'influencer_id', label: 'Influencer ID' },
    { key: 'brand_id', label: 'Brand ID' },
    {
      key: 'expected_rate',
      label: 'Expected Rate',
      render: (r) => (r.expected_rate != null ? `₹${Number(r.expected_rate).toLocaleString()}` : '—'),
    },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'created_at', label: 'Applied', render: (r) => formatDate(r.created_at || r.createdAt) },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Applications" subtitle={`${pagination.total} total applications`} />

      <div className="flex flex-wrap items-center gap-3">
        <SelectInput value={status} onChange={setStatus} options={statusOptions} placeholder="All statuses" />
        <button
          type="button"
          onClick={applyFilter}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          Apply
        </button>

      </div>

      <ErrorAlert message={error} onRetry={refetch} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
          <Spinner />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            actions={(row) => (
              <>
                <ActionButton onClick={() => setDetail(row)}>View</ActionButton>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) handleStatusChange(row, e.target.value)
                  }}
                  disabled={statusLoading && statusTarget === row.id}
                  className="text-xs rounded-lg border border-gray-300 px-2 py-1.5 text-gray-600 bg-white"
                >
                  <option value="">Status…</option>
                  {statusOptions.filter((s) => s !== row.status).map((s) => (
                    <option key={s} value={s}>
                      Set {s}
                    </option>
                  ))}
                </select>
              </>
            )}
          />
        )}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Application Details" maxWidth="max-w-3xl">
        {detail && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <dl className="space-y-3">
              <div><dt className="text-gray-500">Application ID</dt><dd className="font-medium text-gray-900">#{detail.id}</dd></div>
              <div><dt className="text-gray-500">Campaign ID</dt><dd className="font-medium text-gray-900">{detail.campaign_id}</dd></div>
              <div><dt className="text-gray-500">Influencer ID</dt><dd className="font-medium text-gray-900">{detail.influencer_id}</dd></div>
              <div><dt className="text-gray-500">Brand ID</dt><dd className="font-medium text-gray-900">{detail.brand_id}</dd></div>
              <div><dt className="text-gray-500">Status</dt><dd><StatusBadge status={detail.status} /></dd></div>
            </dl>
            <dl className="space-y-3">
              <div><dt className="text-gray-500">Expected Rate</dt><dd className="font-medium text-gray-900">{detail.expected_rate != null ? `₹${Number(detail.expected_rate).toLocaleString()}` : '—'}</dd></div>
              <div><dt className="text-gray-500">Applied</dt><dd className="font-medium text-gray-900">{formatDate(detail.created_at || detail.createdAt)}</dd></div>
              <div><dt className="text-gray-500">Pitch Message</dt><dd className="text-gray-900 whitespace-pre-wrap">{detail.pitch_message || '—'}</dd></div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  )
}

