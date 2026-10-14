import { useCallback, useEffect, useState } from "react";

export default function useListData(
  fetcher,
  { initialLimit = 10, initialFilters = {} } = {},
) {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(
    async (page = pagination.page, currentFilters = filters) => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit: pagination.limit,
          ...currentFilters,
        };
        const res = await fetcher(params);
        setRows(res.data.data || []);
        setPagination(res.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [fetcher, pagination.limit],
  );

  useEffect(() => {
    fetchData(1, filters);
  }, [filters, pagination.limit]);

  const setPage = (page) => {
    if (page < 1) return;
    fetchData(page, filters);
  };

  const setLimit = (limit) => {
    setPagination((p) => ({ ...p, limit, page: 1 }));
  };

  const refetch = () => fetchData(pagination.page, filters);

  return {
    rows,
    pagination,
    filters,
    setFilters,
    setPage,
    setLimit,
    refetch,
    loading,
    error,
  };
}
