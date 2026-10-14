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

const statusOptions = ['accepted', 'submitted', 'under_review', 'approved', 'rejected', 'completed']

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Deals() {
  const [dealStatus, setDealStatus] = useState('')
  const [detail, setDetail] = useState(null)

  const { rows, pagination, filters, setFilters, setPage, refetch, loading, error } = useListData(
    (params) => adminApi.listDeals(params),
    { initialLimit: 10 },
  )

  const applyFilter = () => {
    setFilters(dealStatus ? { deal_status: dealStatus } : {})
  }

  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-medium text-gray-900">#{r.id}</span> },
    { key: 'influencerName', label: 'Influencer', render: (r) => r.influencerName || `#${r.influencer_id}` },
    { key: 'businessName', label: 'Business', render: (r) => r.businessName || `#${r.business_id}` },
    { key: 'campaign_id', label: 'Campaign ID' },
    {
      key: 'agreed_price',
      label: 'Agreed Price',
      render: (r) => `₹${Number(r.agreed_price ?? 0).toLocaleString()}`,
    },
    { key: 'deal_status', label: 'Status', render: (r) => <StatusBadge status={r.deal_status} /> },
    { key: 'submitted_at', label: 'Submitted', render: (r) => formatDate(r.submitted_at) },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Deals" subtitle={`${pagination.total} total deals`} />

      <div className="flex flex-wrap items-center gap-3">
        <SelectInput value={dealStatus} onChange={setDealStatus} options={statusOptions} placeholder="All statuses" />
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
            actions={(row) => <ActionButton onClick={() => setDetail(row)}>View</ActionButton>}
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

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Deal Details" maxWidth="max-w-3xl">
        {detail && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <dl className="space-y-3">
              <div><dt className="text-gray-500">Deal ID</dt><dd className="font-medium text-gray-900">#{detail.id}</dd></div>
              <div><dt className="text-gray-500">Influencer</dt><dd className="font-medium text-gray-900">{detail.influencerName || `#${detail.influencer_id}`}</dd></div>
              <div><dt className="text-gray-500">Business</dt><dd className="font-medium text-gray-900">{detail.businessName || `#${detail.business_id}`}</dd></div>
              <div><dt className="text-gray-500">Campaign ID</dt><dd className="font-medium text-gray-900">{detail.campaign_id}</dd></div>
              <div><dt className="text-gray-500">Application ID</dt><dd className="font-medium text-gray-900">{detail.application_id}</dd></div>
              <div><dt className="text-gray-500">Status</dt><dd><StatusBadge status={detail.deal_status} /></dd></div>
            </dl>
            <dl className="space-y-3">
              <div><dt className="text-gray-500">Agreed Price</dt><dd className="font-medium text-gray-900">₹{Number(detail.agreed_price ?? 0).toLocaleString()}</dd></div>
              <div><dt className="text-gray-500">Submitted</dt><dd className="font-medium text-gray-900">{formatDate(detail.submitted_at)}</dd></div>
              <div><dt className="text-gray-500">Approved</dt><dd className="font-medium text-gray-900">{formatDate(detail.approved_at)}</dd></div>
              <div><dt className="text-gray-500">Content Link</dt><dd className="text-indigo-600 break-all">{detail.content_link || '—'}</dd></div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  )
}

