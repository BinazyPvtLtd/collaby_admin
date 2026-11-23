import { useState, useEffect } from "react";
import { adminApi } from "../api/adminApi";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category_name: "", status: true });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (search) params.search = search;
      if (statusFilter !== "") params.status = statusFilter;
      const res = await adminApi.listCategories(params);
      setCategories(res.data.data);
      setPagination(p => ({ ...p, total: res.data.pagination.total, totalPages: res.data.pagination.totalPages }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, [pagination.page, search, statusFilter]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const openCreateModal = () => {
    setEditing(null);
    setForm({ category_name: "", status: true });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditing(cat);
    setForm({ category_name: cat.category_name, status: cat.status });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ category_name: "", status: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editing) {
        await adminApi.updateCategory(editing.id, form);
      } else {
        await adminApi.createCategory(form);
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setError("");
    try {
      await adminApi.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
      <div className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <button onClick={openCreateModal} className="rounded-lg bg-[#4355a5] hover:bg-[#35468f] text-white font-medium px-4 py-2 text-sm transition-colors">
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={handleSearch}
            className="w-full sm:w-72 h-11 rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#4355a5]/25 focus:border-[#4355a5]"
          />
        </div>
        <select value={statusFilter} onChange={handleStatusChange} className="w-full sm:w-auto max-w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4355a5]/25 focus:border-[#4355a5]">
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Created</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading…</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No categories found</td></tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.category_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex min-h-6 items-center px-2.5 py-1 rounded-md text-[12px] leading-4 font-medium ${cat.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {cat.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(cat.created_at || cat.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditModal(cat)} className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 rounded-md text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(cat.id)} className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 rounded-md text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{editing ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={form.category_name}
                  onChange={e => setForm(f => ({ ...f, category_name: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4355a5]/25 focus:border-[#4355a5]"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value === "true" }))} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4355a5]/25 focus:border-[#4355a5]">
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-[#4355a5] hover:bg-[#35468f] text-white text-sm font-medium disabled:opacity-50">
                  {submitting ? "Saving…" : (editing ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
