import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GetBookings } from "@/apis/Booking/booking.api";
import { Loading } from '@/components/common';
import { BookingDetailsModal, HeaderAndFilter, Pagination, TableRow } from "./_components"

export default function BookingManagement() {
  // Const variables
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

  // State variables
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    studioId: "",
    date: "",
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // get all bookings
  const { data: bookingsData, isLoading } = GetBookings(filters);

  const bookings = bookingsData?.data?.bookings || [];
  const totalPages = Math.ceil(
    (bookingsData?.data?.total || 0) / ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters({
      ...filters,
      status: newFilters.status === "all" ? "" : newFilters.status,
      studioId: newFilters.studioId,
      date: newFilters.date,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setFilters({
      ...filters,
      page: newPage,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      {/* Header and Filter */}
      <HeaderAndFilter onFilterChange={handleFilterChange} />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table headers */}
            <thead className="bg-gray-50">
              <tr>
                {TABLE_HEADERS.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table rows */}
            {bookings.length > 0 ? (
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {bookings?.map((booking) => (
                    <TableRow
                      booking={booking}
                      setSelectedBooking={setSelectedBooking}
                      key={booking._id}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            ) : (
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-600 text-xl font-semibold"
                  >
                    No bookings found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && <Pagination />}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
        />
      )}
    </div>
  );
}
