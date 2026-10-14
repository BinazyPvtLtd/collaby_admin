import api from './client'

export async function listFourStepCampaigns(params = {}) {
  const baseURL = api.defaults.baseURL.replace(/\/admin\/?$/, '')
  const response = await api.get(`${baseURL}/all-detail/get-all-business-hacks`)
  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error('Invalid campaign listing response')
  }
  const search = (params.search || '').trim().toLowerCase()
  const filtered = response.data.data.filter(({ business_hack: campaign }) =>
    campaign && (!search || campaign.campaignName.toLowerCase().includes(search)) &&
    (!params.campaignType || campaign.campaignType === params.campaignType),
  )
  const limit = Math.max(1, Number(params.limit) || 10)
  const totalPages = Math.ceil(filtered.length / limit)
  const page = Math.max(1, Math.min(Number(params.page) || 1, totalPages || 1))
  return {
    ...response,
    data: {
      ...response.data,
      data: filtered.slice((page - 1) * limit, page * limit).map((entry) => ({
        ...entry,
        id: entry.business_hack.id,
      })),
      pagination: { total: filtered.length, page, limit, totalPages },
    },
  }
}
