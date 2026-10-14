import { useState } from 'react'
import adminApi from '../api/adminApi'
import useListData from '../hooks/useListData'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import { ErrorAlert } from '../components/Feedback'
import PageHeader, { SearchInput, DangerButton } from '../components/PageHeader'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/admin'
const uploadsUrl = (image) => {
  if (!image) return null
  if (image.startsWith('http')) return image
  const base = API_BASE_URL.replace(/\/api\/admin$/, '')
  return `${base}${image}`
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Products() {
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const { rows, pagination, filters, setFilters, setPage, refetch, loading, error } = useListData(
    (params) => adminApi.listProducts(params),
    { initialLimit: 10 },
  )

  const applySearch = () => {
    setFilters(search.trim() ? { search: search.trim() } : {})
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminApi.deleteProduct(deleteTarget.id)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'productImage',
      label: 'Image',
      render: (r) => {
        const src = uploadsUrl(r.productImage)
        return src ? (
          <img src={src} alt={r.productName} className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-gray-100" />
        )
      },
    },
    { key: 'productName', label: 'Name', render: (r) => <span className="font-medium text-gray-900">{r.productName}</span> },
    {
      key: 'productDescription',
      label: 'Description',
      render: (r) => <span className="block max-w-[220px] truncate">{r.productDescription || '—'}</span>,
    },
    { key: 'productQuantity', label: 'Quantity' },
    { key: 'user_id', label: 'User ID' },
    { key: 'created_at', label: 'Created', render: (r) => formatDate(r.created_at || r.createdAt) },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Products" subtitle={`${pagination.total} total products`} />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by product name…" />
        <button
          type="button"
          onClick={applySearch}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
        >
          Search
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
            actions={(row) => <DangerButton onClick={() => setDeleteTarget(row)}>Delete</DangerButton>}
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

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.productName}"? This action cannot be undone.`}
      />
    </div>
  )
}