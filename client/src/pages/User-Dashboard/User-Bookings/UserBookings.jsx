import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDateFormat from '../../../hooks/useDateFormat';
import usePriceFormat from '../../../hooks/usePriceFormat';

const statusClasses = {
  approved: 'text-green-500 bg-green-100',
  pending: 'text-yellow-500 bg-yellow-100',
  rejected: 'text-red-500 bg-red-100',
};

// Dummy data
const dummyBookings = [
  {
    _id: '1',
    studio: { name: 'Studio One' },
    date: '2025-05-01',
    timeSlot: '14:00',
    duration: 2,
    personalInfo: { fullName: 'John Doe' },
    totalPrice: 150,
    status: 'approved',
    package: { name: 'Standard Package', price: 100 },
    addOns: [
      { name: 'Extra Light', quantity: 1, price: 25 },
      { name: 'Backdrop', quantity: 1, price: 25 },
    ],
  },
  {
    _id: '2',
    studio: { name: 'Studio Two' },
    date: '2025-05-05',
    timeSlot: '10:30',
    duration: 1,
    personalInfo: { fullName: 'Jane Smith' },
    totalPrice: 90,
    status: 'pending',
    package: null,
    addOns: [],
  },
  // Add more items if needed
];

const ITEMS_PER_PAGE = 6;

const UserBookings = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formatDate = useDateFormat();
  const priceFormat = usePriceFormat();

  const totalPages = Math.ceil(dummyBookings.length / ITEMS_PER_PAGE);
  const bookings = dummyBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const convertTo12HourFormat = (time) => {
    if (!time) return '';
    const [hour, minute] = time.split(':');
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? 'AM' : 'PM';
    return `${hour12}:${minute} ${amPm}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-10 text-center text-gray-800"
      >
        My Bookings
      </motion.h1>

      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <i className="fa-regular fa-calendar-xmark text-6xl text-gray-400 mb-4"></i>
          <h2 className="text-2xl font-semibold text-gray-600">No Bookings Found</h2>
          <p className="text-gray-500 mt-2">You haven't made any bookings yet.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {bookings.map((booking) => (
            <motion.div
              key={booking._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">{booking?.studio?.name}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusClasses[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <i className="fa-solid fa-calendar-days mr-3 text-lg w-5"></i>
                    <span>{formatDate(booking.date)}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <i className="fa-solid fa-clock mr-3 text-lg w-5"></i>
                    <span>{convertTo12HourFormat(booking.timeSlot)} ({booking.duration}hr)</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <i className="fa-solid fa-user mr-3 text-lg w-5"></i>
                    <span>{booking.personalInfo.fullName}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <i className="fa-solid fa-tag mr-3 text-lg w-5"></i>
                    <span className="font-semibold text-main">
                      {priceFormat(booking.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="flex-1 bg-main text-white py-2 rounded-full text-lg font-semibold transition hover:bg-main/90"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-lg border ${currentPage === idx + 1
                    ? 'bg-main text-white'
                    : 'hover:bg-gray-50'
                  }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      )}

      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fa-solid fa-xmark text-2xl"></i>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Studio Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">Name: {selectedBooking?.studio?.name}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Time</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">Date: {formatDate(selectedBooking.date)}</p>
                      <p className="text-gray-600">Time: {convertTo12HourFormat(selectedBooking.timeSlot)}</p>
                      <p className="text-gray-600">Duration: {selectedBooking.duration} hour(s)</p>
                    </div>
                  </div>

                  {selectedBooking.package && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Package Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-600">Name: {selectedBooking.package.name}</p>
                        <p className="text-gray-600">Price: {priceFormat(selectedBooking.package.price)}</p>
                      </div>
                    </div>
                  )}

                  {selectedBooking.addOns && selectedBooking.addOns.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Add-ons</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {selectedBooking.addOns.map((addon, index) => (
                          <div key={index} className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">{addon.name}</span>
                            <span className="text-gray-600">
                              {addon.quantity} x {priceFormat(addon.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-semibold">Total Price:</span>
                        <span className="text-xl font-bold text-main">
                          {priceFormat(selectedBooking.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Status</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${statusClasses[selectedBooking.status]
                          }`}
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserBookings;
