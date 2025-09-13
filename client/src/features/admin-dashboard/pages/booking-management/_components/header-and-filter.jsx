import useGetAllStudios from "@/apis/studios/studios.api";
import { SelectInput, Input } from "@/components/common";

export default function HeaderAndFilter({ filters, onFilterChange }) {
  const { data: studiosData } = useGetAllStudios();

  const handleFilterChange = (field, value) => {
    const newFilters = {
      ...filters,
      [field === "studio" ? "studioId" : field]: value === "all" ? "" : value,
    };
    onFilterChange(newFilters);
  };

  const statusOptions = [
    { value: "all", label: "All Bookings" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const studioOptions = [
    { value: "all", label: "All Studios" },
    ...(studiosData?.data?.map((studio) => ({
      value: studio._id,
      label: studio.name,
    })) || []),
  ];

  return (
    <div className="mb-6 space-y-4 lg:flex lg:items-center lg:justify-between lg:space-y-0">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:items-end lg:gap-4">
        <SelectInput
          value={filters.studioId || "all"}
          onChange={(e) => handleFilterChange("studio", e.target.value)}
          options={studioOptions}
          className="w-full min-w-[200px] lg:w-auto"
        />

        <div className="relative">
          <Input
            id="date"
            name="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            type="date"
            className="w-full min-w-[180px] pr-8 lg:w-auto"
          />
          {filters.date && (
            <button
              onClick={() => handleFilterChange("date", "")}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
              type="button"
              title="Clear date filter"
            >
              ✕
            </button>
          )}
        </div>

        <SelectInput
          value={filters.status || "all"}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          options={statusOptions}
          className="w-full min-w-[180px] lg:w-auto"
        />
      </div>
    </div>
  );
}
