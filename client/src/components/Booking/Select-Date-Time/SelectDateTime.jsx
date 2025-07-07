import SelectDurationPersonsPar from './Select-Duration-Persons-Par/SelectDurationPersonsPar'
import Calendar from './Calendar/Calendar'
export default function SelectDateTime() {

    return (
        <>

            {/* Header */}
            <div >
                <h4 className="text-4xl font-bold py-2">Select the Date & Time</h4>
                <p className="text-gray-600 text-md mb-5">
                    Choose from the available time in our Studio Calendar 
                </p>
            </div>
            <div className="">

                {/* Duration And Person Number */}
                <SelectDurationPersonsPar />

                {/* Calendar */}
                <Calendar />

            </div>
        </>
    )
}