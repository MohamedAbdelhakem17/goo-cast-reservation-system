import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChangeBookingStatus } from '../../../../apis/Booking/booking.api';
import Alert from '../../../shared/Alert/Alert';
import Popup from '../../../shared/Popup/Popup';
import useDataFormat from '../../../../hooks/useDateFormat';
import { useToast } from '../../../../context/Toaster-Context/ToasterContext';

export default function TableRow({ booking, setSelectedBooking }) {
    const formatDate = useDataFormat()
    const convertTo12HourFormat = (time) => {
        const [hour, minute] = time.split(':');
        const hour12 = hour % 12 || 12;
        const amPm = hour < 12 ? 'AM' : 'PM';
        return `${hour12}:${minute} ${amPm}`;
    };

    const { mutate: statusChange, isLoading } = ChangeBookingStatus()
    const { addToast } = useToast()
    const [confirmPopup, setConfirmPopup] = useState(null)

    const handleStatusChange = () => {
        statusChange(
            { id: booking._id, payload: { status: confirmPopup.status } },
            {
                onSuccess: ({ message }) => addToast(message || "Status changed successfully", "success"),
                onError: ({ response }) => addToast(response?.data?.message || "Something went wrong", "error"),
            }
        );
    };


    return (
        <>
            <motion.tr
                onDoubleClick={() => setSelectedBooking(booking)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="hover:bg-gray-50"
            >
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.personalInfo.fullName}</div>
                    <div className="text-sm text-gray-500">{booking.personalInfo.email}</div>
                    <div className={`text-sm text-gray-500 font-bold ${booking.isGuest ? "text-red-600" : "text-green-600"}`}>{booking.isGuest ? "Guest" : "Member"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 cursor-pointer">{booking?.studio?.name || "Studio Name"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                    <div className="text-sm text-gray-500">{convertTo12HourFormat(booking?.timeSlot || booking?.startSlot)} - {convertTo12HourFormat(booking?.timeSlot || booking?.endSlot)}</div>
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
                                'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md font-bold space-x-2">
                    {booking.status === 'pending' && (
                        <>
                            <button
                                onClick={() => setConfirmPopup({ status: 'approved' })}
                                disabled={isLoading}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => setConfirmPopup({ status: 'rejected' })}
                                disabled={isLoading}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </>
                    )}
                </td>
            </motion.tr>

            <AnimatePresence mode="wait">
                {confirmPopup && (
                    <Popup>
                        <h3 className="text-lg font-semibold mb-4">Confirm Change Status</h3>
                        <p className="mb-2">
                            Are you sure you want to
                            <span className={`font-bold ${confirmPopup.status === 'approved' ? 'text-green-600' : 'text-main'} mx-1`}>{confirmPopup.status}</span>
                            this booking?
                        </p>
                        <ul className="text-sm text-gray-700 mb-4 list-disc list-inside">
                            <li><strong>Studio:</strong> {booking?.studio?.name}</li>
                            <li><strong>Date:</strong> {formatDate(booking.date)}</li>
                            <li><strong>Time:</strong> {convertTo12HourFormat(booking.startSlot)}</li>
                            <li><strong>Duration:</strong> {booking.duration} hour(s)</li>
                        </ul>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmPopup(null)}
                                className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusChange}
                                disabled={isLoading}
                                className={`cursor-pointer px-4 py-2 ${confirmPopup.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-main/90 hover:bg-main'} text-white rounded-lg  transition-colors`}
                            >
                                Confirm
                            </button>
                        </div>
                    </Popup>
                )}

            </AnimatePresence>
        </>
    );
}