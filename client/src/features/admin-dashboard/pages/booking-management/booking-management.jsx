import { useGetBookings } from "@/apis/admin/manage-booking.api";
import { Loading } from "@/components/common";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useChangeBookingStatus } from "@/apis/admin/manage-booking.api";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import BookingInfoModel from "@/features/booking/_components/booking-info-model";
import { useQueryClient } from "@tanstack/react-query";
import BookingKanban from "./_components/kanban-board/_kanban-booking";

export default function BookingManagement() {
  const { t } = useLocalization();
  const ITEMS_PER_PAGE = 1000;
  const currentPageRef = useRef(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = {
    status: searchParams.get("status") || "",
    studioId: searchParams.get("studioId") || "",
    date: searchParams.get("date") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: ITEMS_PER_PAGE,
  };

  const [filters, setFilters] = useState(initialFilters);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.studioId) params.studioId = filters.studioId;
    if (filters.date) params.date = filters.date;
    if (filters.page > 1) params.page = filters.page;

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const { data: bookingsData, isLoading } = useGetBookings(filters);
  const bookings = bookingsData?.data?.bookings || [];

  const handleFilterChange = (newFilters) => {
    currentPageRef.current = 1;
    setFilters({
      ...filters,
      status: newFilters.status === "all" ? "" : newFilters.status,
      studioId: newFilters.studioId,
      date: newFilters.date,
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

  if (isLoading) return <Loading />;

  // document.body.style.overflowX = "hidden";

  return (
    <div className="grid h-screen max-w-screen grid-cols-1 grid-rows-[auto_1fr] overflow-hidden bg-gray-50">
      {/* Add Booking Button */}
      <Link
        to={"add"}
        className="bg-main text-canter my-3 ms-auto block w-fit rounded-md px-4 py-2 text-center text-lg font-bold text-white"
      >
        {t("create-new-booking")}
      </Link>

      {/* Kanban Board */}
      <BookingKanban bookings={bookings} onUpdateBooking={handleStatusChange} />

      {/* Model */}
      {selectedBooking && (
        <BookingInfoModel
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
        />
      )}
    </div>
  );
}
