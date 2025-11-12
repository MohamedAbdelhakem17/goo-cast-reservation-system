import { useGetBookings } from "@/apis/admin/manage-booking.api";
import { Loading } from "@/components/common";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useChangeBookingStatus } from "@/apis/admin/manage-booking.api";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import BookingInfoModel from "@/features/booking/_components/booking-info-model";
import { useQueryClient } from "@tanstack/react-query";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import HeaderAndFilter from "./_components/header-and-filter";
import BookingKanban from "./_components/kanban-board/_kanban-booking";

export default function BookingManagement() {
  const { t } = useLocalization();
  const ITEMS_PER_PAGE = 1000;
  const currentPageRef = useRef(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial filters including searchId
  const initialFilters = {
    status: searchParams.get("status") || "",
    studioId: searchParams.get("studioId") || "",
    date: searchParams.get("date") || "",
    searchId: searchParams.get("searchId") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: ITEMS_PER_PAGE,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Update URL params when filters change
  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.studioId) params.studioId = filters.studioId;
    if (filters.date) params.date = filters.date;
    if (filters.searchId) params.searchId = filters.searchId;
    if (filters.page > 1) params.page = filters.page;

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const { data: bookingsData, isLoading } = useGetBookings({
    ...filters,
    // Optional: could filter client-side instead of API
  });

  // Filter bookings client-side by first 6 chars of ID
  const bookings = bookingsData?.data?.bookings || [];
  const filteredBookings = bookings.filter((b) =>
    filters.searchId ? b._id.slice(0, 6).includes(filters.searchId) : true,
  );

  const handleFilterChange = (newFilters) => {
    currentPageRef.current = 1;
    setFilters({
      ...filters,
      status: newFilters.status === "all" ? "" : newFilters.status,
      studioId: newFilters.studioId,
      date: newFilters.date,
      searchId: newFilters.searchId || "",
      page: currentPageRef.current,
    });
  };

  const { changeStatus } = useChangeBookingStatus();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusChange = (id, status) => {
    changeStatus(
      { id, status },
      {
        onSuccess: ({ message }) => {
          addToast(message || t("status-changed-successfully"), "success");
          queryClient.invalidateQueries({ queryKey: ["get-bookings"] });
        },
        onError: ({ response }) =>
          addToast(response?.data?.message || t("something-went-wrong"), "error"),
      },
    );
  };

  return (
    <div className="grid max-w-screen grid-cols-1 grid-rows-[auto_1fr]">
      <div className="border-b border-gray-200">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-medium">Bookings Pipeline</h1>
          <Link
            to={"add"}
            className="bg-main text-canter my-.5 ms-auto block w-fit rounded-md px-2 py-1 text-center text-sm font-semibold text-white"
          >
            {t("create-new-booking")}
          </Link>
        </div>

        {/* Filters + Search */}
        <HeaderAndFilter filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <Loading />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <BookingKanban
            bookings={filteredBookings}
            onUpdateBooking={handleStatusChange}
            setSelectedBooking={setSelectedBooking}
          />
        </DndProvider>
      )}

      {/* Modal */}
      {selectedBooking && (
        <BookingInfoModel
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
        />
      )}
    </div>
  );
}
