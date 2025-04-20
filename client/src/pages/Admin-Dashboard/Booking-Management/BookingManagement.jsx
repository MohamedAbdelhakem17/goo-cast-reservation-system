import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import BASE_URL from '../../../apis/BASE_URL'
import BookingDetailsModal from './BookingDetailsModal'

const dummyBookings = [
  {
    _id: '1',
    studio: {
      name: 'Studio A - Premium Recording',
      id: 'studio_1'
    },
    date: '2025-04-20T10:00:00Z',
    timeSlot: '10:00 AM - 2:00 PM',
    duration: 4,
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+20 123-456-7890'
    },
    totalPrice: 1200,
    status: 'pending',
    notes: 'Need acoustic guitar setup',
    bookingReference: 'BK-2025042001'
  },
  {
    _id: '2',
    studio: {
      name: 'Studio B - Video Production',
      id: 'studio_2'
    },
    date: '2025-04-21T14:00:00Z',
    timeSlot: '2:00 PM - 5:00 PM',
    duration: 3,
    personalInfo: {
      fullName: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      phone: '+20 123-456-7891'
    },
    totalPrice: 900,
    status: 'approved',
    notes: 'Green screen required',
    bookingReference: 'BK-2025042102',
    paymentStatus: 'paid'
  },
  {
    _id: '3',
    studio: {
      name: 'Studio C - Podcast Suite',
      id: 'studio_3'
    },
    date: '2025-04-22T09:00:00Z',
    timeSlot: '9:00 AM - 11:00 AM',
    duration: 2,
    personalInfo: {
      fullName: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '+20 123-456-7892'
    },
    totalPrice: 500,
    status: 'rejected',
    notes: 'Cancellation requested by customer',
    bookingReference: 'BK-2025042203'
  },
  {
    _id: '4',
    studio: {
      name: 'Studio A - Premium Recording',
      id: 'studio_1'
    },
    date: '2025-04-23T13:00:00Z',
    timeSlot: '1:00 PM - 5:00 PM',
    duration: 4,
    personalInfo: {
      fullName: 'Emma Wilson',
      email: 'emma.w@example.com',
      phone: '+20 123-456-7893'
    },
    totalPrice: 1200,
    status: 'pending',
    notes: 'Full band recording session',
    bookingReference: 'BK-2025042304'
  },
  {
    _id: '5',
    studio: {
      name: 'Studio B - Video Production',
      id: 'studio_2'
    },
    date: '2025-04-24T11:00:00Z',
    timeSlot: '11:00 AM - 3:00 PM',
    duration: 4,
    personalInfo: {
      fullName: 'Alex Thompson',
      email: 'alex.t@example.com',
      phone: '+20 123-456-7894'
    },
    totalPrice: 1500,
    status: 'approved',
    notes: 'Product photography session',
    bookingReference: 'BK-2025042405',
    paymentStatus: 'pending'
  }
];

export default function BookingManagement() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const queryClient = useQueryClient()

  // Mock the useQuery hook with dummy data
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['bookings', filterStatus],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let filteredBookings = dummyBookings;
      if (filterStatus !== 'all') {
        filteredBookings = dummyBookings.filter(booking => booking.status === filterStatus);
      }
      return { data: filteredBookings };
    }
  })

  // Mock the update status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ bookingId, status }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
    }
  })

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateStatus.mutateAsync({ bookingId, status: newStatus })
    } catch (error) {
      console.error('Error updating status:', error)
      // TODO: Add error notification
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
      </div>
    )
  }

  const bookings = bookingsData?.data || []

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Booking Management</h1>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
          >
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Studio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {bookings.map((booking) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.studio.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                      <div className="text-sm text-gray-500">{booking.timeSlot}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.personalInfo.fullName}</div>
                      <div className="text-sm text-gray-500">{booking.personalInfo.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.duration} hour(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.totalPrice.toLocaleString()} EGP</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-main hover:text-main/80"
                      >
                        View Details
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking._id, 'approved')}
                            disabled={updateStatus.isLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking._id, 'rejected')}
                            disabled={updateStatus.isLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
        />
      )}
    </div>
  )
}