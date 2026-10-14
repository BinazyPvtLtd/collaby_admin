import { useState } from 'react'
import adminApi from '../api/adminApi'
import EditBusinessModal from '../components/EditBusinessModal'
import useListData from '../hooks/useListData'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import { ErrorAlert } from '../components/Feedback'
import PageHeader, { DangerButton, ActionButton } from '../components/PageHeader'

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Businesses() {

  const [editId, setEditId] = useState(null)
  const [success, setSuccess] = useState('')
  const [detail, setDetail] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const { rows, pagination, setPage, refetch, loading, error } = useListData(
    (params) => adminApi.listBusinesses(params),
    { initialLimit: 10 },
  )


  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminApi.deleteBusiness(deleteTarget.mobileNumber)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete business')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'businessName', label: 'Business Name', render: (r) => <span className="font-medium text-gray-900">{r.businessName}</span> },
    { key: 'mobileNumber', label: 'Mobile' },
    { key: 'businessType', label: 'Type' },
    { key: 'city', label: 'City' },
    { key: 'gstNumber', label: 'GST', render: (r) => r.gstNumber || '—' },
    {
      key: 'created_at',
      label: 'Registered',
      render: (r) => formatDate(r.created_at || r.createdAt),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Businesses" subtitle={`${pagination.total} total businesses`} />


      {success && <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{success}</p>}
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
                <ActionButton onClick={() => { setSuccess(''); setEditId(row.id) }}>Edit</ActionButton>
                <DangerButton onClick={() => setDeleteTarget(row)}>Delete</DangerButton>
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

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Business Details">
        {detail && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="text-gray-500">Business Name</dt><dd className="font-medium text-gray-900">{detail.businessName}</dd></div>
            <div><dt className="text-gray-500">Mobile</dt><dd className="font-medium text-gray-900">{detail.mobileNumber}</dd></div>
            <div><dt className="text-gray-500">Business Type</dt><dd className="font-medium text-gray-900">{detail.businessType}</dd></div>
            <div><dt className="text-gray-500">City</dt><dd className="font-medium text-gray-900">{detail.city}</dd></div>
            <div><dt className="text-gray-500">GST Number</dt><dd className="font-medium text-gray-900">{detail.gstNumber || '—'}</dd></div>
            <div><dt className="text-gray-500">Business ID</dt><dd className="font-medium text-gray-900">{detail.id}</dd></div>
          </dl>
        )}
      </Modal>

      {editId !== null && (
        <EditBusinessModal
          key={editId}
          businessId={editId}
          onClose={() => setEditId(null)}
          onSaved={() => {
            setEditId(null)
            setSuccess('Business updated successfully.')
            refetch()
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Business"
        message={`Are you sure you want to delete ${deleteTarget?.businessName}? This action cannot be undone.`}
      />
    </div>
  )
}