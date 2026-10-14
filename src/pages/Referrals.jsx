import adminApi from '../api/adminApi'
import useListData from '../hooks/useListData'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import Spinner from '../components/Spinner'
import { ErrorAlert } from '../components/Feedback'
import PageHeader from '../components/PageHeader'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Referrals() {
  const { rows, pagination, setPage, refetch, loading, error } = useListData(
    (params) => adminApi.listReferrals(params),
    { initialLimit: 10 },
  )

  const columns = [
    { key: 'id', label: 'ID', render: (r) => <span className="font-medium text-gray-900">#{r.id}</span> },
    { key: 'referral_name', label: 'Referral Name', render: (r) => <span className="font-medium text-gray-900">{r.referral_name}</span> },
    { key: 'referred_by', label: 'Referred By' },
    { key: 'user_id', label: 'User ID' },
    { key: 'created_at', label: 'Created', render: (r) => formatDate(r.created_at || r.createdAt) },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Referrals" subtitle={`${pagination.total} total referrals`} />
      <ErrorAlert message={error} onRetry={refetch} />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
          <Spinner />
        ) : (
          <DataTable columns={columns} rows={rows} />
        )}
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}