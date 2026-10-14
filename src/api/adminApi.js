import api from "./client";
import { listFourStepCampaigns } from "./campaignListing";

export const adminApi = {
  login: (email, password) => api.post("/login", { email, password }),
  logout: () => api.post("/logout"),
  getDashboard: () => api.get("/dashboard"),

  listBusinesses: (params) => api.get("/businesses", { params }),
  getBusiness: (id) => api.get(`/businesses/${encodeURIComponent(id)}`),
  updateBusiness: (id, data) =>
    api.put(`/businesses/${encodeURIComponent(id)}`, data),
  deleteBusiness: (phone) =>
    api.delete(`/businesses/${encodeURIComponent(phone)}`),

  listInfluencers: (params) => api.get("/influencers", { params }),
  getInfluencer: (id) => api.get(`/influencers/${encodeURIComponent(id)}`),
  updateInfluencer: (id, data) =>
    api.put(`/influencers/${encodeURIComponent(id)}`, data),
  deleteInfluencer: (phone) =>
    api.delete(`/influencers/${encodeURIComponent(phone)}`),

  listCampaigns: listFourStepCampaigns,
  getCampaign: (id) => api.get("/campaigns/" + id),
  updateCampaignStatus: (id, campaignStatus) =>
    api.patch("/campaigns/" + id + "/status", { campaignStatus }),
  deleteCampaign: (id) => api.delete("/campaigns/" + id),

  listApplications: (params) => api.get("/applications", { params }),
  updateApplicationStatus: (id, status) =>
    api.patch("/applications/" + id + "/status", { status }),
  listDeals: (params) => api.get("/deals", { params }),
  getDeal: (id) => api.get(`/deals/${id}`),

  listBanners: () => api.get("/banners"),
  deleteBanner: (id) => api.delete(`/banners/${id}`),

  listProducts: (params) => api.get("/products", { params }),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  listReferrals: (params) => api.get("/referrals", { params }),

  listCategories: (params) => api.get("/categories", { params }),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default adminApi;
