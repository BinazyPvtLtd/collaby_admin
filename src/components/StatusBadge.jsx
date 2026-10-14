const statusColorMap = {
  // common
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-700",
  completed: "bg-emerald-100 text-emerald-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-700",

  // campaigns
  Draft: "bg-gray-100 text-gray-700",
  Live: "bg-blue-100 text-blue-800",
  Closed: "bg-purple-100 text-purple-800",
  Completed: "bg-emerald-100 text-emerald-800",

  // deals
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-indigo-100 text-indigo-800",
};

function normalize(value) {
  if (value === null || value === undefined) return "—";
  const key = String(value).toLowerCase();
  return statusColorMap[key]
    ? statusColorMap[key]
    : "bg-gray-100 text-gray-700";
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${normalize(status)}`}>
      {String(status).replace(/_/g, " ")}
    </span>
  );
}


