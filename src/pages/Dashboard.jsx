import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import { ErrorAlert } from "../components/Feedback";
import Spinner from "../components/Spinner";

const cardDefs = [
  {
    key: "totalBusinesses",
    label: "Businesses",
    icon: "M3 21V8l7-5 11 5v13h-6v-6H9v6H3z",
  },
  {
    key: "totalInfluencers",
    label: "Influencers",
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    key: "totalCampaigns",
    label: "Campaigns",
    icon: "M12 2v20M2 7l20 10M2 17l20-10",
  },
  {
    key: "totalApplications",
    label: "Applications",
    icon: "M9 12h6m-6 4h6M9 8h6M5 21h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z",
  },
  {
    key: "totalDeals",
    label: "Deals",
    icon: "M17 9V7a5 5 0 0 0-10 0v2m-2 0h14v12H5V9zm7 4v4m0 0h.01",
  },
  {
    key: "totalBanners",
    label: "Banners",
    icon: "M4 5h16v14H4zM4 9h16M4 15h16",
  },
  {
    key: "totalProducts",
    label: "Products",
    icon: "M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z",
  },
  {
    key: "totalReferrals",
    label: "Referrals",
    icon: "M13 7l7 5-7 5M5 7l7 5-7 5",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getDashboard();
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
        <p className="text-sm text-gray-500">Platform statistics at a glance</p>
      </div>
      <ErrorAlert message={error} onRetry={fetchStats} />

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardDefs.map(({ key, label, icon }) => (
              <div
                key={key}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{label}</p>
                  <span className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={icon}
                      />
                    </svg>
                  </span>
                </div>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {stats[key] ?? 0}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl p-5 text-white shadow-sm">
              <p className="text-sm text-indigo-100">Total Revenue</p>
              <p className="text-3xl font-semibold mt-2">
                ₹{Number(stats.totalRevenue ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-indigo-200 mt-1">
                From completed deals
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Completed Deals</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {stats.completedDeals ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Approved Deals</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {stats.approvedDeals ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500">Pending Applications</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">
                {stats.pendingApplications ?? 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
