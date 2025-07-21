import SelectDurationPersonsPar from './Select-Duration-Persons-Par/SelectDurationPersonsPar'
import Calendar from './Calendar/Calendar'
import Slots from './Slots/Slots'
import { useState } from 'react'
import { GetAvailableSlots } from '../../../apis/Booking/booking.api'
import NavigationButtons from '../Navigation-Buttons/NavigationButtons'
export default function SelectDateTime() {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const { mutate: getAvailableSlots, data: slots } = GetAvailableSlots()
    return (
        <>


            <div className="">

                {/* Duration And Person Number */}
                <SelectDurationPersonsPar />

                {/* Calendar */}
                <Calendar openToggle={setIsOpen} getAvailableSlots={getAvailableSlots} />

                {/* Slots */}
                <Slots toggleSidebar={toggleSidebar} isOpen={isOpen} setIsOpen={setIsOpen} slots={slots?.data} />

                <NavigationButtons />
            </div>
        </>
    )
}