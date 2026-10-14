import { useState } from 'react'
import adminApi from '../api/adminApi'
import useListData from '../hooks/useListData'
import DataTable from '../components/DataTable'
import Pagination from '../components/Pagination'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import { ErrorAlert } from '../components/Feedback'
import PageHeader, { SearchInput, SelectInput, ActionButton } from '../components/PageHeader'

const typeOptions = ['Paid', 'Reimbursement', 'Barter']
const money = (value) => value == null ? '—' : '₹' + Number(value).toLocaleString('en-IN')
const deliverables = (details) => details
  ? `${details.noOfReels ?? 0} reels, ${details.noOfPosts ?? 0} posts, ${details.noOfStories ?? 0} stories`
  : '—'
const date = (value) => value ? new Date(value).toLocaleDateString('en-IN') : '—'
function Field({ label, children }) {
  return <div><dt className="text-gray-500">{label}</dt><dd className="font-medium text-gray-900 break-words">{children ?? '—'}</dd></div>
}

export default function Campaigns() {
  const [search, setSearch] = useState('')
  const [campaignType, setCampaignType] = useState('')
  const [detail, setDetail] = useState(null)
  const { rows, pagination, setFilters, setPage, refetch, loading, error } = useListData(
    adminApi.listCampaigns, { initialLimit: 10 },
  )
  const columns = [
    { key: 'name', label: 'Campaign', render: (r) => <span className="font-medium">{r.business_hack.campaignName}</span> },
    { key: 'type', label: 'Type', render: (r) => r.business_hack.campaignType },
    { key: 'city', label: 'City', render: (r) => r.business_hack.city },
    { key: 'cost', label: 'Budget / Influencer', render: (r) => money(r.business_hack_details?.costPerInfluencer) },
    { key: 'budget', label: 'Total Budget', render: (r) => money(r.business_hack_details?.totalBudget) },
    { key: 'influencers', label: 'Influencers', render: (r) => r.business_hack_details?.numberOfInfluencersRequired ?? '—' },
    { key: 'deliverables', label: 'Deliverables', render: (r) => deliverables(r.business_hack_details) },
    { key: 'created', label: 'Created', render: (r) => date(r.business_hack.createdAt) },
  ]
  const campaign = detail?.business_hack
  const requirements = detail?.business_hack_details
  const targeting = detail?.business_hack_step3
  const media = detail?.business_hack_step4
  return (
    <div className="space-y-4">
      <PageHeader title="Campaigns" subtitle={`${pagination.total} total campaigns`} />
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by campaign name…" />
        <SelectInput value={campaignType} onChange={setCampaignType} options={typeOptions} placeholder="All types" />
        <button type="button" onClick={() => setFilters({ search: search.trim(), campaignType })}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium">Apply</button>
      </div>
      <ErrorAlert message={error} onRetry={refetch} />
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {loading ? <Spinner /> : <DataTable columns={columns} rows={rows}
          actions={(row) => <ActionButton onClick={() => setDetail(row)}>View</ActionButton>} />}
        <Pagination page={pagination.page} totalPages={pagination.totalPages} total={pagination.total}
          limit={pagination.limit} onPageChange={setPage} />
      </div>
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Campaign Details" maxWidth="max-w-3xl">
        {detail && <div className="space-y-5 text-sm">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Campaign">{campaign.campaignName}</Field>
            <Field label="Campaign ID">{campaign.id}</Field>
            <Field label="Business ID">{campaign.user_id}</Field>
            <Field label="Type">{campaign.campaignType}</Field>
            <Field label="City">{campaign.city}</Field>
            <Field label="State">{campaign.state}</Field>
            <Field label="Budget / Influencer">{money(requirements?.costPerInfluencer)}</Field>
            <Field label="Total Budget">{money(requirements?.totalBudget)}</Field>
            <Field label="Tax">{requirements ? `${requirements.tax}%` : '—'}</Field>
            <Field label="Influencers Needed">{requirements?.numberOfInfluencersRequired}</Field>
            <Field label="Minimum Followers">{requirements?.minimumFollowersRequired}</Field>
            <Field label="Free Product">{requirements ? (requirements.freeProduct ? 'Yes' : 'No') : '—'}</Field>
            <Field label="Deliverables">{deliverables(requirements)}</Field>
            <Field label="Categories">{Array.isArray(targeting?.influencerCategory) ? targeting.influencerCategory.join(', ') : '—'}</Field>
            <Field label="Gender">{targeting?.gender?.join(', ')}</Field>
            <Field label="Age Range">{targeting ? `${targeting.minAge}–${targeting.maxAge}` : '—'}</Field>
            <Field label="Created">{date(campaign.createdAt)}</Field>
          </dl>
          <dl className="space-y-4">
            <Field label="Description">{targeting?.campaignDescription}</Field>
            <Field label="Dos">{targeting?.dos?.join('; ') || '—'}</Field>
            <Field label="Don'ts">{targeting?.donts?.join('; ') || '—'}</Field>
            <Field label="Campaign Image">{media?.campaignImage
              ? <a className="text-indigo-600 underline" href={media.campaignImage} target="_blank" rel="noopener noreferrer">View image</a>
              : 'No image uploaded'}</Field>
            <Field label="Sample Media">{media?.sampleMedia?.length
              ? <div className="flex flex-wrap gap-3">{media.sampleMedia.map((url, i) => <a key={`${url}-${i}`} className="text-indigo-600 underline" href={url} target="_blank" rel="noopener noreferrer">Sample {i + 1}</a>)}</div>
              : 'No sample media uploaded'}</Field>
          </dl>
        </div>}
      </Modal>
    </div>
  )
}
