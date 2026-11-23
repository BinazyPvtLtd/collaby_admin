const statusColorMap = {
  // common
  pending: "bg-[#f5f0df] text-[#725c22]",
  accepted: "bg-[#e5f1e9] text-[#356347]",
  approved: "bg-[#e5f1e9] text-[#356347]",
  rejected: "bg-[#f6e8e8] text-[#8a4144]",
  withdrawn: "bg-gray-100 text-gray-600",
  completed: "bg-[#e5f1e9] text-[#356347]",
  active: "bg-[#e5f1e9] text-[#356347]",
  inactive: "bg-gray-100 text-gray-600",

  // campaigns
  Draft: "bg-gray-100 text-gray-600",
  Live: "bg-[#e7ebf8] text-[#394b91]",
  Closed: "bg-gray-100 text-gray-600",
  Completed: "bg-[#e5f1e9] text-[#356347]",

  // deals
  submitted: "bg-[#e7ebf8] text-[#394b91]",
  under_review: "bg-[#e7ebf8] text-[#394b91]",
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
      className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium capitalize ${normalize(status)}`}>
      {String(status).replace(/_/g, " ")}
    </span>
  );
}


