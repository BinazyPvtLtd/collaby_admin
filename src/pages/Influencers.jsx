import { useEffect, useState } from 'react'
import adminApi from '../api/adminApi'
import EditInfluencerModal from '../components/EditInfluencerModal'
import useListData from '../hooks/useListData'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import { ErrorAlert } from '../components/Feedback'
import PageHeader, { SearchInput, SelectInput, DangerButton, ActionButton } from '../components/PageHeader'

const genderOptions = ['Male', 'Female', 'Other']

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Influencers() {
  const [editId, setEditId] = useState(null)
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState('')
  const [detail, setDetail] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const { rows, pagination, setFilters, setPage, refetch, loading, error } = useListData(
    (params) => adminApi.listInfluencers(params),
    { initialLimit: 10 },
  )

  useEffect(() => {
    if (detailId === null) return
    let active = true
    setDetail(null)
    setDetailError('')
    setDetailLoading(true)
    async function loadDetail() {
      try {
        const response = await adminApi.getInfluencer(detailId)
        if (active) setDetail(response.data.data)
      } catch (err) {
        if (active) setDetailError(err.response?.data?.message || 'Failed to load influencer')
      } finally {
        if (active) setDetailLoading(false)
      }
    }
    loadDetail()
    return () => { active = false }
  }, [detailId])

  const applyFilters = () => {
    const updated = {}
    if (search.trim()) updated.search = search.trim()
    if (gender) updated.gender = gender
    setFilters(updated)
  }

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return
    setDeleting(true)
    try {
      await adminApi.deleteInfluencer(deleteTarget.mobileNumber)
      setDeleteTarget(null)
      if (rows.length === 1 && pagination.page > 1) setPage(pagination.page - 1)
      else refetch()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete influencer')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { key: 'fullName', label: 'Name', render: (r) => <span className="font-medium text-gray-900">{r.fullName}</span> },
    { key: 'email', label: 'Email' },
    { key: 'mobileNumber', label: 'Mobile' },
    { key: 'city', label: 'City' },
    { key: 'gender', label: 'Gender', render: (r) => r.gender || '—' },
    {
      key: 'created_at',
      label: 'Registered',
      render: (r) => formatDate(r.created_at || r.createdAt),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Influencers" subtitle={`${pagination.total} total influencers`} />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, email, mobile…" />
        <SelectInput value={gender} onChange={setGender} options={genderOptions} placeholder="All genders" />
        <button
          type="button"
          onClick={applyFilters}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          Apply
        </button>
      </div>

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
                <ActionButton onClick={() => { setDetail(null); setDetailError(''); setDetailLoading(true); setDetailId(row.id) }}>View</ActionButton>
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

      <Modal open={detailId !== null} onClose={() => setDetailId(null)} title="Influencer Details">
        {detailLoading && <Spinner />}
        <ErrorAlert message={detailError} />
        {detail && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="text-gray-500">Full Name</dt><dd className="font-medium text-gray-900">{detail.fullName}</dd></div>
            <div><dt className="text-gray-500">Email</dt><dd className="font-medium text-gray-900">{detail.email}</dd></div>
            <div><dt className="text-gray-500">Mobile</dt><dd className="font-medium text-gray-900">{detail.mobileNumber}</dd></div>
            <div><dt className="text-gray-500">City</dt><dd className="font-medium text-gray-900">{detail.city}</dd></div>
            <div><dt className="text-gray-500">Gender</dt><dd className="font-medium text-gray-900">{detail.gender || '—'}</dd></div>
            <div><dt className="text-gray-500">Date of Birth</dt><dd className="font-medium text-gray-900">{formatDate(detail.dob)}</dd></div>
            <div><dt className="text-gray-500">Influencer ID</dt><dd className="font-medium text-gray-900">{detail.id}</dd></div>
          </dl>
        )}
      </Modal>

      {editId !== null && (
        <EditInfluencerModal
          key={editId}
          influencerId={editId}
          onClose={() => setEditId(null)}
          onSaved={() => {
            setEditId(null)
            setSuccess('Influencer updated successfully.')
            setPage(1)
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => { if (!deleting) setDeleteTarget(null) }}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Influencer"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This action cannot be undone.`}
      />
    </div>
  )
}