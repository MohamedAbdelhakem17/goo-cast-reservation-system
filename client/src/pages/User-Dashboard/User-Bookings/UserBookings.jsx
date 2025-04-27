import React from 'react';

const dummyBookings = [
  {
    id: 1,
    studioName: 'Elite Studio',
    date: '2025-05-01',
    time: '10:00 AM - 12:00 PM',
    status: 'Confirmed',
  },
  {
    id: 2,
    studioName: 'Premium Studio',
    date: '2025-05-03',
    time: '2:00 PM - 5:00 PM',
    status: 'Pending',
  },
  {
    id: 3,
    studioName: 'Luxury Studio',
    date: '2025-05-05',
    time: '6:00 PM - 9:00 PM',
    status: 'Cancelled',
  },
];

const statusClasses = {
  Confirmed: 'text-green-500 bg-green-100',
  Pending: 'text-yellow-500 bg-yellow-100',
  Cancelled: 'text-red-500 bg-red-100',
};

const UserBookings = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">My Bookings</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{booking.studioName}</h2>

              <div className="flex items-center text-gray-600 mb-2">
                <i className="fa-solid fa-calendar-days mr-2 text-lg"></i>
                <span>{booking.date}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <i className="fa-solid fa-clock mr-2 text-lg"></i>
                <span>{booking.time}</span>
              </div>

              <div className="flex items-center text-gray-600 mt-4">
                <i className="fa-solid fa-circle-info mr-2 text-lg"></i>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full text-lg font-semibold transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;
