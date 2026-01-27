// Status Badge Component
const StatusBadge = ({ promotion }) => {
  const now = new Date();
  const startDate = new Date(promotion.start_date);
  const endDate = new Date(promotion.end_date);

  if (!promotion?.isEnabled)
    return (
      <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
        Disabled
      </span>
    );
  if (now < startDate)
    return (
      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
        Upcoming
      </span>
    );
  if (now >= startDate && now <= endDate)
    return (
      <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
        Active
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
      Expired
    </span>
  );
};

export default StatusBadge;
