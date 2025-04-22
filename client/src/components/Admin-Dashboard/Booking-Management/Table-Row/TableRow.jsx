import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChangeBookingStatus } from '../../../../apis/Booking/booking.api';
import Alert from '../../../shared/Alert/Alert';
import Popup from '../../../shared/Popup/Popup';
import usePriceFormat from '../../../../hooks/usePriceFormat';
import useDateFormat from '../../../../hooks/useDateFormat';
import useTimeConvert from '../../../../hooks/useTimeConvert';
import { UpdateStudio } from '../../../../apis/studios/studios.api';

export default function TableRow({ booking, setSelectedBooking }) {
    const priceFormat = usePriceFormat()
    const formatDate = useDateFormat()
    const convertTo12HourFormat = useTimeConvert();

    const { mutate: statusChange, isLoading: statusLoading } = ChangeBookingStatus()
    const { mutate: updateStudio, isLoading: updateLoading } = UpdateStudio()
    const [message, setMessage] = useState(null)
    const [confirmPopup, setConfirmPopup] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [editData, setEditData] = useState(null)

    const handleStatusChange = () => {
        statusChange({ id: booking._id, status: confirmPopup.status }, {
            onSuccess: () => {
                setMessage("Status changed successfully");
                setConfirmPopup(null);
                setTimeout(() => {
                    setMessage(null);
                }, 1000);
            }
        })
    }

    const handleEdit = () => {
        setEditMode(true)
        setEditData({
            name: booking?.studio?.name,
            price: booking?.studio?.pricePerHour,
            status: booking.status
        })
    }

    const handleUpdate = () => {
        if (!editData) return;

        updateStudio({
            id: booking.studio._id,
            data: {
                name: editData.name,
                pricePerHour: editData.price
            }
        }, {
            onSuccess: () => {
                setMessage("Studio updated successfully");
                setEditMode(false);
                setEditData(null);
                setTimeout(() => {
                    setMessage(null);
                }, 1000);
            }
        })
    }

    return (
        <>
            <motion.tr
                onDoubleClick={() => !editMode && setSelectedBooking(booking)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="hover:bg-gray-50"
            >
                <td className="px-6 py-4 whitespace-nowrap">
                    {editMode ? (
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="border rounded px-2 py-1 text-sm"
                        />
                    ) : (
                        <div className="text-sm font-medium text-gray-900 cursor-pointer">
                            {booking?.studio?.name || "Studio Name"}
                        </div>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                    <div className="text-sm text-gray-500">{convertTo12HourFormat(booking.timeSlot)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.personalInfo.fullName}</div>
                    <div className="text-sm text-gray-500">{booking.personalInfo.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.duration} hour(s)</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{priceFormat(booking.totalPrice)} </div>
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
                    {editMode ? (
                        <>
                            <button
                                onClick={handleUpdate}
                                disabled={updateLoading}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setEditMode(false)
                                    setEditData(null)
                                }}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleEdit}
                                className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                                <i className="fa-solid fa-edit"></i>
                            </button>
                            {booking.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => setConfirmPopup({ status: 'approved' })}
                                        disabled={statusLoading}
                                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => setConfirmPopup({ status: 'rejected' })}
                                        disabled={statusLoading}
                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
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
                            <li><strong>Time:</strong> {convertTo12HourFormat(booking.timeSlot)}</li>
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
                                disabled={statusLoading}
                                className={`cursor-pointer px-4 py-2 ${confirmPopup.status === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-main/90 hover:bg-main'} text-white rounded-lg  transition-colors`}
                            >
                                Confirm
                            </button>
                        </div>
                    </Popup>
                )}

                {message && (<Alert type="success">{message}</Alert>)}
            </AnimatePresence>
        </>
    );
}
