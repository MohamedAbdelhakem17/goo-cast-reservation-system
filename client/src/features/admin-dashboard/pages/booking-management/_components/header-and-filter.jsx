// _components/header-and-filter.jsx
import { useGetStudio } from "@/apis/public/studio.api";
import { SelectInput } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { CircleX } from "lucide-react";

export default function HeaderAndFilter({ filters, onFilterChange }) {
  const { t, lng } = useLocalization();
  const { data: studiosData } = useGetStudio();

  // -------------------------------
  // Handle Filters
  // -------------------------------
  const handleFilterChange = (field, value) => {
    const key = field === "studio" ? "studioId" : field;

    const updatedFilters = {
      ...filters,
      [key]: value === "all" ? "" : value,
    };

    // Reset date when selecting range
    if (key === "range") {
      updatedFilters.date = "";
    }

    // Reset range when selecting manual date
    if (key === "date") {
      updatedFilters.range = "";
    }

    onFilterChange(updatedFilters);
  };

  // -------------------------------
  // Options
  // -------------------------------
  const statusOptions = [
    { value: "", label: t("all") },
    { value: "new", label: t("new") },
    { value: "paid", label: t("paid") },
    { value: "completed", label: t("completed") },
    { value: "canceled", label: t("canceled") },
  ];

  const studioOptions = [
    { value: "all", label: t("all-studios") },
    ...(studiosData?.data?.map((studio) => ({
      value: studio._id,
      label: studio.name?.[lng],
    })) || []),
  ];

  const ranges = [
    { label: t("today"), value: "today" },
    { label: t("this-week"), value: "this-week" },
    { label: t("this-month"), value: "this-month" },
  ];

  return (
    <>
      {/* Search */}
      <div className="mb-2 w-full max-w-lg">
        <input
          type="text"
          placeholder={t("search-by-id")}
          value={filters.searchId || ""}
          onChange={(e) => handleFilterChange("searchId", e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder-gray-400 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="grid gap-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:items-end lg:gap-2">
        <SelectInput
          value={filters.studioId || "all"}
          onChange={(e) => handleFilterChange("studio", e.target.value)}
          options={studioOptions}
          className="w-full min-w-[250px] py-0.5 lg:w-auto"
        />

        <SelectInput
          value={filters.status || "all"}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          options={statusOptions}
          className="w-full min-w-[250px] py-0.5 lg:w-auto"
        />

        {/* Date Picker */}
        <div className="relative mb-6">
          <input
            id="date"
            name="date"
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="w-full min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-700 shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 lg:w-auto"
          />

          {filters.date && (
            <button
              onClick={() => handleFilterChange("date", "")}
              className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
              type="button"
              title="Clear date filter"
            >
              <CircleX className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* -------- Range Filters with Active State -------- */}
      <div className="flex items-center gap-2">
        {ranges.map((item) => {
          const active = filters.range === item.value;

          return (
            <button
              key={item.value}
              onClick={() => handleFilterChange("range", item.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-all ${
                active
                  ? "bg-main text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
