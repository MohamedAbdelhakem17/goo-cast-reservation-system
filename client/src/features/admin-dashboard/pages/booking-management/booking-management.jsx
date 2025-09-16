import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loading } from "@/components/common";
import { useGetBookings } from "@/apis/admin/manage-booking.api";
import { HeaderAndFilter, Pagination } from "./_components";

import DisplayBookingData from "./_components/display-booking-data";
import BookingInfoModel from "@/features/booking/_components/booking-info-model";

export default function BookingManagement() {
  const ITEMS_PER_PAGE = 10;
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

  // get all bookings
  const { data: bookingsData, isLoading, error } = useGetBookings(filters);
  const bookings = bookingsData?.data?.bookings || [];
  const totalPages = Math.ceil((bookingsData?.data?.total || 0) / ITEMS_PER_PAGE);

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

  const handlePageChange = (newPage) => {
    currentPageRef.current = newPage;
    setFilters({
      ...filters,
      page: currentPageRef.current,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="py-6">
      <HeaderAndFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="p-3">
        <DisplayBookingData
          bookingsData={bookings}
          isLoading={isLoading}
          error={error}
          setSelectedBooking={setSelectedBooking}
        />

        {totalPages > 1 && (
          <Pagination
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            currentPage={currentPageRef.current}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            bookingsData={bookings}
          />
        )}
      </div>

      {selectedBooking && (
        <BookingInfoModel
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
        />
      )}
    </div>
  );
}
