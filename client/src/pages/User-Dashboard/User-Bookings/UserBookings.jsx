import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDateFormat from '../../../hooks/useDateFormat';
import usePriceFormat from '../../../hooks/usePriceFormat';
import { GetUserBookings } from '../../../apis/Booking/booking.api';
import BookingInfoModel from '../../../components/shared/Booking-Info-Model/BookingInfoModel';

const statusClasses = {
  approved: "bg-gradient-to-r from-green-500 to-green-600 text-white",
  pending: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
  rejected: "bg-gradient-to-r from-red-500 to-red-600 text-white",
}

const statusIcons = {
  approved: "fa-solid fa-circle-check",
  pending: "fa-solid fa-clock",
  rejected: "fa-solid fa-circle-xmark",
}

// Using the provided data structure
const UserBookings = () => {
  const { data: userBooking, isLoading } = GetUserBookings()
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const formatDate = useDateFormat()
  const priceFormat = usePriceFormat()



  const ITEMS_PER_PAGE = 6

  // Filter bookings based on status and search term
  const filteredBookings = userBooking?.data?.filter((booking) => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus
    const matchesSearch =
      booking.studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalPages = Math.ceil(filteredBookings?.length / ITEMS_PER_PAGE)
  const bookings = filteredBookings?.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const convertTo12HourFormat = (time) => {
    if (!time) return ""
    const [hour, minute] = time.split(":")
    const hour12 = hour % 12 || 12
    const amPm = hour < 12 ? "AM" : "PM"
    return `${hour12}:${minute} ${amPm}`
  }

  // Calculate days remaining until booking date
  const getDaysRemaining = (dateString) => {
    const bookingDate = new Date(dateString)
    const today = new Date()
    const diffTime = bookingDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-gray-800 bg-gradient-to-r from-main to-main/80 bg-clip-text text-transparent">
          My Bookings
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Manage and track all your studio bookings in one place</p>
      </motion.div>

      {/* Search and Filter Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-white rounded-2xl shadow-md p-4 md:p-6"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-2/3">
            <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search by studio or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-main/30 focus:border-main transition"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar [&_button]:mb-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-xl font-medium transition whitespace-nowrap ${filterStatus === "all" ? "bg-main text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-4 py-2 rounded-xl font-medium transition whitespace-nowrap ${filterStatus === "pending" ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <i className="fa-solid fa-clock mr-2"></i>Pending
            </button>
            <button
              onClick={() => setFilterStatus("approved")}
              className={`px-4 py-2 rounded-xl font-medium transition whitespace-nowrap ${filterStatus === "approved" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <i className="fa-solid fa-circle-check mr-2"></i>Approved
            </button>
            <button
              onClick={() => setFilterStatus("rejected")}
              className={`px-4 py-2 rounded-xl font-medium transition whitespace-nowrap ${filterStatus === "rejected" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <i className="fa-solid fa-circle-xmark mr-2"></i>Rejected
            </button>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-md p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="space-y-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="mt-6">
                <div className="h-10 bg-gray-200 rounded-full w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-3xl shadow-md"
        >
          <i className="fa-regular fa-calendar-xmark text-6xl text-gray-400 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600">No Bookings Found</h2>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "You haven't made any bookings yet. Ready to book your first studio session?"}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <button className="mt-6 px-6 py-3 bg-main text-white rounded-xl font-medium hover:bg-main/90 transition">
              Book a Studio
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {userBooking?.data?.map((booking, index) => {
            const daysRemaining = getDaysRemaining(booking.date)
            const isUpcoming = daysRemaining >= 0

            return (
              <motion.div
                key={booking._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Studio Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={booking.studio.thumbnail || "/placeholder.svg?height=160&width=400"}
                    alt={booking.studio.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h2 className="text-2xl font-bold truncate">{booking.studio.name}</h2>
                    <div className="flex items-center mt-1">
                      <i className="fa-solid fa-calendar-days mr-2"></i>
                      <span className="text-sm">{formatDate(booking.date, "short")}</span>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1 ${statusClasses[booking.status]}`}
                    >
                      <i className={`${statusIcons[booking.status]} text-xs`}></i>
                      {booking.status}
                    </span>
                  </div>
                  {isUpcoming && booking.status !== "rejected" && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/70 text-white">
                        {daysRemaining === 0 ? "Today" : `${daysRemaining} days left`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <i className="fa-solid fa-clock mr-3 text-lg w-5 text-main"></i>
                      <span>
                        {convertTo12HourFormat(booking.startSlot)} - {convertTo12HourFormat(booking.endSlot)}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <i className="fa-solid fa-user mr-3 text-lg w-5 text-main"></i>
                      <span className="truncate">{booking.personalInfo.fullName}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <i className="fa-solid fa-box mr-3 text-lg w-5 text-main"></i>
                      <span className="truncate">{booking.package?.id?.name || "Custom Booking"}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <i className="fa-solid fa-tag mr-3 text-lg w-5 text-main"></i>
                      <span className="font-semibold text-main">{priceFormat(booking.totalPrice)}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full bg-gradient-to-r from-main to-main/80 text-white py-3 rounded-xl text-lg font-semibold transition hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-circle-info"></i>
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-lg border transition ${currentPage === idx + 1
                  ? "bg-gradient-to-r from-main to-main/80 text-white border-main"
                  : "hover:bg-gray-50"
                  }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      )}

      <AnimatePresence>
        {selectedBooking && (
          <BookingInfoModel
            selectedBooking={selectedBooking}
            setSelectedBooking={setSelectedBooking}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserBookings
