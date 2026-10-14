import { useEffect, useState } from 'react'
import adminApi from '../api/adminApi'
import ConfirmDialog from '../components/ConfirmDialog'
import Spinner from '../components/Spinner'
import { ErrorAlert } from '../components/Feedback'
import PageHeader, { DangerButton } from '../components/PageHeader'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/admin'
const uploadsUrl = (image) => {
  if (!image) return null
  if (image.startsWith('http')) return image
  const base = API_BASE_URL.replace(/\/api\/admin$/, '')
  return `${base}${image}`
}

export default function Banners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchBanners = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminApi.listBanners()
      setBanners(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminApi.deleteBanner(deleteTarget.id)
      setDeleteTarget(null)
      fetchBanners()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete banner')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Banners" subtitle={`${banners.length} banners`} />

      <ErrorAlert message={error} onRetry={fetchBanners} />

      {loading ? (
        <Spinner />
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-16 text-center">
          <p className="text-sm text-gray-400">No banners found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => {
            const src = uploadsUrl(banner.image)
            return (
              <div key={banner.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {src ? (
                  <img src={src} alt={banner.image} className="h-40 w-full object-cover bg-gray-100" />
                ) : (
                  <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Banner #{banner.id}</p>
                    <p className="text-xs text-gray-500">
                      User #{banner.user_id} · {new Date(banner.createdAt || banner.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <DangerButton onClick={() => setDeleteTarget(banner)}>Delete</DangerButton>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Banner"
        message={`Are you sure you want to delete banner #${deleteTarget?.id}? This action cannot be undone.`}
      />
    </div>
  )
}