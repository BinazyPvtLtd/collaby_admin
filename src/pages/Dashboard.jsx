import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import { ErrorAlert } from "../components/Feedback";
import Spinner from "../components/Spinner";

const cardDefs = [
  { key: "totalBusinesses", label: "Businesses" },
  {
    key: "totalInfluencers",
    label: "Influencers",
    
  },
  {
    key: "totalCampaigns",
    label: "Campaigns",
    
  },
  {
    key: "totalApplications",
    label: "Applications",
    
  },
  {
    key: "totalDeals",
    label: "Deals",
    
  },
  {
    key: "totalBanners",
    label: "Banners",
    
  },
  {
    key: "totalProducts",
    label: "Products",
    
  },
  {
    key: "totalReferrals",
    label: "Referrals",
    
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
    <div className="space-y-7">
      <div>
        <h2 className="text-[23px] leading-7 font-medium tracking-[-0.025em] text-[#20232b]">Platform overview</h2>
        <p className="mt-1 text-[13px] text-gray-500">A live view of the Collaby marketplace</p>
      </div>
      <ErrorAlert message={error} onRetry={fetchStats} />

      {stats && (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            {cardDefs.map(({ key, label }) => (
              <div
                key={key}
                className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
                <p className="text-[13px] text-gray-500">{label}</p>
                <p className="text-[30px] leading-9 font-medium tracking-[-0.035em] text-gray-900 mt-3">
                  {stats[key] ?? 0}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2 xl:col-span-1 bg-[#e9edf8] rounded-lg border border-[#dce2f3] p-5 text-[#263568]">
              <p className="text-[13px] text-[#53618c]">Total revenue</p>
              <p className="text-[30px] leading-9 font-medium tracking-[-0.035em] mt-3 tabular-nums">
                ₹{Number(stats.totalRevenue ?? 0).toLocaleString()}
              </p>
              <p className="text-[12px] leading-4 text-[#65719a] mt-2">
                From completed deals
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
              <p className="text-[13px] text-gray-500">Completed deals</p>
              <p className="text-[30px] leading-9 font-medium tracking-[-0.035em] text-gray-900 mt-3">
                {stats.completedDeals ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
              <p className="text-[13px] text-gray-500">Approved deals</p>
              <p className="text-[30px] leading-9 font-medium tracking-[-0.035em] text-gray-900 mt-3">
                {stats.approvedDeals ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
              <p className="text-[13px] text-gray-500">Pending applications</p>
              <p className="text-[30px] leading-9 font-medium tracking-[-0.035em] text-gray-900 mt-3">
                {stats.pendingApplications ?? 0}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
