import Calendar from './Calendar/Calendar'
import Slots from './Slots/Slots'
import { useEffect, useState } from 'react'
import { GetAvailableSlots } from '../../../apis/Booking/booking.api'
import NavigationButtons from '../Navigation-Buttons/NavigationButtons'
import BookingHeader from '../../shared/Booking-Header/BookingHeader'
import { tracking } from '../../../GTM/gtm'
export default function SelectDateTime() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        tracking("view_content")
    }, [])
    
    const { mutate: getAvailableSlots, data: slots } = GetAvailableSlots()
    return (
        <>

            <BookingHeader title="Select Date & Time" desc="Choose your preferred date and session duration" />
            {/* Duration And Person Number */}
            {/* <SelectDurationPersonsPar /> */}

            {/* Calendar */}
            <Calendar openToggle={setIsOpen} getAvailableSlots={getAvailableSlots} />

            {/* Slots */}
            <Slots toggleSidebar={toggleSidebar} isOpen={isOpen} setIsOpen={setIsOpen} slots={slots?.data} />

        </>
    )
}