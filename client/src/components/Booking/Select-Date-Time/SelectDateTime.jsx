import SelectDurationPersonsPar from './Select-Duration-Persons-Par/SelectDurationPersonsPar'
import Calendar from './Calendar/Calendar'
export default function SelectDateTime() {

    return (
        <>

            <p className="text-gray-700 pb-3">Select your preferred date and time for the booking.</p>
            <div className="space-y-4 border border-gray-300 py-3 px-4 rounded-lg shadow-sm bg-white">

                {/* Duration And Person Number */}
                <SelectDurationPersonsPar />

                {/* Calendar */}
                <Calendar  />

            </div>
        </>
    )
}