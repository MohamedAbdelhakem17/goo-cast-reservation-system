import { useState } from 'react'
import { GetAvailableSlots } from '@/apis/Booking/booking.api'
import BookingLabel from '../../booking-label'
import { Calendar, Slots } from './_components'

export default function SelectDateTime() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const { mutate: getAvailableSlots, data: slots } = GetAvailableSlots()

    return (
        <>
            {/* Header */}
            <BookingLabel title="Select Date & Time" desc="Choose your preferred date and session duration" />

            {/* Calendar */}
            <Calendar openToggle={setIsOpen} getAvailableSlots={getAvailableSlots} />

            {/* Slots */}
            <Slots toggleSidebar={toggleSidebar} isOpen={isOpen} setIsOpen={setIsOpen} slots={slots?.data} />
        </>
    )
}