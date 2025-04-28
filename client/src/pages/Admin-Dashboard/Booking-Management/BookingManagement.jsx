import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BookingDetailsModal from
  "../../../components/Admin-Dashboard/Booking-Management/Booking-Details-Modal/BookingDetailsModal";
import TableRow from "../../../components/Admin-Dashboard/Booking-Management/Table-Row/TableRow";
import { GetBookings } from "../../../apis/Booking/booking.api";
import HeaderAndFilter from "../../../components/Admin-Dashboard/Booking-Management/Header-And-Filter/HeaderAndFilter";
import Loading from "../../../components/shared/Loading/Loading";

export default function BookingManagement() {
  // Const variables
  const TABLE_HEADERS = [
    "STUDIO",
    "DATE",
    "PERSONAL INFO",
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
  const totalPages = Math.ceil((bookingsData?.data?.total || 0) / ITEMS_PER_PAGE);

  const handleFilterChange = (newFilters) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters({
      ...filters,
      status: newFilters.status === 'all' ? '' : newFilters.status,
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

  if (isLoading) return <Loading />

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
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table rows */}
            {
              bookings.length > 0
                ? <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {bookings?.map((booking) => (
                      <TableRow booking={booking} setSelectedBooking={setSelectedBooking} key={booking._id} />
                    ))}
                  </AnimatePresence>
                </tbody>
                : <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-600 text-xl font-semibold">
                      No bookings found
                    </td>
                  </tr>
                </tbody>
            }
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md
          text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
          rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, bookingsData?.data?.total || 0)}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, bookingsData?.data?.total || 0)}
                  </span>{' '}
                  of <span className="font-medium">{bookingsData?.data?.total || 0}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white
              text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button key={index + 1} onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index
                        + 1
                        ? 'z-10 bg-main border-main text-white'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white
              text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Booking Details Modal */}
      {selectedBooking && <BookingDetailsModal booking={selectedBooking} closeModel={() => setSelectedBooking(null)} />}
    </div>
  );
}