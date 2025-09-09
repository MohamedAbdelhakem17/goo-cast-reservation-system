import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Loading, ErrorFeedback } from "@/components/common";
import { useGetBookings } from "@/apis/admin/mange-booking.api";
import {
  BookingDetailsModal,
  HeaderAndFilter,
  Pagination,
  TableRow,
} from "./_components";

export default function BookingManagement() {
  const TABLE_HEADERS = [
    "PERSONAL INFO",
    "STUDIO",
    "DATE",
    "DURATION",
    "TOTAL PRICE",
    "STATUS",
    "ACTIONS",
  ];

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
    <div className="p-6">
      <HeaderAndFilter filters={filters} onFilterChange={handleFilterChange} />

      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {TABLE_HEADERS.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {bookings.length > 0 ? (
              <tbody className="divide-y divide-gray-200 bg-white">
                <AnimatePresence>
                  {bookings.map((booking) => (
                    <TableRow
                      booking={booking}
                      setSelectedBooking={setSelectedBooking}
                      key={booking._id}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-xl font-semibold text-gray-600"
                  >
                    {error ? (
                      <ErrorFeedback>
                        {error.response?.data?.message ||
                          error.message ||
                          "Something went wrong"}
                      </ErrorFeedback>
                    ) : (
                      "No bookings found"
                    )}
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination
            ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            currentPage={currentPageRef.current}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            bookingsData={bookingsData}
          />
        )}
      </div>

      {selectedBooking && (
        <BookingDetailsModal
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
        />
      )}
    </div>
  );
}
