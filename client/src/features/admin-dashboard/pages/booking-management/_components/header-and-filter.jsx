import useGetAllStudios from "@/apis/studios/studios.api";

export default function HeaderAndFilter({ filters, onFilterChange }) {
  const { data: studiosData } = useGetAllStudios();

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field === "studio" ? "studioId" : field]: value,
    };
    onFilterChange(newFilters);
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>

      <div className="flex gap-2">
        <select
          value={filters.studioId}
          onChange={(e) => handleFilterChange("studio", e.target.value)}
          className="focus:ring-main rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none"
        >
          <option value="">All Studios</option>
          {studiosData?.data?.map((studio) => (
            <option key={studio._id} value={studio._id}>
              {studio.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
          className="focus:ring-main rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none"
        />

        <select
          value={filters.status || "all"}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="focus:ring-main rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}
